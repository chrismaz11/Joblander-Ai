import React from "react";

export default function ClassicProTemplate({ data, scale = 1 }) {
  const personalInfo = data?.enhanced_content?.personal_info || {};
  const summary =
    data?.enhanced_content?.summary ||
    "Results-driven professional with proven track record of delivering exceptional outcomes";
  const experience = data?.enhanced_content?.experience || [];
  const education = data?.enhanced_content?.education || [];
  const skills = data?.enhanced_content?.skills || [];

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
      <div className="w-[210mm] min-h-[297mm] bg-white p-8 font-sans">
        <div className="border-b-4 border-blue-900 pb-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {personalInfo.full_name || "John Anderson"}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span>{personalInfo.email || "john.anderson@email.com"}</span>
            <span>•</span>
            <span>{personalInfo.phone || "+1 (555) 123-4567"}</span>
            <span>•</span>
            <span>{personalInfo.location || "New York, NY"}</span>
          </div>
          {personalInfo.linkedin && (
            <div className="text-sm text-blue-700 mt-1">{personalInfo.linkedin}</div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3 uppercase tracking-wide">
            Professional Experience
          </h2>
          {experience.length > 0 ? (
            experience.slice(0, 3).map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position || "Senior Manager"}</h3>
                    <p className="text-gray-700">{exp.company || "ABC Corporation"}</p>
                  </div>
                  <span className="text-gray-600 text-sm whitespace-nowrap">
                    {exp.start_date || "2020"} - {exp.end_date || "Present"}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  {(exp.bullets || [
                    "Led cross-functional team of 12 members to deliver $2M project ahead of schedule",
                    "Improved operational efficiency by 35% through process optimization initiatives",
                  ])
                    .slice(0, 3)
                    .map((bullet, bidx) => (
                      <li key={bidx}>{bullet}</li>
                    ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">Senior Manager</h3>
                  <p className="text-gray-700">ABC Corporation</p>
                </div>
                <span className="text-gray-600 text-sm">2020 - Present</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>Led cross-functional team of 12 members to deliver $2M project ahead of schedule</li>
                <li>Improved operational efficiency by 35% through process optimization initiatives</li>
              </ul>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          {education.length > 0 ? (
            education.slice(0, 2).map((edu, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {edu.degree || "MBA"} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-700">{edu.institution || "Harvard Business School"}</p>
                  </div>
                  <span className="text-gray-600 text-sm">{edu.graduation_date || "2018"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">MBA in Business Administration</h3>
                  <p className="text-gray-700">Harvard Business School</p>
                </div>
                <span className="text-gray-600 text-sm">2018</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-900 mb-3 uppercase tracking-wide">
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {(skills.length > 0
              ? skills
              : [
                  "Leadership",
                  "Strategic Planning",
                  "Project Management",
                  "Business Development",
                  "Team Building",
                  "Financial Analysis",
                  "Process Improvement",
                  "Stakeholder Management",
                ])
              .slice(0, 8)
              .map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-900 rounded text-sm font-medium"
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
