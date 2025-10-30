interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
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
  skills: string[];
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function MinimalTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'JOHN DOE',
      title: 'Software Engineer',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedIn: 'linkedin.com/in/johndoe',
    },
    summary: 'Clean, efficient code is my passion. I build scalable systems that solve real problems.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        startDate: '2021',
        endDate: 'Present',
        achievements: [
          'Lead engineer for core platform services',
          'Reduced system latency by 60%',
          'Mentor to 5 junior engineers',
        ],
      },
      {
        title: 'Software Engineer',
        company: 'StartUp Inc',
        startDate: '2019',
        endDate: '2020',
        achievements: [
          'Built API infrastructure from scratch',
          'Implemented automated testing pipeline',
          'Shipped 15+ major features',
        ],
      },
    ],
    education: [
      {
        degree: 'BS Computer Science',
        institution: 'UC Berkeley',
        graduationDate: '2019',
      },
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Redis', 'GraphQL'],
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-500' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-300';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} p-16 font-sans shadow-lg`}>
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl tracking-wider mb-2" style={{ letterSpacing: '0.1em' }}>
          {mockData.personalInfo.fullName}
        </h1>
        <p className={`text-lg ${secondaryTextColor} mb-6 tracking-wide`}>
          {mockData.personalInfo.title}
        </p>
        <div className={`flex justify-center gap-6 text-sm ${secondaryTextColor}`}>
          <span>{mockData.personalInfo.email}</span>
          <span>•</span>
          <span>{mockData.personalInfo.phone}</span>
          <span>•</span>
          <span>{mockData.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <p className={`${secondaryTextColor} italic`}>{mockData.summary}</p>
      </div>

      <div className={`border-t ${borderColor} mb-10`}></div>

      {/* Experience */}
      <div className="mb-10">
        <h2 className={`text-xs tracking-widest uppercase ${secondaryTextColor} mb-6`}>
          Experience
        </h2>
        <div className="space-y-8">
          {mockData.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h3 className="text-lg">{exp.title}</h3>
                  <p className={secondaryTextColor}>{exp.company}</p>
                </div>
                <span className={`${secondaryTextColor} text-sm`}>
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <ul className={`${secondaryTextColor} space-y-1`}>
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>— {achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Skills Grid */}
      <div className="grid grid-cols-2 gap-12">
        {/* Education */}
        <div>
          <h2 className={`text-xs tracking-widest uppercase ${secondaryTextColor} mb-4`}>
            Education
          </h2>
          {mockData.education.map((edu, idx) => (
            <div key={idx}>
              <h3 className="text-base mb-1">{edu.degree}</h3>
              <p className={secondaryTextColor}>{edu.institution}</p>
              <p className={`${secondaryTextColor} text-sm`}>{edu.graduationDate}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 className={`text-xs tracking-widest uppercase ${secondaryTextColor} mb-4`}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {mockData.skills.map((skill, i) => (
              <span key={i} className={`text-sm ${secondaryTextColor}`}>
                {skill}{i < mockData.skills.length - 1 ? ' /' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
