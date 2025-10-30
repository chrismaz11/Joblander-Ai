interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    website?: string;
    orcid?: string;
  };
  research: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    thesis?: string;
  }>;
  experience: Array<{
    title: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  publications: Array<{
    title: string;
    authors: string;
    venue: string;
    year: string;
  }>;
  skills: {
    research: string[];
    technical: string[];
    languages: string[];
  };
  awards?: string[];
}

interface TemplateProps {
  data?: ResumeData;
  isDark?: boolean;
}

export function AcademicTemplate({ data, isDark = false }: TemplateProps) {
  const mockData: ResumeData = data || {
    personalInfo: {
      fullName: 'Dr. Sarah Johnson',
      title: 'Assistant Professor of Computer Science',
      email: 'sarah.johnson@university.edu',
      phone: '+1 (555) 234-5678',
      website: 'sarahjohnson.edu',
      orcid: '0000-0002-1234-5678',
    },
    research: 'My research focuses on artificial intelligence, machine learning, and their applications in healthcare. I specialize in developing interpretable deep learning models for medical image analysis and clinical decision support systems.',
    education: [
      {
        degree: 'Ph.D. in Computer Science',
        institution: 'Massachusetts Institute of Technology',
        year: '2020',
        thesis: 'Interpretable Deep Learning for Medical Image Analysis',
      },
      {
        degree: 'M.S. in Computer Science',
        institution: 'Stanford University',
        year: '2016',
      },
      {
        degree: 'B.S. in Computer Science, Summa Cum Laude',
        institution: 'UC Berkeley',
        year: '2014',
      },
    ],
    experience: [
      {
        title: 'Assistant Professor',
        institution: 'Department of Computer Science, University of Excellence',
        startDate: '2020',
        endDate: 'Present',
        description: [
          'Teaching graduate and undergraduate courses in Machine Learning and AI',
          'Leading research lab with 8 Ph.D. students and 4 postdocs',
          'Secured $2M in research funding from NSF and NIH',
          'Published 15 papers in top-tier venues (NeurIPS, ICML, CVPR)',
        ],
      },
      {
        title: 'Postdoctoral Researcher',
        institution: 'Computer Vision Lab, Stanford University',
        startDate: '2020',
        endDate: '2021',
        description: [
          'Conducted research on medical image segmentation using deep learning',
          'Collaborated with Stanford Medical School on clinical applications',
          'Mentored 3 graduate students',
        ],
      },
    ],
    publications: [
      {
        title: 'Interpretable Neural Networks for Medical Diagnosis',
        authors: 'S. Johnson, A. Smith, B. Lee',
        venue: 'NeurIPS',
        year: '2023',
      },
      {
        title: 'Deep Learning for Radiology: A Comprehensive Survey',
        authors: 'S. Johnson, C. Davis',
        venue: 'Medical Image Analysis (Journal)',
        year: '2023',
      },
      {
        title: 'Attention Mechanisms in Medical Image Segmentation',
        authors: 'S. Johnson, et al.',
        venue: 'CVPR',
        year: '2022',
      },
    ],
    skills: {
      research: ['Machine Learning', 'Deep Learning', 'Medical Imaging', 'Computer Vision'],
      technical: ['Python', 'PyTorch', 'TensorFlow', 'R', 'MATLAB'],
      languages: ['English (Native)', 'French (Fluent)', 'Mandarin (Conversational)'],
    },
    awards: [
      'NSF CAREER Award (2023)',
      'Best Paper Award, ICML (2022)',
      'Outstanding Dissertation Award, MIT (2020)',
      'Google Ph.D. Fellowship (2018-2020)',
    ],
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentColor = isDark ? 'text-blue-400' : 'text-blue-700';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-300';

  return (
    <div className={`w-[210mm] h-[297mm] ${bgColor} ${textColor} p-12 shadow-lg font-serif`}>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-900 dark:border-gray-100">
        <h1 className="text-4xl mb-2">{mockData.personalInfo.fullName}</h1>
        <p className={`text-lg ${secondaryTextColor} mb-4`}>{mockData.personalInfo.title}</p>
        <div className={`flex justify-center gap-6 text-sm ${secondaryTextColor}`}>
          <span>{mockData.personalInfo.email}</span>
          <span>•</span>
          <span>{mockData.personalInfo.phone}</span>
          <span>•</span>
          <span>{mockData.personalInfo.website}</span>
        </div>
        {mockData.personalInfo.orcid && (
          <p className={`text-sm ${secondaryTextColor} mt-2`}>
            ORCID: {mockData.personalInfo.orcid}
          </p>
        )}
      </div>

      {/* Research Interests */}
      <div className="mb-6">
        <h2 className={`text-xl ${accentColor} mb-3 uppercase tracking-wide font-sans`}>
          Research Interests
        </h2>
        <p className={`${secondaryTextColor} leading-relaxed text-justify`}>
          {mockData.research}
        </p>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className={`text-xl ${accentColor} mb-3 uppercase tracking-wide font-sans`}>
          Education
        </h2>
        <div className="space-y-3">
          {mockData.education.map((edu, idx) => (
            <div key={idx}>
              <div className="flex justify-between">
                <span className="font-semibold">{edu.degree}</span>
                <span className={secondaryTextColor}>{edu.year}</span>
              </div>
              <p className={secondaryTextColor}>{edu.institution}</p>
              {edu.thesis && (
                <p className={`${secondaryTextColor} text-sm italic mt-1`}>
                  Thesis: {edu.thesis}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Academic Experience */}
      <div className="mb-6">
        <h2 className={`text-xl ${accentColor} mb-3 uppercase tracking-wide font-sans`}>
          Academic Experience
        </h2>
        <div className="space-y-4">
          {mockData.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{exp.title}</span>
                <span className={secondaryTextColor}>
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <p className={`${secondaryTextColor} mb-2`}>{exp.institution}</p>
              <ul className={`${secondaryTextColor} space-y-1 text-sm ml-5`}>
                {exp.description.map((item, i) => (
                  <li key={i} className="list-disc">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Publications */}
      <div className="mb-6">
        <h2 className={`text-xl ${accentColor} mb-3 uppercase tracking-wide font-sans`}>
          Selected Publications
        </h2>
        <div className="space-y-2">
          {mockData.publications.map((pub, idx) => (
            <div key={idx} className={`${secondaryTextColor} text-sm`}>
              <p className="mb-1">
                <span className="font-semibold">{pub.title}</span>
              </p>
              <p>
                {pub.authors}. <em>{pub.venue}</em>, {pub.year}.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills and Awards */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className={`text-lg ${accentColor} mb-2 uppercase tracking-wide font-sans`}>
            Skills
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Research:</span>{' '}
              <span className={secondaryTextColor}>
                {mockData.skills.research.join(', ')}
              </span>
            </div>
            <div>
              <span className="font-semibold">Technical:</span>{' '}
              <span className={secondaryTextColor}>
                {mockData.skills.technical.join(', ')}
              </span>
            </div>
            <div>
              <span className="font-semibold">Languages:</span>{' '}
              <span className={secondaryTextColor}>
                {mockData.skills.languages.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {mockData.awards && (
          <div>
            <h2 className={`text-lg ${accentColor} mb-2 uppercase tracking-wide font-sans`}>
              Honors & Awards
            </h2>
            <ul className={`${secondaryTextColor} space-y-1 text-sm`}>
              {mockData.awards.map((award, i) => (
                <li key={i}>• {award}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
