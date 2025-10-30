import React, { useEffect } from 'react';

const DynamicStyleProvider = ({ customizations, templateType, children }) => {
  useEffect(() => {
    const generateCustomCSS = () => {
      const { colors, fonts, layout, sections } = customizations;
      
      return `
        .${templateType}-resume.customized {
          --primary-color: ${colors.primary};
          --secondary-color: ${colors.secondary};
          --accent-color: ${colors.accent};
          --text-color: ${colors.text};
          --background-color: ${colors.background};
          --heading-font: ${fonts.heading}, sans-serif;
          --body-font: ${fonts.body}, sans-serif;
          --name-size: ${fonts.size.name};
          --heading-size: ${fonts.size.heading};
          --body-size: ${fonts.size.body};
          --border-radius: ${layout.borderRadius};
          --spacing-multiplier: ${layout.spacing === 'compact' ? '0.8' : layout.spacing === 'spacious' ? '1.2' : '1'};
        }

        .${templateType}-resume.customized .resume-header,
        .${templateType}-resume.customized .${templateType}-header {
          background: ${layout.headerStyle === 'gradient' 
            ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` 
            : layout.headerStyle === 'solid' 
            ? colors.primary 
            : 'transparent'
          };
          ${layout.headerStyle === 'minimal' ? `border-bottom: 3px solid ${colors.primary};` : ''}
        }

        .${templateType}-resume.customized .name,
        .${templateType}-resume.customized .${templateType}-name {
          font-family: var(--heading-font);
          font-size: var(--name-size);
          color: ${layout.headerStyle === 'minimal' ? colors.text : 'inherit'};
        }

        .${templateType}-resume.customized h1,
        .${templateType}-resume.customized h2,
        .${templateType}-resume.customized h3,
        .${templateType}-resume.customized h4 {
          font-family: var(--heading-font);
          color: var(--text-color);
        }

        .${templateType}-resume.customized {
          font-family: var(--body-font);
          font-size: var(--body-size);
          color: var(--text-color);
          background-color: var(--background-color);
        }

        .${templateType}-resume.customized .section-title,
        .${templateType}-resume.customized h3 {
          color: var(--primary-color);
          font-size: var(--heading-size);
        }

        .${templateType}-resume.customized .skill-item,
        .${templateType}-resume.customized .experience-item,
        .${templateType}-resume.customized .education-item {
          border-radius: var(--border-radius);
          border-left-color: var(--primary-color);
        }

        .${templateType}-resume.customized .skill-bubble,
        .${templateType}-resume.customized .tech-tag {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          border-radius: calc(var(--border-radius) * 3);
        }

        .${templateType}-resume.customized * {
          margin-top: calc(var(--spacing-multiplier) * 1em);
          margin-bottom: calc(var(--spacing-multiplier) * 1em);
        }

        ${layout.columns === 'single-column' ? `
          .${templateType}-resume.customized .resume-body,
          .${templateType}-resume.customized .${templateType}-content {
            grid-template-columns: 1fr !important;
          }
        ` : layout.columns === 'three-column' ? `
          .${templateType}-resume.customized .resume-body,
          .${templateType}-resume.customized .${templateType}-content {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        ` : ''}

        ${!sections.showPhoto ? `
          .${templateType}-resume.customized .avatar-placeholder,
          .${templateType}-resume.customized .profile-photo {
            display: none !important;
          }
        ` : ''}

        ${!sections.showSummary ? `
          .${templateType}-resume.customized .summary-section,
          .${templateType}-resume.customized .about-section {
            display: none !important;
          }
        ` : ''}

        ${!sections.showSkills ? `
          .${templateType}-resume.customized .skills-section {
            display: none !important;
          }
        ` : ''}

        ${!sections.showExperience ? `
          .${templateType}-resume.customized .experience-section {
            display: none !important;
          }
        ` : ''}

        ${!sections.showEducation ? `
          .${templateType}-resume.customized .education-section {
            display: none !important;
          }
        ` : ''}
      `;
    };

    // Remove existing custom styles
    const existingStyle = document.getElementById(`custom-styles-${templateType}`);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new custom styles
    const styleElement = document.createElement('style');
    styleElement.id = `custom-styles-${templateType}`;
    styleElement.textContent = generateCustomCSS();
    document.head.appendChild(styleElement);

    return () => {
      const styleToRemove = document.getElementById(`custom-styles-${templateType}`);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [customizations, templateType]);

  return <>{children}</>;
};

export default DynamicStyleProvider;
