# S3 Bucket for CloudFront Logs
resource "aws_s3_bucket" "logs" {
  bucket = "fidelis-portfolio-site-logs"
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "logs" {
  depends_on = [aws_s3_bucket_ownership_controls.logs]
  bucket     = aws_s3_bucket.logs.id
  acl        = "log-delivery-write"
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule {
    id     = "delete_old_logs"
    status = "Enabled"
    expiration {
      days = 90
    }
  }
}

# Lambda IAM Role
resource "aws_iam_role" "analytics_lambda" {
  name = "analytics-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "analytics_lambda" {
  name = "analytics-lambda-policy"
  role = aws_iam_role.analytics_lambda.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.logs.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
      }
    ]
  })
}

# Create Lambda deployment package
data "archive_file" "analytics_lambda" {
  type        = "zip"
  source_file = "${path.module}/analytics_lambda.py"
  output_path = "${path.module}/analytics_lambda.zip"
}

# Lambda Function
resource "aws_lambda_function" "analytics" {
  filename         = data.archive_file.analytics_lambda.output_path
  function_name    = "portfolio-analytics"
  role            = aws_iam_role.analytics_lambda.arn
  handler         = "analytics_lambda.handler"
  runtime         = "python3.9"
  timeout         = 60
  source_code_hash = data.archive_file.analytics_lambda.output_base64sha256

  depends_on = [data.archive_file.analytics_lambda]
}

# Lambda trigger from S3
resource "aws_s3_bucket_notification" "logs" {
  bucket = aws_s3_bucket.logs.id
  lambda_function {
    lambda_function_arn = aws_lambda_function.analytics.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "access-logs/"
  }
  depends_on = [aws_lambda_permission.s3_invoke]
}

resource "aws_lambda_permission" "s3_invoke" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.analytics.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.logs.arn
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "analytics" {
  dashboard_name = "Portfolio-Analytics"
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 8
        height = 6
        properties = {
          metrics = [
            ["Portfolio", "PageViews"],
            ["Portfolio", "UniqueVisitors"]
          ]
          period = 3600
          stat   = "Sum"
          region = var.aws_region
          title  = "Traffic Overview"
        }
      },
      {
        type   = "metric"
        x      = 8
        y      = 0
        width  = 8
        height = 6
        properties = {
          metrics = [
            ["Portfolio", "ErrorRate"]
          ]
          period = 3600
          stat   = "Average"
          region = var.aws_region
          title  = "Error Rate %"
        }
      },
      {
        type   = "metric"
        x      = 16
        y      = 0
        width  = 8
        height = 6
        properties = {
          metrics = [
            ["Portfolio", "BotRequests"]
          ]
          period = 3600
          stat   = "Sum"
          region = var.aws_region
          title  = "Bot Requests"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 8
        height = 6
        properties = {
          metrics = [
            ["Portfolio", "Status200"],
            ["Portfolio", "Status404"],
            ["Portfolio", "Status500"]
          ]
          period = 3600
          stat   = "Sum"
          region = var.aws_region
          title  = "HTTP Status Codes"
        }
      },
      {
        type   = "metric"
        x      = 8
        y      = 6
        width  = 8
        height = 6
        properties = {
          metrics = [
            ["Portfolio", "BytesSent"]
          ]
          period = 3600
          stat   = "Sum"
          region = var.aws_region
          title  = "Data Transfer (Bytes)"
        }
      },
      {
        type   = "metric"
        x      = 16
        y      = 6
        width  = 8
        height = 6
        properties = {
          metrics = [
            ["Portfolio", "TotalRequests"]
          ]
          period = 3600
          stat   = "Sum"
          region = var.aws_region
          title  = "Total Requests"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["Portfolio", "UniqueCountries"]
          ]
          period = 3600
          stat   = "Maximum"
          region = var.aws_region
          title  = "Geographic Reach (Countries)"
        }
      }
    ]
  })
}

# Athena Database
resource "aws_athena_database" "logs" {
  name   = "portfolio_logs"
  bucket = aws_s3_bucket.logs.bucket
}

# S3 Bucket for Athena Results
resource "aws_s3_bucket" "athena_results" {
  bucket = "fidelis-portfolio-athena-results"
}

resource "aws_s3_bucket_lifecycle_configuration" "athena_results" {
  bucket = aws_s3_bucket.athena_results.id
  rule {
    id     = "delete_old_results"
    status = "Enabled"
    expiration {
      days = 30
    }
  }
}

# Athena Table for CloudFront Logs
resource "aws_athena_named_query" "create_table" {
  name        = "create_cloudfront_logs_table"
  database    = aws_athena_database.logs.name
  workgroup   = aws_athena_workgroup.portfolio.name
  description = "Create table for CloudFront access logs analysis"
  query       = <<EOF
CREATE EXTERNAL TABLE IF NOT EXISTS cloudfront_logs (
  date_time timestamp,
  x_edge_location string,
  sc_bytes bigint,
  c_ip string,
  cs_method string,
  cs_host string,
  cs_uri_stem string,
  sc_status int,
  cs_referer string,
  cs_user_agent string,
  cs_uri_query string,
  cs_cookie string,
  x_edge_result_type string,
  x_edge_request_id string,
  x_host_header string,
  cs_protocol string,
  cs_bytes bigint,
  time_taken float,
  x_forwarded_for string,
  ssl_protocol string,
  ssl_cipher string,
  x_edge_response_result_type string,
  cs_protocol_version string,
  fle_status string,
  fle_encrypted_fields int,
  c_port int,
  time_to_first_byte float,
  x_edge_detailed_result_type string,
  sc_content_type string,
  sc_content_len bigint,
  sc_range_start bigint,
  sc_range_end bigint
)
STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION 's3://${aws_s3_bucket.logs.bucket}/access-logs/'
TBLPROPERTIES ('skip.header.line.count'='2')
EOF
}

# EventBridge Rule for Daily Processing
resource "aws_cloudwatch_event_rule" "daily_analytics" {
  name                = "daily-analytics-processing"
  description         = "Trigger analytics processing daily"
  schedule_expression = "cron(0 2 * * ? *)"
}

resource "aws_cloudwatch_event_target" "lambda" {
  rule      = aws_cloudwatch_event_rule.daily_analytics.name
  target_id = "AnalyticsLambdaTarget"
  arn       = aws_lambda_function.analytics.arn
}

resource "aws_lambda_permission" "eventbridge_invoke" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.analytics.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_analytics.arn
}