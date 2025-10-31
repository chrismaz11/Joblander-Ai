import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  CreditCard,
  Calendar,
  Trash2
} from 'lucide-react';

export function Profile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/johndoe',
    portfolio: 'johndoe.com',
    bio: 'Experienced software engineer with 5+ years building scalable web applications.',
    
    // Professional Information
    currentTitle: 'Senior Software Engineer',
    yearsExperience: '5-10',
    desiredSalary: '$180,000 - $250,000',
    openToRemote: true,
    openToRelocate: false,
    
    // Password
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    // Save profile logic
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and account settings
        </p>
      </div>

      {saved && (
        <Alert className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            Your changes have been saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personal">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Profile Photo</h3>
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="mb-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-gray-500 dark:text-gray-500 text-center">
                  JPG, PNG or GIF (Max 5MB)
                </p>
              </div>
            </Card>

            <Card className="lg:col-span-2 p-6">
              <h3 className="text-gray-900 dark:text-white mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="fullName">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                  <Input
                    id="linkedIn"
                    placeholder="linkedin.com/in/username"
                    value={profileData.linkedIn}
                    onChange={(e) => setProfileData({ ...profileData, linkedIn: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="portfolio">Portfolio/Website</Label>
                  <Input
                    id="portfolio"
                    placeholder="yourwebsite.com"
                    value={profileData.portfolio}
                    onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Brief description of your professional background..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  />
                  <p className="text-gray-500 dark:text-gray-500">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Professional Information */}
        <TabsContent value="professional">
          <Card className="p-6 max-w-3xl">
            <h3 className="text-gray-900 dark:text-white mb-6">Professional Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentTitle">
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Current/Recent Title
                  </Label>
                  <Input
                    id="currentTitle"
                    value={profileData.currentTitle}
                    onChange={(e) => setProfileData({ ...profileData, currentTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <select
                    id="yearsExperience"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                    value={profileData.yearsExperience}
                    onChange={(e) => setProfileData({ ...profileData, yearsExperience: e.target.value })}
                  >
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desiredSalary">Desired Salary Range</Label>
                <Input
                  id="desiredSalary"
                  placeholder="e.g., $120,000 - $150,000"
                  value={profileData.desiredSalary}
                  onChange={(e) => setProfileData({ ...profileData, desiredSalary: e.target.value })}
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Label>Work Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remote"
                      checked={profileData.openToRemote}
                      onChange={(e) => setProfileData({ ...profileData, openToRemote: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="remote" className="text-gray-700 dark:text-gray-300">
                      Open to remote work
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="relocate"
                      checked={profileData.openToRelocate}
                      onChange={(e) => setProfileData({ ...profileData, openToRelocate: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="relocate" className="text-gray-700 dark:text-gray-300">
                      Open to relocation
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="max-w-3xl space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-6">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  />
                </div>

                <Alert>
                  <Lock className="w-4 h-4" />
                  <AlertDescription>
                    Password must be at least 8 characters with uppercase, lowercase, and numbers
                  </AlertDescription>
                </Alert>
              </div>

              <Button className="mt-6">Update Password</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Add an extra layer of security to your account
                  </p>
                  <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                    Not Enabled
                  </Badge>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-gray-900 dark:text-white">MacBook Pro - Chrome</p>
                    <p className="text-gray-500 dark:text-gray-500">San Francisco, CA • Active now</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Current
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-gray-900 dark:text-white">iPhone - Safari</p>
                    <p className="text-gray-500 dark:text-gray-500">San Francisco, CA • 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm">Revoke</Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payment">
          <div className="max-w-3xl space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 dark:text-white">Payment Methods</h3>
                <Button>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-900 dark:bg-gray-100 rounded flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white dark:text-gray-900" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 dark:text-white">
                            {method.brand} •••• {method.last4}
                          </span>
                          {method.isDefault && (
                            <Badge variant="outline" className="text-green-600 dark:text-green-400">
                              Default
                            </Badge>
                          )}
                        </div>
                        <span className="text-gray-500 dark:text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires {method.expiry}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                All payment information is encrypted and securely processed by Stripe. We never store your full card details.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
