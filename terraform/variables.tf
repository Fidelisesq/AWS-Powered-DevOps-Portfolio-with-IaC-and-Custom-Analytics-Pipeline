variable "domain_name" {
  description = "The domain name for the website"
  type        = string
  default  = "fidelis.fozdigitalz.com"
}

variable "bucket_name" {
  description = "S3 bucket name for website hosting"
  type        = string
  default     = "portfolio-site-bucket"
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}