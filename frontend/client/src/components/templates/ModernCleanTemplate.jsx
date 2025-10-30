import React from "react";

export default function ModernCleanTemplate({ data, scale = 1 }) {
  const personalInfo = data?.enhanced_content?.personal_info || {};
  const summary =
    data?.enhanced_content?.summary ||
    "Innovative professional passionate about driving growth and delivering exceptional results";
  const experience = data?.enhanced_content?.experience || [];
  const education = data?.enhanced_content?.education || [];
  const skills = data?.enhanced_content?.skills || [];

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
      <div className="w-[210mm] min-h-[297mm] bg-white p-10 font-sans">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-light text-gray-900 mb-3">
            {personalInfo.full_name || "Sarah Mitchell"}
          </h1>
          <div className="flex justify-center flex-wrap gap-4 text-gray-600">
            <span>{personalInfo.email || "sarah.mitchell@email.com"}</span>
            <span>|</span>
            <span>{personalInfo.phone || "+1 (555) 987-6543"}</span>
            <span>|</span>
            <span>{personalInfo.location || "San Francisco, CA"}</span>
          </div>
          {personalInfo.linkedin && <div className="text-blue-600 mt-2">{personalInfo.linkedin}</div>}
        </div>

        <div className="w-24 h-0.5 bg-blue-500 mx-auto mb-8" />

        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Experience</h2>
          {experience.length > 0 ? (
            experience.slice(0, 3).map((exp, idx) => (
              <div key={idx} className="mb-6 pl-6 border-l-2 border-blue-500">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-medium text-gray-900">
                    {exp.position || "Product Manager"}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    {exp.start_date || "2021"} - {exp.end_date || "Present"}
                  </span>
                </div>
                <p className="text-blue-600 font-medium mb-2">
                  {exp.company || "Tech Innovations Inc."}
                </p>
                <ul className="space-y-2 text-gray-700">
                  {(exp.bullets || [
                    "Launched 3 major product features resulting in 50% user growth",
                    "Managed product roadmap and coordinated with engineering teams",
                  ])
                    .slice(0, 3)
                    .map((bullet, bidx) => (
                      <li key={bidx} className="flex items-start">
                        <span className="text-blue-500 mr-2">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="mb-6 pl-6 border-l-2 border-blue-500">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-medium text-gray-900">Product Manager</h3>
                <span className="text-gray-500 text-sm">2021 - Present</span>
              </div>
              <p className="text-blue-600 font-medium mb-2">Tech Innovations Inc.</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">▸</span>
                  <span>Launched 3 major product features resulting in 50% user growth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">▸</span>
                  <span>Managed product roadmap and coordinated with engineering teams</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Education</h2>
          {education.length > 0 ? (
            education.slice(0, 2).map((edu, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {edu.degree || "Bachelor of Science"} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-600">{edu.institution || "Stanford University"}</p>
                <p className="text-gray-500 text-sm">{edu.graduation_date || "2019"}</p>
              </div>
            ))
          ) : (
            <div className="mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                Bachelor of Science in Computer Science
              </h3>
              <p className="text-gray-600">Stanford University</p>
              <p className="text-gray-500 text-sm">2019</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {(skills.length > 0
              ? skills
              : [
                  "Product Strategy",
                  "Agile Development",
                  "User Research",
                  "Data Analysis",
                  "Cross-functional Leadership",
                  "A/B Testing",
                  "Roadmap Planning",
                ])
              .slice(0, 10)
              .map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 border border-blue-500 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
