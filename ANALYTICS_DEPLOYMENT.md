# Analytics Deployment Guide

## Quick Deployment Steps

### 1. Deploy Infrastructure
```bash
cd terraform
terraform plan
terraform apply
```

### 2. Wait for CloudFront Logs
- CloudFront logs appear within 24 hours
- Check S3 bucket: `fidelis-portfolio-site-logs`

### 3. Create Athena Table
1. Go to AWS Console → Athena
2. Select workgroup: `portfolio-analytics`
3. Run the saved query: `create_cloudfront_logs_table`

### 4. View Analytics
- **Real-time metrics**: CloudWatch → Dashboards → Portfolio-Analytics
- **Detailed analysis**: Athena → Run saved queries

## What Gets Created

### Infrastructure
- ✅ S3 bucket for logs: `fidelis-portfolio-site-logs`
- ✅ S3 bucket for Athena results: `fidelis-portfolio-athena-results`
- ✅ Lambda function: `portfolio-analytics`
- ✅ CloudWatch dashboard: `Portfolio-Analytics`
- ✅ Athena database: `portfolio_logs`
- ✅ Athena workgroup: `portfolio-analytics`

### Analytics Features
- ✅ **10 Key Metrics** tracked automatically
- ✅ **Real-time dashboard** with 7 widgets
- ✅ **5 Pre-built Athena queries** for deep analysis
- ✅ **Privacy-compliant** (no client-side tracking)
- ✅ **Cost-optimized** (~$6-7/month)

## The 10 Key Metrics

1. **Page Views** - Actual page visits (excludes static files)
2. **Unique Visitors** - Based on unique IP addresses
3. **Error Rate** - Percentage of failed requests
4. **Bot Requests** - Automated traffic detection
5. **Bytes Sent** - Data transfer volume
6. **Total Requests** - All HTTP requests
7. **Status 200** - Successful requests
8. **Status 404** - Page not found errors
9. **Status 500** - Server errors
10. **Unique Countries** - Geographic reach

## Athena Analysis Queries

### 1. Top Pages (Last 7 Days)
Shows most popular pages with visitor counts

### 2. Daily Visitor Analytics
30-day trend of visitors, requests, and errors

### 3. Geographic Distribution
Where your visitors are coming from (by CloudFront edge location)

### 4. Browser/Device Analysis
What browsers and devices visitors use

### 5. Referrer Analysis
How visitors find your site (Google, LinkedIn, direct, etc.)

## Verification Steps

### Check CloudFront Logging
```bash
aws s3 ls s3://fidelis-portfolio-site-logs/access-logs/
```

### Check Lambda Function
```bash
aws lambda get-function --function-name portfolio-analytics
```

### Check CloudWatch Metrics
```bash
aws cloudwatch list-metrics --namespace Portfolio
```

### Test Athena Query
1. Go to Athena console
2. Select `portfolio-analytics` workgroup
3. Run: `SELECT COUNT(*) FROM cloudfront_logs LIMIT 10`

## Troubleshooting

### No Logs in S3
- Wait 24 hours for first logs
- Check CloudFront distribution has logging enabled
- Verify S3 bucket permissions

### Lambda Not Processing
- Check CloudWatch Logs for `portfolio-analytics`
- Verify S3 event notifications are configured
- Check Lambda execution role permissions

### No Metrics in CloudWatch
- Verify Lambda is processing logs successfully
- Check CloudWatch namespace `Portfolio`
- Ensure metrics are being sent (check Lambda logs)

### Athena Queries Failing
- Run table creation query first
- Check S3 bucket has log files
- Verify Athena workgroup configuration

## Cost Monitoring

Monitor costs in AWS Cost Explorer:
- **S3 Storage**: Should be <$1/month
- **Lambda**: Should be <$1/month
- **CloudWatch**: ~$6/month (metrics + dashboard)
- **Athena**: Pay per query (~$5/TB scanned)

## Next Steps

1. **Deploy now**: Run `terraform apply`
2. **Wait 24 hours**: For first CloudFront logs
3. **Create Athena table**: Run the saved query
4. **Explore dashboard**: View real-time metrics
5. **Run Athena queries**: Get detailed insights

Your privacy-compliant analytics will be ready! 🚀