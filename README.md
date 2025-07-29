# DevOps Engineer Personal Website

A modern, professional website showcasing your DevOps expertise, projects, and experience.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional Layout**: Clean, modern design suitable for a DevOps Engineer
- **CV Download**: Direct link to your PDF CV (supports S3, Google Drive, etc.)
- **Project Showcase**: Highlight your key DevOps projects
- **Blog Integration**: Link to your technical blog posts
- **Social Links**: Connect to LinkedIn, GitHub, Twitter, and blog

## Quick Setup

1. **Update Personal Information**:
   - Edit `index.html` and replace placeholder text with your details
   - Update name, title, description, email, location

2. **Add Your CV**:
   - Place your CV file as `cv.pdf` in the root directory
   - It will be automatically uploaded to S3 and served via CloudFront

3. **Add Your Profile Picture**:
   - Add your `profile.jpeg` photo (150x150px recommended)

4. **Add Your Projects**:
   - Update project descriptions in `index.html`
   - Add GitHub/GitLab links in `script.js`

5. **Update Social Links**:
   - Modify social media URLs in `script.js`

## CV Setup

Simply place your CV as `cv.pdf` in the root directory. The deployment process will:
- Upload it to the same S3 bucket
- Serve it via CloudFront CDN
- Make it available at `https://fidelis.fozdigitalz.com/cv.pdf`

## Deployment

This project uses **Terraform + GitHub Actions** for automated CI/CD:

- **Auto Deploy**: Push to `main` branch
- **Auto Destroy**: Commit message contains "destroy"
- **Manual Control**: GitHub Actions workflow dispatch

See `docs/terraform-setup.md` for detailed setup instructions.

## Customization

- **Colors**: Modify CSS variables in `styles.css`
- **Fonts**: Update font imports in `index.html`
- **Sections**: Add/remove sections as needed
- **Skills**: Update the technology tags in the About section

## File Structure
```
personal-site/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript
- Font Awesome icons
- Responsive design principles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.