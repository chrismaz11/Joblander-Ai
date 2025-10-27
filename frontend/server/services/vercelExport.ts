import { Resume } from "../../shared/schema.js";
import { generatePortfolioHTML, PortfolioOptions } from "./portfolioGenerator";

export interface VercelExportPackage {
  files: {
    name: string;
    content: string;
  }[];
  instructions: string;
}

export function generateVercelConfig(): string {
  return JSON.stringify({
    version: 2,
    name: "portfolio",
    builds: [
      {
        src: "index.html",
        use: "@vercel/static"
      }
    ],
    routes: [
      {
        src: "/(.*)",
        dest: "/index.html"
      }
    ],
    regions: ["iad1"],
    headers: [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400"
          }
        ]
      }
    ]
  }, null, 2);
}

export function generatePackageJson(name: string): string {
  return JSON.stringify({
    name: name.toLowerCase().replace(/\s+/g, '-') + '-portfolio',
    version: "1.0.0",
    description: `Portfolio website for ${name}`,
    private: true,
    scripts: {
      build: "echo 'Static site, no build required'"
    }
  }, null, 2);
}

export function generateGitIgnore(): string {
  return `.DS_Store
node_modules
.vercel
*.log
.env
.env.local
.env.production`;
}

export function generateDeploymentInstructions(portfolioName: string): string {
  return `# ${portfolioName} - Portfolio Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Deploy your portfolio**:
   \`\`\`bash
   vercel
   \`\`\`
   
   Follow the prompts:
   - Set up and deploy: **Y**
   - Which scope: Select your account
   - Link to existing project: **N** (for first deployment)
   - Project name: Enter your desired project name
   - Directory: **./** (current directory)
   - Override settings: **N**

3. **Your portfolio will be live!** 🎉
   Vercel will provide you with a URL like: \`https://your-portfolio.vercel.app\`

### Option 2: Deploy via GitHub

1. **Create a GitHub repository**:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   \`\`\`

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Automatic deployments** are now enabled!
   Every push to \`main\` will trigger a new deployment.

### Option 3: Drag & Drop Deploy

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Drag and drop this folder into the browser
4. Click "Deploy"

## Custom Domain Setup

1. In your Vercel dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### DNS Configuration Examples:

**For apex domain (example.com)**:
- Type: A
- Name: @
- Value: 76.76.21.21

**For subdomain (portfolio.example.com)**:
- Type: CNAME
- Name: portfolio
- Value: cname.vercel-dns.com

## Environment Variables (Optional)

If you want to add analytics or contact form:

1. **Google Analytics**:
   - Replace \`GA_MEASUREMENT_ID\` in index.html with your actual ID
   
2. **Formspree Contact Form**:
   - Sign up at [formspree.io](https://formspree.io)
   - Replace \`YOUR_FORM_ID\` in index.html with your form ID

## GitHub Actions Workflow (Optional)

Create \`.github/workflows/deploy.yml\`:

\`\`\`yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
\`\`\`

## Performance Optimization

Your portfolio is already optimized with:
- ✅ Minimal CSS (inline for zero extra requests)
- ✅ No JavaScript dependencies
- ✅ Responsive design
- ✅ SEO meta tags
- ✅ Open Graph tags for social sharing
- ✅ Smooth animations
- ✅ Lazy loading for images (if added)

## Monitoring & Analytics

1. **Vercel Analytics** (Built-in):
   - Enable in project settings
   - No code changes required

2. **Google Analytics**:
   - Already prepared in the template
   - Just add your measurement ID

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Community Discord](https://vercel.com/discord)

---

**Pro Tips:**
- Use Vercel's preview deployments for testing changes
- Enable "Auto-assign Custom Domains" for automatic HTTPS
- Use Vercel Analytics to track visitor engagement
- Set up alerts for deployment failures

Enjoy your new portfolio! 🚀`;
}

export function generateGitHubActionsWorkflow(): string {
  return `name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: \${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: \${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  preview:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --token=\${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel (Preview)
        run: |
          vercel --token=\${{ secrets.VERCEL_TOKEN }} > deployment-url.txt
          echo "Preview URL: $(cat deployment-url.txt)"
      
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const url = fs.readFileSync('deployment-url.txt', 'utf8').trim();
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployment: ' + url
            });

  production:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --token=\${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel (Production)
        run: vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}`;
}

export function createPortfolioExportPackage(
  resume: Resume,
  options: PortfolioOptions
): VercelExportPackage {
  const portfolioHTML = generatePortfolioHTML(resume, options);
  const vercelConfig = generateVercelConfig();
  const packageJson = generatePackageJson(resume.personalInfo.fullName);
  const gitignore = generateGitIgnore();
  const instructions = generateDeploymentInstructions(resume.personalInfo.fullName);
  const githubWorkflow = generateGitHubActionsWorkflow();

  return {
    files: [
      { name: 'index.html', content: portfolioHTML },
      { name: 'vercel.json', content: vercelConfig },
      { name: 'package.json', content: packageJson },
      { name: '.gitignore', content: gitignore },
      { name: 'README.md', content: instructions },
      { name: '.github/workflows/deploy.yml', content: githubWorkflow }
    ],
    instructions
  };
}

export function createDownloadableZip(files: { name: string; content: string }[]): Blob {
  // This would normally use a library like JSZip, but for now we'll return 
  // a simple representation that the frontend can handle
  const boundary = '----FormBoundary' + Math.random().toString(36);
  let data = '';
  
  files.forEach(file => {
    data += `--${boundary}\r\n`;
    data += `Content-Disposition: attachment; filename="${file.name}"\r\n`;
    data += `Content-Type: text/plain\r\n\r\n`;
    data += file.content + '\r\n';
  });
  
  data += `--${boundary}--\r\n`;
  
  return new Blob([data], { type: 'multipart/form-data; boundary=' + boundary });
}