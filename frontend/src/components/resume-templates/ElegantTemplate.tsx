interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
  };
  about: string;
  experience: Array<{
    title: string;
    company: string;
    years: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    details?: string;
  }>;
  expertise: string[];
  languages?: Array<{ name: string; level: string }>;
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function ElegantTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'Sophia Martinez',
      title: 'Marketing Director',
      email: 'sophia.martinez@mail.com',
      phone: '(555) 456-7890',
      location: 'Los Angeles, CA',
      website: 'sophiamartinez.com',
    },
    about: 'Award-winning marketing director with 10+ years crafting compelling brand narratives. Expertise in digital strategy, content marketing, and team leadership. Passionate about building brands that resonate and drive measurable growth.',
    experience: [
      {
        title: 'Marketing Director',
        company: 'Luxury Brand House',
        years: '2020 — Present',
        description: [
          'Spearhead integrated marketing campaigns reaching 5M+ consumers',
          'Grew brand awareness by 150% and increased revenue by $20M',
          'Lead creative team of 15 designers, writers, and strategists',
          'Manage annual marketing budget of $8M across digital and traditional channels',
        ],
      },
      {
        title: 'Senior Marketing Manager',
        company: 'Creative Agency Co',
        years: '2017 — 2020',
        description: [
          'Developed marketing strategies for Fortune 500 clients',
          'Increased client social media engagement by 300%',
          'Launched successful influencer partnership program',
        ],
      },
      {
        title: 'Marketing Manager',
        company: 'Digital Startup Inc',
        years: '2014 — 2017',
        description: [
          'Built marketing department from ground up',
          'Grew user base from 10K to 500K in 2 years',
          'Established brand voice and visual identity',
        ],
      },
    ],
    education: [
      {
        degree: 'Master of Business Administration',
        school: 'UCLA Anderson School of Management',
        year: '2014',
        details: 'Concentration: Marketing & Brand Management',
      },
      {
        degree: 'Bachelor of Arts in Communication',
        school: 'University of Southern California',
        year: '2012',
        details: 'Minor: Digital Media',
      },
    ],
    expertise: [
      'Brand Strategy',
      'Digital Marketing',
      'Content Strategy',
      'SEO/SEM',
      'Social Media',
      'Campaign Management',
      'Analytics & Insights',
      'Team Leadership',
      'Budget Management',
      'Creative Direction',
    ],
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Fluent' },
      { name: 'French', level: 'Intermediate' },
    ],
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentColor = isDark ? 'text-rose-400' : 'text-rose-600';
  const decorativeLine = isDark ? 'bg-gradient-to-r from-rose-400 to-purple-400' : 'bg-gradient-to-r from-rose-600 to-purple-600';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} shadow-lg`}>
      <div className="grid grid-cols-3 h-full">
        {/* Sidebar */}
        <div className={`col-span-1 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-10`}>
          {/* Profile Photo Placeholder */}
          <div className={`w-32 h-32 ${decorativeLine} rounded-full mx-auto mb-8 flex items-center justify-center text-white text-3xl`}>
            {mockData.personalInfo.fullName.split(' ').map(n => n[0]).join('')}
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h3 className={`text-sm ${accentColor} uppercase tracking-widest mb-4`}>
              Contact
            </h3>
            <div className={`space-y-3 text-sm ${secondaryTextColor}`}>
              <p className="break-words">{mockData.personalInfo.email}</p>
              <p>{mockData.personalInfo.phone}</p>
              <p>{mockData.personalInfo.location}</p>
              {mockData.personalInfo.website && (
                <p className="break-words">{mockData.personalInfo.website}</p>
              )}
            </div>
          </div>

          {/* Expertise */}
          <div className="mb-8">
            <h3 className={`text-sm ${accentColor} uppercase tracking-widest mb-4`}>
              Expertise
            </h3>
            <div className="space-y-2">
              {mockData.expertise.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 ${decorativeLine} rounded-full`}></div>
                  <span className={`text-sm ${secondaryTextColor}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          {mockData.languages && (
            <div>
              <h3 className={`text-sm ${accentColor} uppercase tracking-widest mb-4`}>
                Languages
              </h3>
              <div className="space-y-2">
                {mockData.languages.map((lang, i) => (
                  <div key={i} className={`text-sm ${secondaryTextColor}`}>
                    <span className="font-semibold">{lang.name}</span>
                    <br />
                    <span className="text-xs">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {mockData.personalInfo.fullName}
            </h1>
            <h2 className={`text-2xl ${accentColor} mb-6`} style={{ fontFamily: 'Georgia, serif' }}>
              {mockData.personalInfo.title}
            </h2>
            <div className={`${decorativeLine} h-1 w-24 mb-6`}></div>
            <p className={`${secondaryTextColor} leading-relaxed italic`}>
              {mockData.about}
            </p>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h3 className={`text-xl ${accentColor} uppercase tracking-wide mb-4`} style={{ fontFamily: 'Georgia, serif' }}>
              Experience
            </h3>
            <div className="space-y-6">
              {mockData.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-lg">{exp.title}</h4>
                    <span className={`${secondaryTextColor} text-sm italic`}>
                      {exp.years}
                    </span>
                  </div>
                  <p className={`${secondaryTextColor} italic mb-2`}>{exp.company}</p>
                  <ul className={`${secondaryTextColor} space-y-1 text-sm`}>
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={accentColor}>—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className={`text-xl ${accentColor} uppercase tracking-wide mb-4`} style={{ fontFamily: 'Georgia, serif' }}>
              Education
            </h3>
            <div className="space-y-4">
              {mockData.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg">{edu.degree}</h4>
                    <span className={`${secondaryTextColor} text-sm italic`}>
                      {edu.year}
                    </span>
                  </div>
                  <p className={`${secondaryTextColor} italic`}>{edu.school}</p>
                  {edu.details && (
                    <p className={`${secondaryTextColor} text-sm mt-1`}>{edu.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
