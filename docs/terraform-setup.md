# Terraform CI/CD Setup

## Prerequisites

1. **Terraform state** stored in existing bucket:
   - Bucket: `foz-terraform-state-bucket`
   - Key: `devops-portfolio/terraform.tfstate`

2. **GitHub Secrets** (Repository Settings → Secrets and variables → Actions):
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

## Deployment Triggers

### Automatic Deploy
- Push to `main` branch → Deploys automatically
- Manual dispatch → Choose "deploy" action

### Automatic Destroy
- Commit message contains "destroy" → Destroys infrastructure
- Manual dispatch → Choose "destroy" action

## Usage Examples

```bash
# Deploy
git add .
git commit -m "Update website content"
git push origin main

# Destroy
git add .
git commit -m "destroy infrastructure for maintenance"
git push origin main
```

## Manual Dispatch
1. Go to GitHub Actions tab
2. Select "Deploy Personal Website"
3. Click "Run workflow"
4. Choose "deploy" or "destroy"