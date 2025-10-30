// Professional Resume Templates - Competitor-Grade Quality
// These templates are designed to match or exceed Resume.io, CV-Lite quality

export interface TemplateData {
  id: string;
  name: string;
  category: 'modern' | 'professional' | 'creative' | 'executive' | 'minimalist' | 'technical';
  description: string;
  features: string[];
  atsOptimized: boolean;
  preview: {
    primaryColor: string;
    backgroundColor: string;
    layout: 'single-column' | 'two-column' | 'sidebar' | 'header-focused';
    fontFamily: string;
    sections: string[];
  };
  css: string;
  html: string;
  isPremium: boolean;
}

export const PROFESSIONAL_TEMPLATES: TemplateData[] = [
  {
    id: 'executive-pro',
    name: 'Executive Professional',
    category: 'executive',
    description: 'Clean, executive-level template perfect for senior positions. ATS-optimized with elegant typography.',
    features: ['ATS-Optimized', 'Executive Layout', 'Professional Typography', 'Skills Section', 'Achievement Focus'],
    atsOptimized: true,
    preview: {
      primaryColor: '#1a365d',
      backgroundColor: '#ffffff',
      layout: 'single-column',
      fontFamily: 'Inter',
      sections: ['Header', 'Professional Summary', 'Experience', 'Education', 'Skills', 'Achievements']
    },
    css: `
      .executive-pro {
        font-family: 'Inter', sans-serif;
        line-height: 1.5;
        color: #2d3748;
        max-width: 8.5in;
        margin: 0 auto;
        padding: 0.75in;
        background: white;
      }
      .executive-pro .header {
        text-align: center;
        border-bottom: 3px solid #1a365d;
        padding-bottom: 20px;
        margin-bottom: 25px;
      }
      .executive-pro .name {
        font-size: 32px;
        font-weight: 700;
        color: #1a365d;
        margin-bottom: 8px;
      }
      .executive-pro .title {
        font-size: 16px;
        color: #4a5568;
        font-weight: 500;
        margin-bottom: 12px;
      }
      .executive-pro .contact {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
        font-size: 14px;
        color: #4a5568;
      }
      .executive-pro .section {
        margin-bottom: 25px;
      }
      .executive-pro .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a365d;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 5px;
        margin-bottom: 15px;
      }
      .executive-pro .experience-item {
        margin-bottom: 20px;
      }
      .executive-pro .job-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }
      .executive-pro .job-title {
        font-weight: 600;
        color: #2d3748;
        font-size: 16px;
      }
      .executive-pro .company {
        font-weight: 500;
        color: #1a365d;
      }
      .executive-pro .dates {
        color: #4a5568;
        font-size: 14px;
        font-weight: 500;
      }
      .executive-pro .description {
        margin-top: 8px;
        color: #4a5568;
      }
      .executive-pro .description ul {
        margin: 8px 0;
        padding-left: 20px;
      }
      .executive-pro .description li {
        margin-bottom: 4px;
      }
      .executive-pro .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }
      .executive-pro .skill-category {
        font-weight: 500;
        color: #2d3748;
        margin-bottom: 4px;
      }
      .executive-pro .skill-list {
        color: #4a5568;
        font-size: 14px;
      }
    `,
    html: `
      <div class="executive-pro">
        <div class="header">
          <div class="name">{{personalInfo.fullName}}</div>
          <div class="title">{{personalInfo.title || 'Professional Title'}}</div>
          <div class="contact">
            <span>{{personalInfo.email}}</span>
            <span>{{personalInfo.phone}}</span>
            <span>{{personalInfo.location}}</span>
            {{#if personalInfo.linkedin}}<span>{{personalInfo.linkedin}}</span>{{/if}}
          </div>
        </div>
        
        {{#if personalInfo.summary}}
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="description">{{personalInfo.summary}}</div>
        </div>
        {{/if}}
        
        <div class="section">
          <div class="section-title">Professional Experience</div>
          {{#each experience}}
          <div class="experience-item">
            <div class="job-header">
              <div>
                <div class="job-title">{{position}}</div>
                <div class="company">{{company}}</div>
              </div>
              <div class="dates">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            </div>
            <div class="description">{{{description}}}</div>
          </div>
          {{/each}}
        </div>
        
        {{#if education.length}}
        <div class="section">
          <div class="section-title">Education</div>
          {{#each education}}
          <div class="experience-item">
            <div class="job-header">
              <div>
                <div class="job-title">{{degree}} in {{field}}</div>
                <div class="company">{{institution}}</div>
              </div>
              <div class="dates">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            </div>
          </div>
          {{/each}}
        </div>
        {{/if}}
        
        {{#if skills.length}}
        <div class="section">
          <div class="section-title">Core Competencies</div>
          <div class="skill-list">{{#each skills}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</div>
        </div>
        {{/if}}
      </div>
    `,
    isPremium: false
  },
  
  {
    id: 'modern-creative',
    name: 'Modern Creative',
    category: 'modern',
    description: 'Eye-catching modern design with creative elements. Perfect for marketing, design, and creative roles.',
    features: ['Modern Design', 'Color Accents', 'Creative Layout', 'Portfolio Section', 'Social Links'],
    atsOptimized: true,
    preview: {
      primaryColor: '#667eea',
      backgroundColor: '#ffffff',
      layout: 'two-column',
      fontFamily: 'Inter',
      sections: ['Header', 'About', 'Experience', 'Skills', 'Education', 'Portfolio']
    },
    css: `
      .modern-creative {
        font-family: 'Inter', sans-serif;
        line-height: 1.5;
        color: #2d3748;
        max-width: 8.5in;
        margin: 0 auto;
        background: white;
        display: grid;
        grid-template-columns: 300px 1fr;
        min-height: 11in;
      }
      .modern-creative .sidebar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 25px;
      }
      .modern-creative .main-content {
        padding: 30px 35px;
      }
      .modern-creative .profile-img {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        background: white;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        color: #667eea;
        font-weight: 700;
      }
      .modern-creative .name {
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 8px;
      }
      .modern-creative .title {
        font-size: 16px;
        text-align: center;
        opacity: 0.9;
        margin-bottom: 25px;
      }
      .modern-creative .sidebar-section {
        margin-bottom: 25px;
      }
      .modern-creative .sidebar-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .modern-creative .contact-item {
        margin-bottom: 8px;
        font-size: 14px;
        opacity: 0.9;
      }
      .modern-creative .skill-item {
        margin-bottom: 12px;
      }
      .modern-creative .skill-name {
        font-size: 14px;
        margin-bottom: 4px;
      }
      .modern-creative .skill-bar {
        height: 4px;
        background: rgba(255,255,255,0.3);
        border-radius: 2px;
        overflow: hidden;
      }
      .modern-creative .skill-fill {
        height: 100%;
        background: white;
        border-radius: 2px;
      }
      .modern-creative .main-section {
        margin-bottom: 30px;
      }
      .modern-creative .main-title {
        font-size: 24px;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 20px;
        position: relative;
      }
      .modern-creative .main-title::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 40px;
        height: 3px;
        background: #667eea;
        border-radius: 2px;
      }
      .modern-creative .experience-item {
        margin-bottom: 25px;
        position: relative;
        padding-left: 20px;
      }
      .modern-creative .experience-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 8px;
        height: 8px;
        background: #667eea;
        border-radius: 50%;
      }
      .modern-creative .job-title {
        font-size: 18px;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 4px;
      }
      .modern-creative .company-date {
        font-size: 14px;
        color: #667eea;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .modern-creative .description {
        color: #4a5568;
        font-size: 14px;
      }
    `,
    html: `
      <div class="modern-creative">
        <div class="sidebar">
          <div class="profile-img">{{personalInfo.fullName.[0]}}</div>
          <div class="name">{{personalInfo.fullName}}</div>
          <div class="title">{{personalInfo.title || 'Professional'}}</div>
          
          <div class="sidebar-section">
            <div class="sidebar-title">Contact</div>
            <div class="contact-item">{{personalInfo.email}}</div>
            <div class="contact-item">{{personalInfo.phone}}</div>
            <div class="contact-item">{{personalInfo.location}}</div>
            {{#if personalInfo.linkedin}}<div class="contact-item">{{personalInfo.linkedin}}</div>{{/if}}
          </div>
          
          {{#if skills.length}}
          <div class="sidebar-section">
            <div class="sidebar-title">Skills</div>
            {{#each skills}}
            <div class="skill-item">
              <div class="skill-name">{{this}}</div>
              <div class="skill-bar">
                <div class="skill-fill" style="width: {{random 70 95}}%"></div>
              </div>
            </div>
            {{/each}}
          </div>
          {{/if}}
        </div>
        
        <div class="main-content">
          {{#if personalInfo.summary}}
          <div class="main-section">
            <div class="main-title">About Me</div>
            <div class="description">{{personalInfo.summary}}</div>
          </div>
          {{/if}}
          
          <div class="main-section">
            <div class="main-title">Experience</div>
            {{#each experience}}
            <div class="experience-item">
              <div class="job-title">{{position}}</div>
              <div class="company-date">{{company}} • {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
              <div class="description">{{{description}}}</div>
            </div>
            {{/each}}
          </div>
          
          {{#if education.length}}
          <div class="main-section">
            <div class="main-title">Education</div>
            {{#each education}}
            <div class="experience-item">
              <div class="job-title">{{degree}} in {{field}}</div>
              <div class="company-date">{{institution}} • {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            </div>
            {{/each}}
          </div>
          {{/if}}
        </div>
      </div>
    `,
    isPremium: true
  },
  
  {
    id: 'minimalist-pro',
    name: 'Minimalist Professional',
    category: 'minimalist',
    description: 'Clean, minimalist design focused on content. Perfect for any industry with maximum readability.',
    features: ['Ultra Clean', 'High Readability', 'ATS-Optimized', 'Minimalist Design', 'Universal Appeal'],
    atsOptimized: true,
    preview: {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      layout: 'single-column',
      fontFamily: 'Inter',
      sections: ['Header', 'Summary', 'Experience', 'Education', 'Skills']
    },
    css: `
      .minimalist-pro {
        font-family: 'Inter', sans-serif;
        line-height: 1.6;
        color: #000000;
        max-width: 8.5in;
        margin: 0 auto;
        padding: 0.75in;
        background: white;
      }
      .minimalist-pro .header {
        margin-bottom: 40px;
      }
      .minimalist-pro .name {
        font-size: 36px;
        font-weight: 300;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }
      .minimalist-pro .title {
        font-size: 18px;
        color: #666;
        font-weight: 300;
        margin-bottom: 20px;
      }
      .minimalist-pro .contact {
        font-size: 14px;
        color: #666;
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }
      .minimalist-pro .section {
        margin-bottom: 35px;
      }
      .minimalist-pro .section-title {
        font-size: 16px;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 20px;
        color: #000;
      }
      .minimalist-pro .experience-item {
        margin-bottom: 25px;
      }
      .minimalist-pro .job-header {
        margin-bottom: 8px;
      }
      .minimalist-pro .job-title {
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 2px;
      }
      .minimalist-pro .company-date {
        font-size: 14px;
        color: #666;
      }
      .minimalist-pro .description {
        font-size: 14px;
        color: #333;
        margin-top: 8px;
      }
      .minimalist-pro .skills-list {
        font-size: 14px;
        color: #333;
        line-height: 1.8;
      }
    `,
    html: `
      <div class="minimalist-pro">
        <div class="header">
          <div class="name">{{personalInfo.fullName}}</div>
          <div class="title">{{personalInfo.title || 'Professional'}}</div>
          <div class="contact">
            <span>{{personalInfo.email}}</span>
            <span>{{personalInfo.phone}}</span>
            <span>{{personalInfo.location}}</span>
            {{#if personalInfo.linkedin}}<span>{{personalInfo.linkedin}}</span>{{/if}}
          </div>
        </div>
        
        {{#if personalInfo.summary}}
        <div class="section">
          <div class="section-title">Summary</div>
          <div class="description">{{personalInfo.summary}}</div>
        </div>
        {{/if}}
        
        <div class="section">
          <div class="section-title">Experience</div>
          {{#each experience}}
          <div class="experience-item">
            <div class="job-header">
              <div class="job-title">{{position}}</div>
              <div class="company-date">{{company}} • {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            </div>
            <div class="description">{{{description}}}</div>
          </div>
          {{/each}}
        </div>
        
        {{#if education.length}}
        <div class="section">
          <div class="section-title">Education</div>
          {{#each education}}
          <div class="experience-item">
            <div class="job-header">
              <div class="job-title">{{degree}} in {{field}}</div>
              <div class="company-date">{{institution}} • {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            </div>
          </div>
          {{/each}}
        </div>
        {{/if}}
        
        {{#if skills.length}}
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-list">{{#each skills}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</div>
        </div>
        {{/if}}
      </div>
    `,
    isPremium: false
  },
  
  {
    id: 'tech-specialist',
    name: 'Tech Specialist',
    category: 'technical',
    description: 'Designed for software engineers, developers, and technical roles. Highlights technical skills prominently.',
    features: ['Technical Focus', 'Skills Prominence', 'Project Sections', 'GitHub Integration', 'Clean Code Aesthetic'],
    atsOptimized: true,
    preview: {
      primaryColor: '#0d7377',
      backgroundColor: '#ffffff',
      layout: 'two-column',
      fontFamily: 'JetBrains Mono',
      sections: ['Header', 'Summary', 'Technical Skills', 'Experience', 'Projects', 'Education']
    },
    css: `
      .tech-specialist {
        font-family: 'Inter', sans-serif;
        line-height: 1.5;
        color: #2d3748;
        max-width: 8.5in;
        margin: 0 auto;
        padding: 0.5in;
        background: white;
      }
      .tech-specialist .header {
        background: #f7fafc;
        padding: 25px;
        margin: -0.5in -0.5in 30px -0.5in;
        border-left: 4px solid #0d7377;
      }
      .tech-specialist .name {
        font-size: 32px;
        font-weight: 700;
        color: #0d7377;
        margin-bottom: 6px;
        font-family: 'JetBrains Mono', monospace;
      }
      .tech-specialist .title {
        font-size: 18px;
        color: #4a5568;
        font-weight: 500;
        margin-bottom: 15px;
      }
      .tech-specialist .contact {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        font-size: 14px;
        color: #4a5568;
      }
      .tech-specialist .two-column {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 30px;
      }
      .tech-specialist .section {
        margin-bottom: 25px;
      }
      .tech-specialist .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #0d7377;
        margin-bottom: 15px;
        font-family: 'JetBrains Mono', monospace;
      }
      .tech-specialist .tech-skills {
        background: #f7fafc;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #0d7377;
      }
      .tech-specialist .skill-category {
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .tech-specialist .skill-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 15px;
      }
      .tech-specialist .skill-tag {
        background: #0d7377;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-family: 'JetBrains Mono', monospace;
      }
      .tech-specialist .experience-item {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e2e8f0;
      }
      .tech-specialist .job-title {
        font-weight: 600;
        color: #2d3748;
        font-size: 16px;
        margin-bottom: 4px;
      }
      .tech-specialist .company-date {
        font-size: 14px;
        color: #0d7377;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .tech-specialist .description {
        color: #4a5568;
        font-size: 14px;
      }
      .tech-specialist .code-block {
        background: #1a202c;
        color: #a0aec0;
        padding: 12px;
        border-radius: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        margin: 8px 0;
      }
    `,
    html: `
      <div class="tech-specialist">
        <div class="header">
          <div class="name">{{personalInfo.fullName}}</div>
          <div class="title">{{personalInfo.title || 'Software Engineer'}}</div>
          <div class="contact">
            <span>{{personalInfo.email}}</span>
            <span>{{personalInfo.phone}}</span>
            <span>{{personalInfo.location}}</span>
            {{#if personalInfo.linkedin}}<span>{{personalInfo.linkedin}}</span>{{/if}}
            {{#if personalInfo.github}}<span>github.com/{{personalInfo.github}}</span>{{/if}}
          </div>
        </div>
        
        <div class="two-column">
          <div class="main-content">
            {{#if personalInfo.summary}}
            <div class="section">
              <div class="section-title">// Summary</div>
              <div class="description">{{personalInfo.summary}}</div>
            </div>
            {{/if}}
            
            <div class="section">
              <div class="section-title">// Experience</div>
              {{#each experience}}
              <div class="experience-item">
                <div class="job-title">{{position}}</div>
                <div class="company-date">{{company}} • {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
                <div class="description">{{{description}}}</div>
              </div>
              {{/each}}
            </div>
            
            {{#if education.length}}
            <div class="section">
              <div class="section-title">// Education</div>
              {{#each education}}
              <div class="experience-item">
                <div class="job-title">{{degree}} in {{field}}</div>
                <div class="company-date">{{institution}} • {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
              </div>
              {{/each}}
            </div>
            {{/if}}
          </div>
          
          <div class="sidebar-content">
            {{#if skills.length}}
            <div class="section">
              <div class="section-title">// Skills</div>
              <div class="tech-skills">
                <div class="skill-category">Languages</div>
                <div class="skill-tags">
                  {{#each skills}}
                  {{#if @index < 6}}
                  <span class="skill-tag">{{this}}</span>
                  {{/if}}
                  {{/each}}
                </div>
                
                <div class="skill-category">Frameworks</div>
                <div class="skill-tags">
                  {{#each skills}}
                  {{#if @index >= 6 && @index < 12}}
                  <span class="skill-tag">{{this}}</span>
                  {{/if}}
                  {{/each}}
                </div>
                
                <div class="skill-category">Tools</div>
                <div class="skill-tags">
                  {{#each skills}}
                  {{#if @index >= 12}}
                  <span class="skill-tag">{{this}}</span>
                  {{/if}}
                  {{/each}}
                </div>
              </div>
            </div>
            {{/if}}
          </div>
        </div>
      </div>
    `,
    isPremium: true
  }
];

