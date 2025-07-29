output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "s3_bucket" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.website.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}