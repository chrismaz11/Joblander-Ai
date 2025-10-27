import { Resume } from "../../shared/schema.js";

export interface PortfolioTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  gradients?: string[];
}

export interface PortfolioOptions {
  theme: string;
  font: string;
  layout: "sidebar" | "centered" | "full-width";
  includeContactForm?: boolean;
  includeAnalytics?: boolean;
}

export const portfolioThemes: Record<string, PortfolioTheme> = {
  professionalBlue: {
    name: "Professional Blue",
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    accentColor: "#06b6d4",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    gradients: ["linear-gradient(135deg, #667eea 0%, #764ba2 100%)"]
  },
  modernDark: {
    name: "Modern Dark",
    primaryColor: "#8b5cf6",
    secondaryColor: "#a78bfa",
    backgroundColor: "#0f172a",
    textColor: "#e2e8f0",
    accentColor: "#f59e0b",
    fontFamily: "Space Grotesk, system-ui, sans-serif",
    gradients: ["linear-gradient(to right, #4f46e5, #7c3aed)"]
  },
  minimalLight: {
    name: "Minimal Light",
    primaryColor: "#000000",
    secondaryColor: "#6b7280",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    accentColor: "#ef4444",
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    gradients: []
  },
  creativeGradient: {
    name: "Creative Gradient",
    primaryColor: "#ec4899",
    secondaryColor: "#f43f5e",
    backgroundColor: "#fef2f2",
    textColor: "#1f2937",
    accentColor: "#06b6d4",
    fontFamily: "Poppins, system-ui, sans-serif",
    gradients: [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    ]
  },
  techTerminal: {
    name: "Tech Terminal",
    primaryColor: "#10b981",
    secondaryColor: "#34d399",
    backgroundColor: "#0a0a0a",
    textColor: "#10b981",
    accentColor: "#facc15",
    fontFamily: "JetBrains Mono, monospace",
    gradients: ["linear-gradient(to bottom, #0a0a0a, #1a1a1a)"]
  }
};

