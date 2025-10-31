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
    location: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function ModernTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'John Doe',
      title: 'Senior Software Engineer',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedIn: 'linkedin.com/in/johndoe',
      portfolio: 'johndoe.com',
    },
    summary: 'Innovative software engineer specializing in modern web technologies and cloud architecture. Passionate about creating elegant solutions to complex problems.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: 'Jan 2021',
        endDate: 'Present',
        achievements: [
          'Architected scalable microservices handling 1M+ daily requests',
          'Led team of 5 engineers in delivering critical product features',
          'Reduced infrastructure costs by 35% through optimization',
        ],
      },
      {
        title: 'Software Engineer',
        company: 'StartUp Inc',
        location: 'Remote',
        startDate: 'Jun 2019',
        endDate: 'Dec 2020',
        achievements: [
          'Built real-time collaboration features using WebSockets',
          'Improved API response times by 50%',
          'Mentored junior developers and conducted code reviews',
        ],
      },
    ],
    education: [
      {
        degree: 'BS in Computer Science',
        institution: 'UC Berkeley',
        graduationDate: '2019',
        gpa: '3.8',
      },
    ],
    skills: {
      technical: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
      soft: ['Leadership', 'Communication', 'Agile'],
    },
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const sidebarBg = isDark ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-600 to-purple-600';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} flex shadow-lg overflow-hidden`}>
      {/* Sidebar */}
      <div className={`w-1/3 ${sidebarBg} text-white p-8`}>
        {/* Profile */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl backdrop-blur-sm">
            {mockData.personalInfo.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <h1 className="text-2xl text-center mb-1">{mockData.personalInfo.fullName}</h1>
          <p className="text-center text-white/80">{mockData.personalInfo.title}</p>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-lg mb-3 pb-2 border-b border-white/30">Contact</h2>
          <div className="space-y-2 text-sm text-white/90">
            <div className="flex items-start gap-2">
              <span className="text-white/60">📧</span>
              <span className="break-all">{mockData.personalInfo.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white/60">📱</span>
              <span>{mockData.personalInfo.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white/60">📍</span>
              <span>{mockData.personalInfo.location}</span>
            </div>
            {mockData.personalInfo.linkedIn && (
              <div className="flex items-start gap-2">
                <span className="text-white/60">💼</span>
                <span className="break-all">{mockData.personalInfo.linkedIn}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-lg mb-3 pb-2 border-b border-white/30">Skills</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm text-white/80 mb-2">Technical</h3>
              <div className="flex flex-wrap gap-1">
                {mockData.skills.technical.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-white/80 mb-2">Soft Skills</h3>
              <div className="flex flex-wrap gap-1">
                {mockData.skills.soft.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-lg mb-3 pb-2 border-b border-white/30">Education</h2>
          {mockData.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="text-sm mb-1">{edu.degree}</h3>
              <p className="text-sm text-white/80">{edu.institution}</p>
              <p className="text-xs text-white/60">{edu.graduationDate}</p>
              {edu.gpa && <p className="text-xs text-white/60">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-8 ${textColor}`}>
        {/* Summary */}
        <div className="mb-8">
          <h2 className="text-2xl mb-3 text-blue-600">About Me</h2>
          <p className={`${secondaryTextColor} leading-relaxed`}>{mockData.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-2xl mb-4 text-blue-600">Experience</h2>
          <div className="space-y-6">
            {mockData.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-blue-600">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="mb-2">
                  <h3 className="text-lg">{exp.title}</h3>
                  <p className={`${secondaryTextColor} text-sm`}>
                    {exp.company} • {exp.location}
                  </p>
                  <p className={`${secondaryTextColor} text-sm`}>
                    {exp.startDate} - {exp.endDate}
                  </p>
                </div>
                <ul className={`${secondaryTextColor} space-y-1 text-sm`}>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">▸</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
