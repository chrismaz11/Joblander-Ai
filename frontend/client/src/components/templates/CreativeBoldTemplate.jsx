import React from "react";

export default function CreativeBoldTemplate({ data, scale = 1 }) {
  const personalInfo = data?.enhanced_content?.personal_info || {};
  const summary = data?.enhanced_content?.summary || "Creative professional with a passion for innovative design and user experience";
  const experience = data?.enhanced_content?.experience || [];
  const education = data?.enhanced_content?.education || [];
  const skills = data?.enhanced_content?.skills || [];

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
      <div className="w-[210mm] min-h-[297mm] bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-8 font-sans">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
            {(personalInfo.full_name || "A D")[0]}
            {(personalInfo.full_name || "A D").split(" ")[1]?.[0] || ""}
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              {personalInfo.full_name || "Alex Designer"}
            </h1>
            <p className="text-xl text-purple-600 font-medium mb-3">Creative Director & Designer</p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span>{personalInfo.email || "alex.designer@email.com"}</span>
              <span>•</span>
              <span>{personalInfo.phone || "+1 (555) 321-7890"}</span>
              <span>•</span>
              <span>{personalInfo.location || "Los Angeles, CA"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded" />
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded" />
            Experience
          </h2>
          {experience.length > 0 ? (
            experience.slice(0, 2).map((exp, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.position || "Creative Director"}</h3>
                    <p className="text-purple-600 font-semibold">{exp.company || "Design Studio Co."}</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {exp.start_date || "2020"} - {exp.end_date || "Present"}
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  {(exp.bullets || [
                    "Led creative direction for 20+ high-profile client projects",
                    "Increased client satisfaction scores by 40% through innovative design solutions",
                  ])
                    .slice(0, 3)
                    .map((bullet, bidx) => (
                      <li key={bidx} className="flex items-start">
                        <span className="text-purple-500 mr-2">●</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Creative Director</h3>
                  <p className="text-purple-600 font-semibold">Design Studio Co.</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">2020 - Present</span>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">●</span>
                  <span>Led creative direction for 20+ high-profile client projects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">●</span>
                  <span>Increased client satisfaction scores by 40% through innovative design solutions</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded" />
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {(skills.length > 0
              ? skills
              : [
                  "Adobe Creative Suite",
                  "UI/UX Design",
                  "Brand Strategy",
                  "Typography",
                  "Color Theory",
                  "Illustration",
                  "Motion Graphics",
                  "Art Direction",
                  "Team Leadership",
                ])
              .slice(0, 9)
              .map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 rounded-lg text-center font-medium text-sm"
                >
                  {skill}
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded" />
            Education
          </h2>
          {education.length > 0 ? (
            education.slice(0, 2).map((edu, idx) => (
              <div key={idx} className="mb-2">
                <h3 className="font-bold text-gray-900">
                  {edu.degree || "BFA"} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-600">{edu.institution || "Rhode Island School of Design"}</p>
                <p className="text-gray-500 text-sm">{edu.graduation_date || "2018"}</p>
              </div>
            ))
          ) : (
            <div>
              <h3 className="font-bold text-gray-900">BFA in Graphic Design</h3>
              <p className="text-gray-600">Rhode Island School of Design</p>
              <p className="text-gray-500 text-sm">2018</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
