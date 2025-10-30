interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduationDate: string;
  }>;
  skills: {
    design: string[];
    technical: string[];
    tools: string[];
  };
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function CreativeTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'John Doe',
      title: 'Creative Developer',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      portfolio: 'johndoe.com',
    },
    summary: 'I bring ideas to life through code and design. Combining technical expertise with creative vision to build beautiful, functional experiences.',
    experience: [
      {
        title: 'Lead Creative Developer',
        company: 'Design Studio',
        startDate: '2021',
        endDate: 'Now',
        achievements: [
          'Created award-winning interactive experiences',
          'Led design system implementation',
          'Collaborated with Fortune 500 clients',
        ],
      },
      {
        title: 'Frontend Developer',
        company: 'Creative Agency',
        startDate: '2019',
        endDate: '2021',
        achievements: [
          'Built 30+ client websites',
          'Pioneered motion design standards',
          'Mentored junior designers',
        ],
      },
    ],
    education: [
      {
        degree: 'BFA Digital Design',
        institution: 'Art Institute',
        graduationDate: '2019',
      },
    ],
    skills: {
      design: ['UI/UX', 'Branding', 'Motion Graphics', 'Typography'],
      technical: ['React', 'Three.js', 'GSAP', 'WebGL'],
      tools: ['Figma', 'After Effects', 'Blender'],
    },
  };

  const bgColor = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentGradient = 'from-pink-500 via-purple-500 to-indigo-500';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} p-12 shadow-lg relative overflow-hidden`}>
      {/* Decorative Elements */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${accentGradient} opacity-10 rounded-full blur-3xl`}></div>
      <div className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr ${accentGradient} opacity-10 rounded-full blur-3xl`}></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className={`inline-block p-6 ${cardBg} rounded-2xl shadow-lg mb-6`}>
            <h1 className={`text-4xl mb-2 bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
              {mockData.personalInfo.fullName}
            </h1>
            <p className="text-xl">{mockData.personalInfo.title}</p>
          </div>
          
          <div className={`flex flex-wrap gap-4 text-sm ${secondaryTextColor}`}>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentGradient}`}></span>
              {mockData.personalInfo.email}
            </span>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentGradient}`}></span>
              {mockData.personalInfo.phone}
            </span>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentGradient}`}></span>
              {mockData.personalInfo.portfolio}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className={`${cardBg} rounded-xl p-6 mb-8 shadow-sm`}>
          <p className={`${secondaryTextColor} leading-relaxed italic`}>{mockData.summary}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Experience - Takes 2 columns */}
          <div className="col-span-2 space-y-6">
            <h2 className={`text-2xl bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent mb-4`}>
              Experience
            </h2>
            {mockData.experience.map((exp, idx) => (
              <div key={idx} className={`${cardBg} rounded-xl p-6 shadow-sm`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg mb-1">{exp.title}</h3>
                    <p className={secondaryTextColor}>{exp.company}</p>
                  </div>
                  <span className={`px-3 py-1 ${cardBg === 'bg-white' ? 'bg-gray-100' : 'bg-gray-800'} rounded-full text-xs`}>
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul className={`${secondaryTextColor} space-y-1 text-sm`}>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r ${accentGradient} mt-2`}></span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Education */}
            <div className={`${cardBg} rounded-xl p-6 shadow-sm`}>
              <h2 className={`text-lg bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent mb-4`}>
                Education
              </h2>
              {mockData.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="mb-1">{edu.degree}</h3>
                  <p className={`${secondaryTextColor} text-sm`}>{edu.institution}</p>
                  <p className={`${secondaryTextColor} text-xs`}>{edu.graduationDate}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className={`${cardBg} rounded-xl p-6 shadow-sm`}>
              <h2 className={`text-lg bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent mb-4`}>
                Skills
              </h2>
              <div className="space-y-4">
                <div>
                  <h4 className={`${secondaryTextColor} text-xs uppercase mb-2`}>Design</h4>
                  <div className="flex flex-wrap gap-1">
                    {mockData.skills.design.map((skill, i) => (
                      <span 
                        key={i}
                        className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className={`${secondaryTextColor} text-xs uppercase mb-2`}>Technical</h4>
                  <div className="flex flex-wrap gap-1">
                    {mockData.skills.technical.map((skill, i) => (
                      <span 
                        key={i}
                        className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className={`${secondaryTextColor} text-xs uppercase mb-2`}>Tools</h4>
                  <div className="flex flex-wrap gap-1">
                    {mockData.skills.tools.map((skill, i) => (
                      <span 
                        key={i}
                        className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
