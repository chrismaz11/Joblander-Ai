interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    highlights: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function BoldTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'ALEX RIVERA',
      title: 'PRODUCT MANAGER',
      email: 'alex.rivera@email.com',
      phone: '555-789-0123',
      location: 'Austin, TX',
      portfolio: 'alexrivera.io',
    },
    summary: 'Dynamic product manager with 6+ years launching successful B2B SaaS products. Track record of leading cross-functional teams and driving 10x user growth.',
    experience: [
      {
        title: 'Senior Product Manager',
        company: 'Tech Unicorn Inc',
        duration: '2021 - PRESENT',
        highlights: [
          'Led development of flagship product serving 500K+ users',
          'Increased user engagement by 85% through data-driven features',
          'Managed $5M product budget and team of 12 engineers',
          'Reduced churn rate from 8% to 3% in 6 months',
        ],
      },
      {
        title: 'Product Manager',
        company: 'Growth Startup Co',
        duration: '2019 - 2021',
        highlights: [
          'Launched 3 major features generating $2M ARR',
          'Conducted 100+ user interviews to inform roadmap',
          'Achieved 95% feature adoption rate',
        ],
      },
      {
        title: 'Associate Product Manager',
        company: 'Enterprise Solutions LLC',
        duration: '2018 - 2019',
        highlights: [
          'Shipped MVP in 4 months under budget',
          'Managed stakeholder relationships across 5 departments',
        ],
      },
    ],
    education: [
      {
        degree: 'MBA, Product Management',
        institution: 'UC Berkeley Haas',
        year: '2018',
      },
      {
        degree: 'BS Business Administration',
        institution: 'University of Texas',
        year: '2016',
      },
    ],
    skills: [
      'Product Strategy',
      'User Research',
      'Data Analysis',
      'Roadmap Planning',
      'Agile/Scrum',
      'A/B Testing',
      'SQL',
      'Figma',
      'Jira',
      'Mixpanel',
    ],
  };

  const bgColor = isDark ? 'bg-black' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-700';
  const accentBg = isDark ? 'bg-white' : 'bg-black';
  const accentText = isDark ? 'text-black' : 'text-white';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} shadow-lg`}>
      {/* Bold Header Section */}
      <div className={`${accentBg} ${accentText} p-12`}>
        <h1 className="text-6xl mb-3 tracking-tight" style={{ letterSpacing: '0.05em' }}>
          {mockData.personalInfo.fullName}
        </h1>
        <h2 className="text-3xl opacity-90" style={{ letterSpacing: '0.2em' }}>
          {mockData.personalInfo.title}
        </h2>
      </div>

      <div className="p-12">
        {/* Contact Bar */}
        <div className={`flex justify-between py-4 border-b-4 ${isDark ? 'border-white' : 'border-black'} mb-8`}>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <span className="font-bold">{mockData.personalInfo.email}</span>
            <span className="font-bold">{mockData.personalInfo.phone}</span>
            <span className="font-bold">{mockData.personalInfo.location}</span>
            <span className="font-bold">{mockData.personalInfo.portfolio}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <h3 className="text-2xl mb-4 uppercase tracking-wider">Profile</h3>
          <p className={`${secondaryTextColor} text-lg leading-relaxed`}>
            {mockData.summary}
          </p>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h3 className="text-2xl mb-4 uppercase tracking-wider">Experience</h3>
          <div className="space-y-6">
            {mockData.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl mb-1">{exp.title}</h4>
                    <p className={`${secondaryTextColor} text-lg`}>{exp.company}</p>
                  </div>
                  <span className="text-lg font-bold whitespace-nowrap ml-4">
                    {exp.duration}
                  </span>
                </div>
                <div className="space-y-2">
                  {exp.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 ${accentBg} mt-2 flex-shrink-0`}></div>
                      <p className={secondaryTextColor}>{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Skills */}
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl mb-4 uppercase tracking-wider">Education</h3>
            <div className="space-y-4">
              {mockData.education.map((edu, idx) => (
                <div key={idx}>
                  <p className="text-lg mb-1">{edu.degree}</p>
                  <p className={secondaryTextColor}>{edu.institution}</p>
                  <p className={`${secondaryTextColor} font-bold`}>{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl mb-4 uppercase tracking-wider">Skills</h3>
            <div className="grid grid-cols-2 gap-2">
              {mockData.skills.map((skill, i) => (
                <div key={i} className={`py-2 px-3 ${isDark ? 'bg-white/10' : 'bg-black/5'} font-bold`}>
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
