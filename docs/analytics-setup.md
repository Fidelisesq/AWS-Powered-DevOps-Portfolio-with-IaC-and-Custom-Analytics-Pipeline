# Portfolio Analytics Setup

This document explains the CloudFront + CloudWatch analytics implementation for tracking website visitors and user behavior.

## Architecture Overview

```
CloudFront → S3 Logs → Lambda → CloudWatch Metrics → Dashboard
                    ↓
                  Athena → SQL Queries
```

## Components

### 1. S3 Bucket for Logs
- **Bucket**: `fidelis-portfolio-site-logs`
- **Purpose**: Store CloudFront access logs
- **Lifecycle**: Logs deleted after 90 days
- **Location**: `s3://fidelis-portfolio-site-logs/access-logs/`

### 2. Lambda Function
- **Name**: `portfolio-analytics`
- **Runtime**: Python 3.9
- **Trigger**: S3 object creation events
- **Purpose**: Parse logs and send metrics to CloudWatch

### 3. CloudWatch Metrics (10 Key Metrics)
1. **PageViews** - Total page views (excluding static resources)
2. **UniqueVisitors** - Unique IP addresses
3. **ErrorRate** - Percentage of 4xx/5xx responses
4. **BotRequests** - Requests from bots/crawlers
5. **BytesSent** - Total data transferred
6. **TotalRequests** - All HTTP requests
7. **Status200** - Successful requests
8. **Status404** - Not found errors
9. **Status500** - Server errors
10. **UniqueCountries** - Geographic reach

### 4. CloudWatch Dashboard
- **Name**: Portfolio-Analytics
- **URL**: AWS Console → CloudWatch → Dashboards
- **Widgets**: 7 widgets showing all key metrics

### 5. Athena Analysis
- **Database**: `portfolio_logs`
- **Table**: `cloudfront_logs`
- **Workgroup**: `portfolio-analytics`

## Pre-built Athena Queries

### Top Pages (Last 7 Days)
```sql
SELECT 
  cs_uri_stem as page,
  COUNT(*) as visits,
  COUNT(DISTINCT c_ip) as unique_visitors
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '7' day
  AND cs_method = 'GET'
  AND sc_status = 200
GROUP BY cs_uri_stem
ORDER BY visits DESC
LIMIT 10
```

### Daily Visitor Analytics
```sql
SELECT 
  date(date_time) as visit_date,
  COUNT(*) as total_requests,
  COUNT(DISTINCT c_ip) as unique_visitors,
  COUNT(CASE WHEN sc_status >= 400 THEN 1 END) as errors
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '30' day
GROUP BY date(date_time)
ORDER BY visit_date DESC
```

### Geographic Distribution
```sql
SELECT 
  SUBSTR(x_edge_location, 1, 3) as edge_location,
  COUNT(*) as requests,
  COUNT(DISTINCT c_ip) as unique_visitors
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '7' day
GROUP BY SUBSTR(x_edge_location, 1, 3)
ORDER BY requests DESC
```

### Browser Analysis
```sql
SELECT 
  CASE 
    WHEN cs_user_agent LIKE '%Chrome%' THEN 'Chrome'
    WHEN cs_user_agent LIKE '%Firefox%' THEN 'Firefox'
    WHEN cs_user_agent LIKE '%Safari%' THEN 'Safari'
    WHEN cs_user_agent LIKE '%Edge%' THEN 'Edge'
    ELSE 'Other'
  END as browser,
  COUNT(*) as requests
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '7' day
GROUP BY 1
ORDER BY requests DESC
```

### Referrer Analysis
```sql
SELECT 
  CASE 
    WHEN cs_referer = '-' THEN 'Direct Traffic'
    WHEN cs_referer LIKE '%google%' THEN 'Google'
    WHEN cs_referer LIKE '%linkedin%' THEN 'LinkedIn'
    WHEN cs_referer LIKE '%github%' THEN 'GitHub'
    ELSE regexp_extract(cs_referer, 'https?://([^/]+)', 1)
  END as referrer_source,
  COUNT(*) as visits
FROM cloudfront_logs 
WHERE date_time >= current_timestamp - interval '7' day
GROUP BY 1
ORDER BY visits DESC
```

## Deployment

1. **Apply Terraform**:
   ```bash
   cd terraform
   terraform plan
   terraform apply
   ```

2. **Wait for Logs**: CloudFront logs appear within 24 hours

3. **Create Athena Table**: Run the `create_cloudfront_logs_table` query in Athena

4. **View Dashboard**: Go to CloudWatch → Dashboards → Portfolio-Analytics

## Cost Estimate

- **S3 Storage**: ~$0.001/month
- **Lambda**: ~$0.01/month  
- **CloudWatch Metrics**: ~$3.00/month
- **CloudWatch Dashboard**: ~$3.00/month
- **Athena Queries**: ~$0.10/month

**Total**: ~$6-7/month

## Privacy Compliance

- No cookies or client-side tracking
- Server-side log analysis only
- IP addresses not stored permanently
- GDPR compliant by design
- No personal data collection

## Monitoring

- **Lambda Errors**: Check CloudWatch Logs for `portfolio-analytics`
- **Missing Metrics**: Verify S3 bucket permissions
- **Dashboard Issues**: Check metric namespace `Portfolio`

## Maintenance

- Logs auto-delete after 90 days
- Athena results auto-delete after 30 days
- Lambda runs automatically on new log files
- Daily processing via EventBridge at 2 AM UTC