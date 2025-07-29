variable "domain_name" {
  description = "The domain name for the website"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name for website hosting"
  type        = string
  default     = "portfolio-site-bucket"
}

variable "certificate_domain" {
  description = "Domain pattern for SSL certificate"
  type        = string
  default     = "fozdigitalz.com"
}

variable "hosted_zone_name" {
  description = "Route53 hosted zone name"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}