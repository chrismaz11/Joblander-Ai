interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    github?: string;
    linkedIn?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    achievements: string[];
    technologies: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function TechnicalTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'John Doe',
      title: 'Senior Software Engineer',
      email: 'john.doe@email.com',
      phone: '+1-555-123-4567',
      github: 'github.com/johndoe',
      linkedIn: 'linkedin.com/in/johndoe',
    },
    summary: 'Full-stack engineer with expertise in distributed systems, cloud architecture, and developer tooling. Open-source contributor and tech community advocate.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        duration: '2021 - Present',
        achievements: [
          'Architected microservices platform handling 10M+ requests/day',
          'Reduced deployment time from 2 hours to 15 minutes via CI/CD optimization',
          'Led migration from monolith to microservices (Node.js, Docker, K8s)',
        ],
        technologies: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'AWS'],
      },
      {
        title: 'Software Engineer',
        company: 'StartUp Inc',
        duration: '2019 - 2021',
        achievements: [
          'Built REST API serving 100K+ users with 99.9% uptime',
          'Implemented real-time features using WebSockets and Redis Pub/Sub',
          'Reduced database query times by 60% through optimization',
        ],
        technologies: ['Python', 'Django', 'Vue.js', 'MySQL', 'Docker'],
      },
    ],
    education: [
      {
        degree: 'BS Computer Science',
        institution: 'UC Berkeley',
        year: '2019',
      },
    ],
    skills: {
      languages: ['TypeScript', 'Python', 'Go', 'SQL'],
      frameworks: ['React', 'Node.js', 'Django', 'Express'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
      tools: ['Docker', 'Kubernetes', 'AWS', 'Git', 'Jenkins'],
    },
    projects: [
      {
        name: 'Open Source Contribution',
        description: 'Core contributor to popular dev tools with 10K+ GitHub stars',
        technologies: ['TypeScript', 'Node.js'],
      },
    ],
  };

  const bgColor = isDark ? 'bg-gray-950' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const codeBg = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const accentColor = isDark ? 'text-green-400' : 'text-green-600';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} p-10 shadow-lg font-mono`}>
      {/* Header - Terminal Style */}
      <div className={`${codeBg} rounded-lg p-6 mb-6 border ${borderColor}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="space-y-1">
          <p className={secondaryTextColor}>$ whoami</p>
          <h1 className="text-3xl">{mockData.personalInfo.fullName}</h1>
          <p className={`text-lg ${accentColor}`}>{mockData.personalInfo.title}</p>
          <div className={`flex gap-4 text-sm ${secondaryTextColor} mt-3`}>
            <span>📧 {mockData.personalInfo.email}</span>
            <span>📱 {mockData.personalInfo.phone}</span>
          </div>
          <div className={`flex gap-4 text-sm ${secondaryTextColor}`}>
            {mockData.personalInfo.github && <span>🔗 {mockData.personalInfo.github}</span>}
            {mockData.personalInfo.linkedIn && <span>💼 {mockData.personalInfo.linkedIn}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className={`text-sm ${accentColor} mb-2`}>## ABOUT</h2>
        <p className={`${secondaryTextColor} text-sm leading-relaxed`}>{mockData.summary}</p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className={`text-sm ${accentColor} mb-3`}>## TECHNICAL_SKILLS</h2>
        <div className={`${codeBg} rounded-lg p-4 space-y-2 text-sm border ${borderColor}`}>
          <div>
            <span className={secondaryTextColor}>languages:</span>{' '}
            <span>[{mockData.skills.languages.map(l => `"${l}"`).join(', ')}]</span>
          </div>
          <div>
            <span className={secondaryTextColor}>frameworks:</span>{' '}
            <span>[{mockData.skills.frameworks.map(f => `"${f}"`).join(', ')}]</span>
          </div>
          <div>
            <span className={secondaryTextColor}>databases:</span>{' '}
            <span>[{mockData.skills.databases.map(d => `"${d}"`).join(', ')}]</span>
          </div>
          <div>
            <span className={secondaryTextColor}>tools:</span>{' '}
            <span>[{mockData.skills.tools.map(t => `"${t}"`).join(', ')}]</span>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className={`text-sm ${accentColor} mb-3`}>## EXPERIENCE</h2>
        <div className="space-y-4">
          {mockData.experience.map((exp, idx) => (
            <div key={idx} className={`${codeBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base mb-1">{exp.title}</h3>
                  <p className={secondaryTextColor}>{exp.company}</p>
                </div>
                <span className={`${secondaryTextColor} text-sm`}>{exp.duration}</span>
              </div>
              <ul className={`${secondaryTextColor} space-y-1 text-sm mb-2`}>
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={accentColor}>›</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1 mt-2">
                {exp.technologies.map((tech, i) => (
                  <span 
                    key={i}
                    className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        <div>
          <h2 className={`text-sm ${accentColor} mb-3`}>## EDUCATION</h2>
          {mockData.education.map((edu, idx) => (
            <div key={idx} className={`${codeBg} rounded-lg p-3 border ${borderColor}`}>
              <h3 className="text-sm mb-1">{edu.degree}</h3>
              <p className={`${secondaryTextColor} text-sm`}>{edu.institution}</p>
              <p className={`${secondaryTextColor} text-xs`}>{edu.year}</p>
            </div>
          ))}
        </div>

        {/* Projects */}
        {mockData.projects && (
          <div>
            <h2 className={`text-sm ${accentColor} mb-3`}>## PROJECTS</h2>
            {mockData.projects.map((project, idx) => (
              <div key={idx} className={`${codeBg} rounded-lg p-3 border ${borderColor}`}>
                <h3 className="text-sm mb-1">{project.name}</h3>
                <p className={`${secondaryTextColor} text-xs mb-2`}>{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, i) => (
                    <span 
                      key={i}
                      className={`px-1.5 py-0.5 text-xs rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`mt-6 pt-4 border-t ${borderColor} text-center`}>
        <p className={`${secondaryTextColor} text-xs`}>
          $ echo "Built with ❤️ and lots of ☕"
        </p>
      </div>
    </div>
  );
}
