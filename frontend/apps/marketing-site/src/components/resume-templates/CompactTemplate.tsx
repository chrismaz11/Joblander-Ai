interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    contact: string[];
  };
  profile: string;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    points: string[];
  }>;
  education: string[];
  skills: string[];
  certifications?: string[];
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function CompactTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'Michael Chen',
      title: 'Full Stack Developer',
      contact: [
        'michael.chen@email.com',
        '(555) 321-9876',
        'San Francisco, CA',
        'github.com/mchen',
      ],
    },
    profile: 'Versatile full-stack developer with 7+ years building scalable web applications. Strong background in React, Node.js, and cloud infrastructure. Proven ability to deliver high-quality solutions in fast-paced environments.',
    experience: [
      {
        role: 'Senior Full Stack Developer',
        company: 'Tech Innovations Inc',
        period: '2021 - Present',
        points: [
          'Architected and deployed microservices platform on AWS (ECS, Lambda, RDS)',
          'Led frontend team implementing design system in React/TypeScript',
          'Reduced API response time by 70% through caching and optimization',
          'Mentored 3 junior developers and established coding standards',
        ],
      },
      {
        role: 'Full Stack Developer',
        company: 'Digital Solutions Co',
        period: '2018 - 2021',
        points: [
          'Built customer-facing dashboard serving 50K+ users',
          'Integrated third-party APIs (Stripe, Twilio, SendGrid)',
          'Implemented CI/CD pipeline reducing deployment time by 80%',
        ],
      },
      {
        role: 'Junior Developer',
        company: 'Web Agency LLC',
        period: '2017 - 2018',
        points: [
          'Developed 15+ client websites using React and WordPress',
          'Collaborated with designers to implement pixel-perfect UIs',
        ],
      },
    ],
    education: [
      'BS Computer Science, Stanford University, 2017',
      'Relevant Coursework: Algorithms, Databases, Web Development',
    ],
    skills: [
      'JavaScript/TypeScript',
      'React/Next.js',
      'Node.js/Express',
      'Python/Django',
      'PostgreSQL/MongoDB',
      'AWS/Docker',
      'Git/CI/CD',
      'REST APIs/GraphQL',
      'TDD/Jest',
      'Agile/Scrum',
    ],
    certifications: [
      'AWS Certified Developer Associate (2023)',
      'React Advanced Certification (2022)',
    ],
  };

  const bgColor = isDark ? 'bg-gray-950' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const headerBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
  const accentColor = isDark ? 'text-cyan-400' : 'text-cyan-700';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} shadow-lg`}>
      {/* Compact Header */}
      <div className={`${headerBg} p-6`}>
        <h1 className="text-3xl mb-1">{mockData.personalInfo.fullName}</h1>
        <p className={`text-lg ${accentColor} mb-3`}>{mockData.personalInfo.title}</p>
        <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm ${secondaryTextColor}`}>
          {mockData.personalInfo.contact.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Profile */}
        <div>
          <h2 className={`text-base ${accentColor} uppercase tracking-wide mb-2 font-bold`}>
            Profile
          </h2>
          <p className={`${secondaryTextColor} text-sm leading-relaxed`}>
            {mockData.profile}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h2 className={`text-base ${accentColor} uppercase tracking-wide mb-3 font-bold`}>
            Experience
          </h2>
          <div className="space-y-4">
            {mockData.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm">{exp.role}</h3>
                  <span className={`${secondaryTextColor} text-xs`}>{exp.period}</span>
                </div>
                <p className={`${secondaryTextColor} text-sm mb-1.5`}>{exp.company}</p>
                <ul className={`${secondaryTextColor} space-y-0.5 text-xs`}>
                  {exp.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          <div>
            <h2 className={`text-base ${accentColor} uppercase tracking-wide mb-2 font-bold`}>
              Education
            </h2>
            <div className={`${secondaryTextColor} space-y-1 text-xs`}>
              {mockData.education.map((edu, i) => (
                <p key={i}>{edu}</p>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {mockData.certifications && (
            <div>
              <h2 className={`text-base ${accentColor} uppercase tracking-wide mb-2 font-bold`}>
                Certifications
              </h2>
              <div className={`${secondaryTextColor} space-y-1 text-xs`}>
                {mockData.certifications.map((cert, i) => (
                  <p key={i}>{cert}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div>
          <h2 className={`text-base ${accentColor} uppercase tracking-wide mb-2 font-bold`}>
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {mockData.skills.map((skill, i) => (
              <span
                key={i}
                className={`px-2 py-1 text-xs ${
                  isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                } rounded`}
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
