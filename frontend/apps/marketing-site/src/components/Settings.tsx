import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';

export function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-6">Profile Information</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-400">JD</span>
              </Avatar>
              <div>
                <Button variant="outline" className="mr-3">Change Photo</Button>
                <Button variant="ghost">Remove</Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="San Francisco, CA" defaultValue="San Francisco, CA" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-24 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                  placeholder="Tell us about yourself..."
                  defaultValue="Passionate software engineer with 5+ years of experience..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-gray-600 dark:text-gray-400">Receive email updates about your applications</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-gray-600 dark:text-gray-400">Get push notifications on your devices</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">Weekly Digest</p>
                  <p className="text-gray-600 dark:text-gray-400">Receive a weekly summary of your job search</p>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>

              <div className="py-4">
                <h4 className="text-gray-900 dark:text-white mb-4">Email me when:</h4>
                <div className="space-y-3">
                  {[
                    'A new job matching my criteria is posted',
                    'An application status changes',
                    'An interview is scheduled or updated',
                    'I receive a message from a recruiter',
                    'My resume needs updating',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label className="text-gray-700 dark:text-gray-300">{item}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Preferences</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-6">Application Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-gray-600 dark:text-gray-400">Switch between light and dark themes</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                >
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                >
                  <option>Pacific Time (PT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Central Time (CT)</option>
                  <option>Eastern Time (ET)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <select
                  id="dateFormat"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                >
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Preferences</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-6">Change Password</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-6">Two-Factor Authentication</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-900 dark:text-white">Two-factor authentication</p>
                  <p className="text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-6">Active Sessions</h3>
              
              <div className="space-y-4">
                {[
                  { device: 'MacBook Pro', location: 'San Francisco, CA', time: 'Active now', current: true },
                  { device: 'iPhone 14', location: 'San Francisco, CA', time: '2 hours ago', current: false },
                  { device: 'iPad Air', location: 'Oakland, CA', time: '1 day ago', current: false },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 dark:text-white">{session.device}</p>
                        {session.current && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{session.location}</p>
                      <p className="text-gray-500 dark:text-gray-500">{session.time}</p>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-red-200 dark:border-red-800">
              <h3 className="text-red-600 dark:text-red-400 mb-6">Danger Zone</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <div>
                    <p className="text-gray-900 dark:text-white">Delete Account</p>
                    <p className="text-gray-600 dark:text-gray-400">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