export function getTemplateById(id: string): TemplateData | undefined {
  return PROFESSIONAL_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): TemplateData[] {
  return PROFESSIONAL_TEMPLATES.filter(template => template.category === category);
}

export function getAllTemplates(): TemplateData[] {
  return PROFESSIONAL_TEMPLATES;
}

export function renderTemplate(template: TemplateData, data: any): string {
  // Simple template rendering - in production you'd use a proper template engine
  let html = template.html;
  
  // Replace personal info
  html = html.replace(/\{\{personalInfo\.([^}]+)\}\}/g, (match, prop) => {
    return data.personalInfo?.[prop] || '';
  });
  
  // Replace experience
  html = html.replace(/\{\{#each experience\}\}(.*?)\{\{\/each\}\}/gs, (match, content) => {
    if (!data.experience || !data.experience.length) return '';
    return data.experience.map((exp: any) => {
      let itemHtml = content;
      itemHtml = itemHtml.replace(/\{\{([^}]+)\}\}/g, (m: string, prop: string) => {
        return exp[prop] || '';
      });
      return itemHtml;
    }).join('');
  });
  
  // Replace education
  html = html.replace(/\{\{#each education\}\}(.*?)\{\{\/each\}\}/gs, (match, content) => {
    if (!data.education || !data.education.length) return '';
    return data.education.map((edu: any) => {
      let itemHtml = content;
      itemHtml = itemHtml.replace(/\{\{([^}]+)\}\}/g, (m: string, prop: string) => {
        return edu[prop] || '';
      });
      return itemHtml;
    }).join('');
  });
  
  // Replace skills
  html = html.replace(/\{\{#each skills\}\}(.*?)\{\{\/each\}\}/gs, (match, content) => {
    if (!data.skills || !data.skills.length) return '';
    return data.skills.map((skill: string, index: number) => {
      let itemHtml = content;
      itemHtml = itemHtml.replace(/\{\{this\}\}/g, skill);
      itemHtml = itemHtml.replace(/\{\{@index\}\}/g, index.toString());
      return itemHtml;
    }).join('');
  });
  
  // Clean up conditional blocks
  html = html.replace(/\{\{#if [^}]+\}\}(.*?)\{\{\/if\}\}/gs, (match, content) => {
    // Simple conditional - in production use proper template engine
    return content;
  });
  
  return html;
}