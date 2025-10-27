const resumeTemplates = {
  modern: {
    html: `
      <div class="resume-container">
        <header class="resume-header">
          <h1 class="name">{{name}}</h1>
          <div class="contact-info">
            <span class="email">{{email}}</span>
            <span class="phone">{{phone}}</span>
          </div>
        </header>
        
        <section class="skills-section">
          <h2>Skills</h2>
          <div class="skills-list">
            {{#each skills}}
            <span class="skill-tag">{{this}}</span>
            {{/each}}
          </div>
        </section>
        
        <section class="experience-section">
          <h2>Experience</h2>
          <div class="experience-content">{{experience}}</div>
        </section>
      </div>
    `,
    css: `
      .resume-container { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; }
      .resume-header { text-align: center; margin-bottom: 30px; }
      .name { font-size: 2.5em; margin-bottom: 10px; color: #333; }
      .contact-info span { margin: 0 15px; color: #666; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
      .skill-tag { background: #e3f2fd; padding: 5px 10px; border-radius: 15px; }
    `
  }
};

export const generateResume = (data: any, templateName = 'modern') => {
  const template = resumeTemplates[templateName as keyof typeof resumeTemplates];
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }
  
  let html = template.html;
  
  // Replace simple placeholders
  html = html.replace(/\{\{name\}\}/g, data.name || 'Your Name');
  html = html.replace(/\{\{email\}\}/g, data.email || 'your.email@example.com');
  html = html.replace(/\{\{phone\}\}/g, data.phone || 'Your Phone');
  html = html.replace(/\{\{experience\}\}/g, data.experience || 'Your experience details');
  
  // Handle skills array
  if (data.skills && data.skills.length > 0) {
    const skillsHtml = data.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('');
    html = html.replace(/\{\{#each skills\}\}.*?\{\{\/each\}\}/s, skillsHtml);
  } else {
    html = html.replace(/\{\{#each skills\}\}.*?\{\{\/each\}\}/s, '<span class="skill-tag">Add your skills</span>');
  }
  
  return { html, css: template.css };
};