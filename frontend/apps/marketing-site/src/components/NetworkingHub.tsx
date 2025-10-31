import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Users, Plus, Mail, Phone, Linkedin, Building2, Calendar } from 'lucide-react';

export function NetworkingHub() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Engineering Manager',
      company: 'Google',
      relationship: 'Recruiter',
      lastContact: '2 days ago',
      notes: 'Discussed Senior SWE position',
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      title: 'Senior Software Engineer',
      company: 'Meta',
      relationship: 'Referral',
      lastContact: '1 week ago',
      notes: 'Offered to refer me',
    },
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Networking Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your professional connections
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Contacts', value: contacts.length, icon: Users },
          { label: 'Active Conversations', value: '3', icon: Mail },
          { label: 'Follow-ups Due', value: '2', icon: Calendar },
          { label: 'Referrals', value: '5', icon: Building2 },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-gray-900 dark:text-white">{stat.value}</h2>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Input placeholder="Search contacts..." className="flex-1" />
          <Button variant="outline">Filter</Button>
        </div>

        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white">{contact.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{contact.title}</p>
                    <p className="text-gray-500 dark:text-gray-500">{contact.company}</p>
                  </div>
                </div>
                <Badge variant="outline">{contact.relationship}</Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">{contact.notes}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-500">Last contact: {contact.lastContact}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
