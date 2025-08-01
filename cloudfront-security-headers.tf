# CloudFront Security Headers Configuration
# Add this to your Terraform CloudFront distribution

resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "personal-site-security-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                   = true
      override                  = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }

  custom_headers_config {
    items {
      header   = "X-XSS-Protection"
      value    = "1; mode=block"
      override = true
    }
    items {
      header   = "Permissions-Policy"
      value    = "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()"
      override = true
    }
    items {
      header   = "Content-Security-Policy"
      value    = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none';"
      override = true
    }
  }
}

# Apply to your CloudFront distribution
resource "aws_cloudfront_distribution" "main" {
  # ... your existing configuration ...
  
  default_cache_behavior {
    # ... your existing cache behavior ...
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }
}