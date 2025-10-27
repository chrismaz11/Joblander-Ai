import React, { useState } from 'react';
import TemplateSelector from './templates/TemplateSelector';

const ResumeBuilder = () => {
  const [resumeData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced software developer with 5+ years building scalable web applications.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: [
      {
        title: 'Senior Software Developer',
        company: 'Tech Innovations Inc.',
        date: '2021 - Present',
        description: 'Led development of microservices architecture serving 1M+ users. Improved system performance by 40% through optimization.'
      },
      {
        title: 'Software Developer',
        company: 'StartupCorp',
        date: '2019 - 2021',
        description: 'Built full-stack web applications using React and Node.js. Collaborated with cross-functional teams to deliver features.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        year: '2019'
      }
    ]
  });

  return (
    <div>
      <TemplateSelector parsedData={resumeData} />
    </div>
  );
};

export default ResumeBuilder;
