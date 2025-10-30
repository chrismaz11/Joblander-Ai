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
    description: string;
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

export function ProfessionalTemplate({ data, isDark = false }: TemplateProps) {
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
    summary: 'Results-driven software engineer with 5+ years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact projects.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: 'Jan 2021',
        endDate: 'Present',
        description: 'Leading development of customer-facing applications',
        achievements: [
          'Reduced page load time by 40% through performance optimization',
          'Mentored 3 junior developers and established code review standards',
          'Led migration to microservices architecture serving 100K+ users',
        ],
      },
      {
        title: 'Software Engineer',
        company: 'StartUp Inc',
        location: 'Remote',
        startDate: 'Jun 2019',
        endDate: 'Dec 2020',
        description: 'Built and maintained core product features',
        achievements: [
          'Developed RESTful APIs handling 10K+ daily requests',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
          'Reduced production bugs by 30% through comprehensive testing',
        ],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        graduationDate: 'May 2019',
        gpa: '3.8',
      },
    ],
    skills: {
      technical: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
    },
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentColor = isDark ? 'bg-blue-600' : 'bg-blue-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-300';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} p-12 font-sans shadow-lg`}>
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-blue-600">
        <h1 className="text-4xl mb-2">{mockData.personalInfo.fullName}</h1>
        <p className={`text-xl ${secondaryTextColor} mb-4`}>{mockData.personalInfo.title}</p>
        <div className={`flex flex-wrap gap-4 text-sm ${secondaryTextColor}`}>
          <span>{mockData.personalInfo.email}</span>
          <span>•</span>
          <span>{mockData.personalInfo.phone}</span>
          <span>•</span>
          <span>{mockData.personalInfo.location}</span>
          {mockData.personalInfo.linkedIn && (
            <>
              <span>•</span>
              <span>{mockData.personalInfo.linkedIn}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h2 className="text-xl mb-3 flex items-center gap-2">
          <div className={`w-1 h-6 ${accentColor}`}></div>
          Professional Summary
        </h2>
        <p className={`${secondaryTextColor} leading-relaxed`}>{mockData.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl mb-3 flex items-center gap-2">
          <div className={`w-1 h-6 ${accentColor}`}></div>
          Professional Experience
        </h2>
        <div className="space-y-4">
          {mockData.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg">{exp.title}</h3>
                  <p className={secondaryTextColor}>{exp.company} • {exp.location}</p>
                </div>
                <span className={`${secondaryTextColor} text-sm`}>
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <ul className={`${secondaryTextColor} space-y-1 ml-4`}>
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="list-disc">{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl mb-3 flex items-center gap-2">
          <div className={`w-1 h-6 ${accentColor}`}></div>
          Education
        </h2>
        {mockData.education.map((edu, idx) => (
          <div key={idx} className="flex justify-between">
            <div>
              <h3 className="text-lg">{edu.degree}</h3>
              <p className={secondaryTextColor}>{edu.institution}</p>
            </div>
            <div className="text-right">
              <p className={secondaryTextColor}>{edu.graduationDate}</p>
              {edu.gpa && <p className={secondaryTextColor}>GPA: {edu.gpa}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl mb-3 flex items-center gap-2">
          <div className={`w-1 h-6 ${accentColor}`}></div>
          Skills
        </h2>
        <div className="space-y-2">
          <div>
            <h4 className={`${secondaryTextColor} mb-1`}>Technical Skills</h4>
            <p className="text-sm">{mockData.skills.technical.join(' • ')}</p>
          </div>
          <div>
            <h4 className={`${secondaryTextColor} mb-1`}>Soft Skills</h4>
            <p className="text-sm">{mockData.skills.soft.join(' • ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
