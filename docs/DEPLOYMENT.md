# Deployment Guide

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. SSL certificate for `*.fozdigitalz.com` in us-east-1 region
3. Hosted zone for `fozdigitalz.com` already exists

## Quick Deployment

1. **Get your certificate ARN**:
   ```powershell
   aws acm list-certificates --region us-east-1 --query "CertificateSummaryList[?DomainName=='*.fozdigitalz.com'].CertificateArn" --output text
   ```

2. **Deploy the infrastructure**:
   ```powershell
   .\deploy.ps1 -CertificateArn "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"
   ```

3. **Update your CV URL** in `script.js`:
   ```javascript
   // For S3 hosted CV:
   const cvUrl = 'https://fidelis.fozdigitalz.com/your-cv.pdf';
   
   // Or upload CV to the same S3 bucket and reference it
   const cvUrl = 'https://your-bucket-name.s3.amazonaws.com/cv.pdf';
   ```

## Manual Steps (Alternative)

If you prefer manual deployment:

1. **Create S3 bucket** for website hosting
2. **Deploy CloudFormation** template with your certificate ARN
3. **Upload files** to S3 bucket
4. **Create CloudFront invalidation** after updates

## Post-Deployment

- Website will be available at: `https://fidelis.fozdigitalz.com`
- DNS propagation may take 5-10 minutes
- CloudFront distribution may take 15-20 minutes to fully deploy

## Updating Content

After making changes to your website:

```powershell
# Upload updated files
aws s3 sync . s3://your-bucket-name --exclude "*.yaml" --exclude "*.ps1" --exclude "*.md"

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"
```