# My DevOps Engineer Portfolio Website

🚀 **Live Site**: [https://fidelis.fozdigitalz.com](https://fidelis.fozdigitalz.com)

This is my personal portfolio website showcasing my DevOps & Platform Engineering expertise, cloud projects, and professional journey. Built with modern web technologies and deployed on AWS using Infrastructure as Code.

## 🎯 Purpose

I created this website to:
- Showcase my DevOps and cloud engineering skills
- Share my technical projects and achievements
- Provide an easy way for recruiters and colleagues to access my CV
- Demonstrate practical implementation of cloud architecture
- Share knowledge through integrated blog content

## ✨ Features

- **🎨 Modern Design**: Responsive, professional layout optimized for all devices
- **📱 Mobile-First**: Perfect experience on desktop, tablet, and mobile
- **📄 CV Integration**: Direct PDF download served via CloudFront CDN
- **🚀 Project Showcase**: Interactive display of my key DevOps projects
- **📝 Blog Integration**: Links to my technical articles and posts
- **🔗 Social Connectivity**: Easy access to LinkedIn, GitHub, and other profiles
- **📊 Privacy-First Analytics**: Custom CloudFront + CloudWatch analytics (no Google Analytics)
- **🔒 Security**: SSL/TLS encryption, security headers, and best practices

## 🏗️ Architecture & Infrastructure

### Frontend Stack
- **HTML5**: Semantic markup with SEO optimization
- **CSS3**: Modern styling with Flexbox/Grid, animations, and responsive design
- **Vanilla JavaScript**: Clean, lightweight interactions without frameworks
- **Font Awesome**: Professional iconography

### AWS Cloud Infrastructure
- **S3**: Static website hosting with versioning
- **CloudFront**: Global CDN with SSL/TLS and security headers
- **Route 53**: DNS management and domain routing
- **ACM**: SSL certificate management and auto-renewal
- **Lambda**: Log processing and analytics data transformation
- **CloudWatch**: Real-time monitoring, custom metrics, and dashboards
- **Athena**: Advanced log analytics and visitor insights
- **IAM**: Secure access control and least-privilege permissions

### DevOps & Automation
- **Terraform**: Complete Infrastructure as Code implementation
- **GitHub Actions**: Automated CI/CD pipeline
- **Git**: Version control with automated deployments
- **AWS CLI**: Deployment automation and management

## 📊 Analytics Implementation

I built a custom, privacy-compliant analytics solution, which replaced the Google Analytics I used earlier:

### Key Metrics Tracked
1. **Page Views** - Actual page visits (excluding static resources)
2. **Unique Visitors** - Based on unique IP addresses
3. **Error Rate** - Percentage of 4xx/5xx responses
4. **Bot Requests** - Automated traffic detection
5. **Data Transfer** - Bytes sent and bandwidth usage
6. **Geographic Distribution** - Visitor locations via CloudFront edge locations
7. **HTTP Status Codes** - Success/error response tracking
8. **User Agents** - Browser and device analytics
9. **Referrer Analysis** - Traffic source identification
10. **Performance Metrics** - Response times and optimization insights

### Analytics Architecture
```
CloudFront Logs → S3 → Lambda → CloudWatch Metrics → Dashboard
                              ↓
                            Athena → SQL Analytics
```

## 🚀 Deployment Process

My deployment is fully automated:

1. **Code Push**: I push changes to the `main` branch
2. **GitHub Actions**: Automatically triggers the CI/CD pipeline
3. **Terraform Apply**: Updates AWS infrastructure as needed
4. **S3 Sync**: Uploads website files to S3 bucket
5. **CloudFront Invalidation**: Clears CDN cache for immediate updates
6. **Verification**: Automated checks ensure successful deployment

### Special Commands
- **Auto Deploy**: Any push to `main` branch
- **Auto Destroy**: Commit message containing "destroy" 
- **Manual Control**: GitHub Actions workflow dispatch

## 📁 Project Structure

```
personal-site/
├── terraform/                 # Infrastructure as Code
│   ├── main.tf               # Provider and backend configuration
│   ├── s3.tf                 # S3 bucket for website hosting
│   ├── cloudfront.tf         # CDN and SSL configuration
│   ├── route53.tf            # DNS management
│   ├── analytics.tf          # Custom analytics infrastructure
│   └── athena_queries.tf     # Pre-built analytics queries
├── .github/workflows/        # CI/CD automation
│   └── deploy.yml           # GitHub Actions workflow
├── docs/                     # Documentation
│   ├── terraform-setup.md   # Infrastructure setup guide
│   ├── analytics-setup.md   # Analytics implementation guide
│   └── DEPLOYMENT.md        # Deployment instructions
├── index.html               # Main website file
├── about.html              # About page
├── projects.html           # Projects showcase
├── blog.html              # Blog integration
├── privacy-policy.html    # Privacy policy
├── styles.css             # CSS styling
├── script.js              # JavaScript functionality
├── profile.jpeg           # Profile photo (300x300px)
├── cv.pdf                # Resume/CV file
└── README.md             # This documentation
```

## 💰 Cost Optimization

I've optimized this setup for cost-effectiveness:
- **S3 Storage**: ~$0.50/month
- **CloudFront**: ~$1.00/month (with free tier)
- **Route 53**: ~$0.50/month
- **Lambda**: ~$0.01/month
- **CloudWatch**: ~$6.00/month (metrics + dashboard)
- **Total**: ~$8/month for enterprise-grade infrastructure

## 🔒 Security Features

- **SSL/TLS Encryption**: End-to-end HTTPS with AWS Certificate Manager
- **Security Headers**: HSTS, CSP, X-Frame-Options, and more
- **Origin Access Control**: S3 bucket only accessible via CloudFront
- **IAM Best Practices**: Least-privilege access controls
- **Privacy Compliance**: GDPR-compliant analytics without cookies

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/personal-site.git
cd personal-site

# Open in browser for local testing
open index.html

# Deploy infrastructure (requires AWS credentials)
cd terraform
terraform init
terraform plan
terraform apply
```

## 📈 Performance Metrics

- **Global CDN**: Sub-100ms response times worldwide
- **Lighthouse Score**: 95+ across all categories
- **Mobile Optimized**: Perfect responsive design
- **SEO Optimized**: Structured data and meta tags
- **Accessibility**: WCAG 2.1 AA compliant

## 🔄 Continuous Improvement

I continuously enhance this project by:
- Monitoring performance metrics and user analytics
- Implementing new AWS services and features
- Optimizing costs and security posture
- Adding new content and project showcases
- Refining the user experience based on feedback

## 📞 Contact & Feedback

I'm always open to feedback and collaboration opportunities!

- **Website**: [https://fidelis.fozdigitalz.com](https://fidelis.fozdigitalz.com)
- **LinkedIn**: [Connect with me](https://linkedin.com/in/your-profile)
- **GitHub**: [Follow my projects](https://github.com/Fidelisesq)

## 📄 License

This project is open source and available under the MIT License. Feel free to use it as inspiration for your own portfolio!

---

*Built with ❤️ using AWS, Terraform, and modern web technologies*