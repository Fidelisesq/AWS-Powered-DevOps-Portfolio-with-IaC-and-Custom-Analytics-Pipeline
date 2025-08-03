# Athena Workgroup
resource "aws_athena_workgroup" "portfolio" {
  name = "portfolio-analytics"
  
  configuration {
    result_configuration {
      output_location = "s3://${aws_s3_bucket.logs.bucket}/athena-results/"
    }
  }
}

# Useful Athena Queries
resource "aws_athena_named_query" "top_pages" {
  name        = "top_pages_last_7_days"
  database    = aws_athena_database.logs.name
  workgroup   = aws_athena_workgroup.portfolio.name
  description = "Get top 10 most visited pages in the last 7 days"
  query       = <<EOF
SELECT 
  cs_uri_stem as page,
  COUNT(*) as visits,
  COUNT(DISTINCT c_ip) as unique_visitors
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '7' day
  AND cs_method = 'GET'
  AND sc_status = 200
  AND cs_uri_stem NOT LIKE '%.css'
  AND cs_uri_stem NOT LIKE '%.js'
  AND cs_uri_stem NOT LIKE '%.png'
  AND cs_uri_stem NOT LIKE '%.jpg'
  AND cs_uri_stem NOT LIKE '%.ico'
GROUP BY cs_uri_stem
ORDER BY visits DESC
LIMIT 10
EOF
}

resource "aws_athena_named_query" "visitor_analytics" {
  name        = "visitor_analytics_daily"
  database    = aws_athena_database.logs.name
  workgroup   = aws_athena_workgroup.portfolio.name
  description = "Daily visitor analytics for the last 30 days"
  query       = <<EOF
SELECT 
  date(date_time) as visit_date,
  COUNT(*) as total_requests,
  COUNT(DISTINCT c_ip) as unique_visitors,
  COUNT(CASE WHEN sc_status >= 400 THEN 1 END) as errors,
  AVG(time_taken) as avg_response_time,
  SUM(sc_bytes) as total_bytes_sent
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '30' day
GROUP BY date(date_time)
ORDER BY visit_date DESC
EOF
}

resource "aws_athena_named_query" "geographic_distribution" {
  name        = "geographic_distribution"
  database    = aws_athena_database.logs.name
  workgroup   = aws_athena_workgroup.portfolio.name
  description = "Geographic distribution of visitors"
  query       = <<EOF
SELECT 
  SUBSTR(x_edge_location, 1, 3) as edge_location,
  COUNT(*) as requests,
  COUNT(DISTINCT c_ip) as unique_visitors
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '7' day
GROUP BY SUBSTR(x_edge_location, 1, 3)
ORDER BY requests DESC
LIMIT 20
EOF
}

resource "aws_athena_named_query" "user_agents" {
  name        = "top_user_agents"
  database    = aws_athena_database.logs.name
  workgroup   = aws_athena_workgroup.portfolio.name
  description = "Top user agents (browsers/devices)"
  query       = <<EOF
SELECT 
  CASE 
    WHEN cs_user_agent LIKE '%Chrome%' THEN 'Chrome'
    WHEN cs_user_agent LIKE '%Firefox%' THEN 'Firefox'
    WHEN cs_user_agent LIKE '%Safari%' AND cs_user_agent NOT LIKE '%Chrome%' THEN 'Safari'
    WHEN cs_user_agent LIKE '%Edge%' THEN 'Edge'
    WHEN cs_user_agent LIKE '%bot%' OR cs_user_agent LIKE '%crawler%' THEN 'Bot'
    ELSE 'Other'
  END as browser,
  COUNT(*) as requests,
  COUNT(DISTINCT c_ip) as unique_users
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '7' day
  AND cs_method = 'GET'
GROUP BY 1
ORDER BY requests DESC
EOF
}

resource "aws_athena_named_query" "referrer_analysis" {
  name        = "top_referrers"
  database    = aws_athena_database.logs.name
  workgroup   = aws_athena_workgroup.portfolio.name
  description = "Top referrers bringing traffic to the site"
  query       = <<EOF
SELECT 
  CASE 
    WHEN cs_referer = '-' THEN 'Direct Traffic'
    WHEN cs_referer LIKE '%google%' THEN 'Google'
    WHEN cs_referer LIKE '%linkedin%' THEN 'LinkedIn'
    WHEN cs_referer LIKE '%github%' THEN 'GitHub'
    WHEN cs_referer LIKE '%twitter%' THEN 'Twitter'
    ELSE regexp_extract(cs_referer, 'https?://([^/]+)', 1)
  END as referrer_source,
  COUNT(*) as visits,
  COUNT(DISTINCT c_ip) as unique_visitors
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '7' day
  AND cs_method = 'GET'
  AND sc_status = 200
GROUP BY 1
ORDER BY visits DESC
LIMIT 15
EOF
}