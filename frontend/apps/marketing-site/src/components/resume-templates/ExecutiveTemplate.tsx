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
    location: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
  certifications?: string[];
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function ExecutiveTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'Jane Smith',
      title: 'Chief Technology Officer',
      email: 'jane.smith@executive.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      linkedIn: 'linkedin.com/in/janesmith',
    },
    summary: 'Visionary technology executive with 15+ years leading digital transformation initiatives. Proven track record of scaling engineering organizations from 10 to 500+ employees while driving $100M+ in revenue growth. Expert in cloud migration, AI/ML strategy, and building high-performance teams.',
    experience: [
      {
        title: 'Chief Technology Officer',
        company: 'Fortune 500 Tech Corp',
        location: 'New York, NY',
        startDate: '2020',
        endDate: 'Present',
        achievements: [
          'Led company-wide digital transformation, resulting in 45% increase in operational efficiency',
          'Scaled engineering team from 50 to 300+ while maintaining 95% employee satisfaction',
          'Drove $80M cost savings through cloud migration and infrastructure optimization',
          'Established data science division that generated $50M in new revenue streams',
        ],
      },
      {
        title: 'Vice President of Engineering',
        company: 'Enterprise Solutions Inc',
        location: 'San Francisco, CA',
        startDate: '2016',
        endDate: '2020',
        achievements: [
          'Architected and launched SaaS platform serving 10K+ enterprise customers',
          'Reduced time-to-market by 60% through DevOps and agile transformation',
          'Built and mentored leadership team of 15 senior engineering managers',
          'Achieved 99.99% platform uptime while scaling to handle 1B+ daily transactions',
        ],
      },
      {
        title: 'Senior Engineering Director',
        company: 'Tech Innovations LLC',
        location: 'Boston, MA',
        startDate: '2012',
        endDate: '2016',
        achievements: [
          'Led 5 cross-functional teams delivering mission-critical systems',
          'Pioneered adoption of microservices architecture',
          'Reduced infrastructure costs by $5M annually',
        ],
      },
    ],
    education: [
      {
        degree: 'MBA, Technology Management',
        institution: 'Stanford Graduate School of Business',
        year: '2012',
      },
      {
        degree: 'MS Computer Science',
        institution: 'MIT',
        year: '2008',
      },
    ],
    skills: [
      'Strategic Planning',
      'Digital Transformation',
      'P&L Management',
      'Team Building',
      'Cloud Architecture',
      'AI/ML Strategy',
      'M&A Integration',
      'Board Relations',
    ],
    certifications: [
      'Certified Scrum Master (CSM)',
      'AWS Certified Solutions Architect',
      'PMP Certification',
    ],
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentColor = isDark ? 'bg-amber-600' : 'bg-amber-600';
  const accentTextColor = isDark ? 'text-amber-400' : 'text-amber-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} shadow-lg`}>
      {/* Header with accent bar */}
      <div className={`${accentColor} h-3`}></div>
      
      <div className="p-12">
        {/* Name and Title */}
        <div className="mb-8">
          <h1 className="text-5xl mb-3 tracking-tight">{mockData.personalInfo.fullName}</h1>
          <h2 className={`text-2xl ${accentTextColor} mb-6`}>{mockData.personalInfo.title}</h2>
          
          <div className={`grid grid-cols-2 gap-x-8 gap-y-2 text-sm ${secondaryTextColor}`}>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              {mockData.personalInfo.email}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              {mockData.personalInfo.phone}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              {mockData.personalInfo.location}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              {mockData.personalInfo.linkedIn}
            </div>
          </div>
        </div>

        <div className={`border-t-2 ${borderColor} mb-8`}></div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h3 className={`text-xl ${accentTextColor} mb-3 uppercase tracking-wide`}>
            Executive Summary
          </h3>
          <p className={`${secondaryTextColor} leading-relaxed text-justify`}>
            {mockData.summary}
          </p>
        </div>

        {/* Professional Experience */}
        <div className="mb-8">
          <h3 className={`text-xl ${accentTextColor} mb-4 uppercase tracking-wide`}>
            Professional Experience
          </h3>
          <div className="space-y-6">
            {mockData.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-lg mb-1">{exp.title}</h4>
                    <p className={`${secondaryTextColor} italic`}>
                      {exp.company}, {exp.location}
                    </p>
                  </div>
                  <div className={`${secondaryTextColor} text-right`}>
                    <p className="whitespace-nowrap">{exp.startDate} – {exp.endDate}</p>
                  </div>
                </div>
                <ul className={`${secondaryTextColor} space-y-1.5 mt-3`}>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`${accentTextColor} mt-1.5`}>■</span>
                      <span className="flex-1">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Additional Info */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className={`text-xl ${accentTextColor} mb-3 uppercase tracking-wide`}>
              Education
            </h3>
            <div className="space-y-3">
              {mockData.education.map((edu, idx) => (
                <div key={idx}>
                  <p className="mb-1">{edu.degree}</p>
                  <p className={secondaryTextColor}>{edu.institution}</p>
                  <p className={`${secondaryTextColor} text-sm`}>{edu.year}</p>
                </div>
              ))}
            </div>

            {mockData.certifications && (
              <div className="mt-6">
                <h4 className={`${accentTextColor} mb-2 uppercase text-sm tracking-wide`}>
                  Certifications
                </h4>
                <ul className={`${secondaryTextColor} space-y-1 text-sm`}>
                  {mockData.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h3 className={`text-xl ${accentTextColor} mb-3 uppercase tracking-wide`}>
              Core Competencies
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {mockData.skills.map((skill, i) => (
                <div key={i} className={`${secondaryTextColor} text-sm flex items-center gap-2`}>
                  <span className={`w-1.5 h-1.5 ${accentColor} rounded-full`}></span>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
