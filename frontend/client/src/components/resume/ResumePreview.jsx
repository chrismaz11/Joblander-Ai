import React from "react";

export default function ResumePreview({ resume, customization }) {
  const colorSchemes = {
    blue: {
      primary: "#3b82f6",
      secondary: "#1e40af",
      accent: "#60a5fa",
      text: "#1e3a8a",
    },
    purple: {
      primary: "#8b5cf6",
      secondary: "#6d28d9",
      accent: "#a78bfa",
      text: "#5b21b6",
    },
    green: {
      primary: "#10b981",
      secondary: "#047857",
      accent: "#34d399",
      text: "#065f46",
    },
    red: {
      primary: "#ef4444",
      secondary: "#b91c1c",
      accent: "#f87171",
      text: "#991b1b",
    },
    navy: {
      primary: "#1e3a8a",
      secondary: "#1e40af",
      accent: "#3b82f6",
      text: "#1e293b",
    },
    teal: {
      primary: "#14b8a6",
      secondary: "#0f766e",
      accent: "#2dd4bf",
      text: "#134e4a",
    },
  };

  const fontFamilies = {
    inter: "'Inter', sans-serif",
    roboto: "'Roboto', sans-serif",
    lato: "'Lato', sans-serif",
    opensans: "'Open Sans', sans-serif",
    montserrat: "'Montserrat', sans-serif",
  };

  const fontSizes = {
    small: { base: "10px", heading: "14px", name: "20px" },
    medium: { base: "11px", heading: "15px", name: "22px" },
    large: { base: "12px", heading: "16px", name: "24px" },
  };

  const lineSpacings = {
    compact: "1.3",
    normal: "1.5",
    relaxed: "1.7",
  };

  const colors = colorSchemes[customization.color_scheme] || colorSchemes.blue;
  const fontFamily = fontFamilies[customization.font_family] || fontFamilies.inter;
  const fontSize = fontSizes[customization.font_size] || fontSizes.medium;
  const lineSpacing = lineSpacings[customization.line_spacing] || lineSpacings.normal;

  const content = resume.enhanced_content || {};
  const personalInfo = content.personal_info || {};
  const experience = content.experience || [];
  const education = content.education || [];
  const skills = content.skills || [];

  const sectionOrder = customization.section_order || ["summary", "experience", "education", "skills"];
  const sectionsVisible = customization.sections_visible || {};

  const renderSection = (sectionKey) => {
    if (!sectionsVisible[sectionKey]) return null;

    switch (sectionKey) {
      case "summary":
        if (!content.summary) return null;
        return (
          <div key="summary" className="section">
            <h3
              style={{
                color: colors.primary,
                fontSize: fontSize.heading,
                fontWeight: "600",
                marginBottom: "8px",
                borderBottom: `2px solid ${colors.primary}`,
                paddingBottom: "4px",
              }}
            >
              Professional Summary
            </h3>
            <p
              style={{
                fontSize: fontSize.base,
                lineHeight: lineSpacing,
                color: "#374151",
              }}
            >
              {content.summary}
            </p>
          </div>
        );

      case "experience":
        if (!experience.length) return null;
        return (
          <div key="experience" className="section">
            <h3
              style={{
                color: colors.primary,
                fontSize: fontSize.heading,
                fontWeight: "600",
                marginBottom: "8px",
                borderBottom: `2px solid ${colors.primary}`,
                paddingBottom: "4px",
              }}
            >
              Work Experience
            </h3>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h4
                      style={{
                        fontSize: fontSize.base,
                        fontWeight: "600",
                        color: "#111827",
                        marginBottom: "2px",
                      }}
                    >
                      {exp.position}
                    </h4>
                    <p
                      style={{
                        fontSize: fontSize.base,
                        color: colors.secondary,
                        fontWeight: "500",
                      }}
                    >
                      {exp.company}
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: fontSize.base,
                      color: "#6b7280",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {exp.start_date} - {exp.end_date || "Present"}
                  </div>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul
                    style={{
                      marginTop: "6px",
                      paddingLeft: "20px",
                      fontSize: fontSize.base,
                      lineHeight: lineSpacing,
                      color: "#374151",
                    }}
                  >
                    {exp.bullets.map((bullet, bidx) => (
                      <li key={bidx} style={{ marginBottom: "4px" }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case "education":
        if (!education.length) return null;
        return (
          <div key="education" className="section">
            <h3
              style={{
                color: colors.primary,
                fontSize: fontSize.heading,
                fontWeight: "600",
                marginBottom: "8px",
                borderBottom: `2px solid ${colors.primary}`,
                paddingBottom: "4px",
              }}
            >
              Education
            </h3>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h4
                      style={{
                        fontSize: fontSize.base,
                        fontWeight: "600",
                        color: "#111827",
                        marginBottom: "2px",
                      }}
                    >
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h4>
                    <p
                      style={{
                        fontSize: fontSize.base,
                        color: colors.secondary,
                        fontWeight: "500",
                      }}
                    >
                      {edu.institution}
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: fontSize.base,
                      color: "#6b7280",
                    }}
                  >
                    {edu.graduation_date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "skills":
        if (!skills.length) return null;
        return (
          <div key="skills" className="section">
            <h3
              style={{
                color: colors.primary,
                fontSize: fontSize.heading,
                fontWeight: "600",
                marginBottom: "8px",
                borderBottom: `2px solid ${colors.primary}`,
                paddingBottom: "4px",
              }}
            >
              Skills
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "4px 12px",
                    backgroundColor: `${colors.primary}15`,
                    color: colors.text,
                    borderRadius: "4px",
                    fontSize: fontSize.base,
                    fontWeight: "500",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        padding: "20mm",
        backgroundColor: "white",
        fontFamily,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ marginBottom: "20px", borderBottom: `3px solid ${colors.primary}`, paddingBottom: "12px" }}>
        <h1
          style={{
            fontSize: fontSize.name,
            fontWeight: "700",
            color: colors.primary,
            marginBottom: "6px",
          }}
        >
          {personalInfo.full_name || "Your Name"}
        </h1>
        <div
          style={{
            fontSize: fontSize.base,
            color: "#6b7280",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div
            style={{
              fontSize: fontSize.base,
              color: colors.secondary,
              marginTop: "4px",
              display: "flex",
              gap: "12px",
            }}
          >
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </div>
    </div>
  );
}
