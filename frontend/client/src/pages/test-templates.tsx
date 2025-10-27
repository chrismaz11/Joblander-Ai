import React from 'react';
import TemplateSelector from '@/components/templates/TemplateSelector';

const testData = {
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
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      year: '2019'
    }
  ]
};

export default function TestTemplates() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Template Test Page</h1>
        <TemplateSelector parsedData={testData} />
      </div>
    </div>
  );
}