export function generatePortfolioHTML(
  resume: Resume,
  options: PortfolioOptions = {
    theme: "professionalBlue",
    font: "Inter",
    layout: "centered"
  }
): string {
  const theme = portfolioThemes[options.theme] || portfolioThemes.professionalBlue;
  const { personalInfo, experience = [], education = [], skills = [] } = resume;

  const layoutClass = options.layout === "sidebar" ? "layout-sidebar" : 
                     options.layout === "full-width" ? "layout-full" : "layout-centered";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <meta name="description" content="Portfolio of ${personalInfo.fullName} - ${personalInfo.summary || 'Professional Portfolio'}">
    
    <!-- SEO Meta Tags -->
    <meta property="og:title" content="${personalInfo.fullName} - Portfolio">
    <meta property="og:description" content="${personalInfo.summary || 'Professional Portfolio'}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://portfolio.com">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: ${theme.primaryColor};
            --secondary: ${theme.secondaryColor};
            --bg: ${theme.backgroundColor};
            --text: ${theme.textColor};
            --accent: ${theme.accentColor};
            --font: ${theme.fontFamily};
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html {
            scroll-behavior: smooth;
        }
        
        body {
            font-family: var(--font);
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        /* Navigation */
        .nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(${theme.backgroundColor === '#ffffff' ? '255,255,255' : '15,23,42'}, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            padding: 1rem 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .nav-brand {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: var(--text);
            text-decoration: none;
            transition: color 0.3s;
            font-weight: 500;
        }
        
        .nav-links a:hover {
            color: var(--primary);
        }
        
        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6rem 2rem 4rem;
            position: relative;
            ${theme.gradients && theme.gradients.length > 0 ? `background: ${theme.gradients[0]};` : ''}
        }
        
        .hero-content {
            max-width: 800px;
            text-align: center;
            animation: fadeInUp 0.8s ease-out;
        }
        
        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .hero .tagline {
            font-size: 1.5rem;
            color: ${theme.gradients && theme.gradients.length > 0 ? '#fff' : 'var(--text)'};
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .hero-cta {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        .btn-secondary {
            background: transparent;
            color: ${theme.gradients && theme.gradients.length > 0 ? '#fff' : 'var(--primary)'};
            border: 2px solid ${theme.gradients && theme.gradients.length > 0 ? '#fff' : 'var(--primary)'};
        }
        
        .btn-secondary:hover {
            background: var(--primary);
            color: white;
        }
        
        /* Section Styles */
        .section {
            padding: 5rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 3rem;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            width: 60px;
            height: 4px;
            background: var(--primary);
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 2px;
        }
        
        /* Experience Timeline */
        .timeline {
            position: relative;
            padding-left: 40px;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--secondary);
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 3rem;
            animation: fadeInLeft 0.6s ease-out;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -35px;
            top: 5px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--primary);
            border: 3px solid var(--bg);
            box-shadow: 0 0 0 3px var(--primary);
        }
        
        .timeline-content {
            background: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.05)'};
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .timeline-content:hover {
            transform: translateX(5px);
        }
        
        .timeline-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .timeline-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--primary);
        }
        
        .timeline-date {
            color: var(--secondary);
            font-size: 0.9rem;
        }
        
        .timeline-company {
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        
        .timeline-description {
            line-height: 1.6;
            opacity: 0.9;
        }
        
        /* Skills Grid */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .skill-card {
            background: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.05)'};
            padding: 1.5rem;
            border-radius: 0.75rem;
            text-align: center;
            transition: all 0.3s;
            cursor: default;
            position: relative;
            overflow: hidden;
        }
        
        .skill-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            transform: scaleX(0);
            transition: transform 0.3s;
        }
        
        .skill-card:hover::before {
            transform: scaleX(1);
        }
        
        .skill-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        
        .skill-name {
            font-weight: 600;
            color: var(--primary);
        }
        
        /* Education Cards */
        .education-grid {
            display: grid;
            gap: 2rem;
        }
        
        .education-card {
            background: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.05)'};
            padding: 1.5rem;
            border-radius: 0.75rem;
            border-left: 4px solid var(--primary);
            transition: transform 0.3s;
        }
        
        .education-card:hover {
            transform: translateX(5px);
        }
        
        .education-degree {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        
        .education-institution {
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        
        .education-date {
            color: var(--secondary);
            font-size: 0.9rem;
        }
        
        /* Contact Section */
        .contact {
            background: ${theme.gradients && theme.gradients.length > 0 ? theme.gradients[0] : 'var(--primary)'};
            color: white;
            text-align: center;
            padding: 5rem 2rem;
            margin-top: 4rem;
        }
        
        .contact h2 {
            color: white;
            margin-bottom: 2rem;
        }
        
        .contact h2::after {
            background: white;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 3rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
        }
        
        .contact-item:hover {
            opacity: 0.8;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: 2rem;
            background: var(--bg);
            border-top: 1px solid rgba(0,0,0,0.1);
        }
        
        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .timeline {
                padding-left: 20px;
            }
            
            .timeline::before {
                left: 0;
            }
            
            .timeline-item::before {
                left: -26px;
            }
            
            .skills-grid {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            }
            
            .contact-info {
                flex-direction: column;
                gap: 1rem;
            }
        }
        
        /* Layout Variations */
        .layout-sidebar {
            display: grid;
            grid-template-columns: 300px 1fr;
        }
        
        .layout-full .section {
            max-width: 100%;
        }
    </style>
    ${options.includeAnalytics ? `
    <!-- Google Analytics Placeholder -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    ` : ''}
</head>
<body>
    <!-- Navigation -->
    <nav class="nav">
        <div class="nav-container">
            <a href="#home" class="nav-brand">${personalInfo.fullName.split(' ')[0][0]}${personalInfo.fullName.split(' ').slice(-1)[0][0]}</a>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>
    
    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <h1>${personalInfo.fullName}</h1>
            <p class="tagline">${personalInfo.summary || 'Professional Portfolio'}</p>
            <div class="hero-cta">
                <a href="#contact" class="btn btn-primary">Get In Touch</a>
                <a href="#experience" class="btn btn-secondary">View Work</a>
            </div>
        </div>
    </section>
    
    <!-- Experience Section -->
    ${experience.length > 0 ? `
    <section id="experience" class="section">
        <h2 class="section-title">Experience</h2>
        <div class="timeline">
            ${experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-title">${exp.position}</h3>
                        <span class="timeline-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p class="timeline-company">${exp.company}</p>
                    <p class="timeline-description">${exp.description}</p>
                </div>
            </div>
            `).join('')}
        </div>
    </section>
    ` : ''}
    
    <!-- Education Section -->
    ${education.length > 0 ? `
    <section id="education" class="section">
        <h2 class="section-title">Education</h2>
        <div class="education-grid">
            ${education.map(edu => `
            <div class="education-card">
                <h3 class="education-degree">${edu.degree} in ${edu.field}</h3>
                <p class="education-institution">${edu.institution}</p>
                <p class="education-date">${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}</p>
            </div>
            `).join('')}
        </div>
    </section>
    ` : ''}
    
    <!-- Skills Section -->
    ${skills.length > 0 ? `
    <section id="skills" class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-grid">
            ${skills.map(skill => `
            <div class="skill-card">
                <span class="skill-name">${skill}</span>
            </div>
            `).join('')}
        </div>
    </section>
    ` : ''}
    
    <!-- Contact Section -->
    <section id="contact" class="contact">
        <h2 class="section-title">Get In Touch</h2>
        <div class="contact-info">
            <a href="mailto:${personalInfo.email}" class="contact-item">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                ${personalInfo.email}
            </a>
            <a href="tel:${personalInfo.phone}" class="contact-item">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                ${personalInfo.phone}
            </a>
            ${personalInfo.linkedin ? `
            <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-item">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"/>
                </svg>
                LinkedIn
            </a>
            ` : ''}
        </div>
        ${options.includeContactForm ? `
        <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" style="max-width: 500px; margin: 2rem auto;">
            <input type="email" name="email" placeholder="Your Email" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border-radius: 0.5rem; border: none;">
            <textarea name="message" placeholder="Your Message" rows="4" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border-radius: 0.5rem; border: none; resize: vertical;"></textarea>
            <button type="submit" class="btn btn-primary" style="background: white; color: var(--primary);">Send Message</button>
        </form>
        ` : ''}
    </section>
    
    <!-- Footer -->
    <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} ${personalInfo.fullName}. All rights reserved.</p>
    </footer>
    
    <script>
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.timeline-item, .skill-card, .education-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    </script>
</body>
</html>`;

  return html;
}

export function getAvailableThemes() {
  return Object.keys(portfolioThemes).map(key => ({
    id: key,
    name: portfolioThemes[key].name,
    preview: {
      primaryColor: portfolioThemes[key].primaryColor,
      backgroundColor: portfolioThemes[key].backgroundColor
    }
  }));
}

export function getAvailableFonts() {
  return [
    { id: 'inter', name: 'Inter', family: 'Inter, system-ui, sans-serif' },
    { id: 'space-grotesk', name: 'Space Grotesk', family: 'Space Grotesk, system-ui, sans-serif' },
    { id: 'poppins', name: 'Poppins', family: 'Poppins, system-ui, sans-serif' },
    { id: 'helvetica', name: 'Helvetica', family: 'Helvetica Neue, Arial, sans-serif' },
    { id: 'jetbrains', name: 'JetBrains Mono', family: 'JetBrains Mono, monospace' }
  ];
}

export function getLayoutOptions() {
  return [
    { id: 'centered', name: 'Centered', description: 'Classic centered layout' },
    { id: 'sidebar', name: 'Sidebar', description: 'Fixed sidebar navigation' },
    { id: 'full-width', name: 'Full Width', description: 'Edge-to-edge content' }
  ];
}