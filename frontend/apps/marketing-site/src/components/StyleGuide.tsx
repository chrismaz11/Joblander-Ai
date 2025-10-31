import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  Sparkles,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';

export function StyleGuide() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">JobLander Design System</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A comprehensive guide to JobLander's components and design patterns
        </p>
      </div>

      <Tabs defaultValue="colors">
        <TabsList className="mb-6">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* Colors */}
        <TabsContent value="colors">
          <div className="space-y-8">
            <div>
              <h2 className="text-gray-900 dark:text-white mb-4">Brand Colors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="w-full h-20 bg-blue-600 rounded-lg mb-3"></div>
                  <p className="text-gray-900 dark:text-white">Primary</p>
                  <p className="text-gray-500 dark:text-gray-500">#2563eb</p>
                </Card>
                <Card className="p-4">
                  <div className="w-full h-20 bg-green-500 rounded-lg mb-3"></div>
                  <p className="text-gray-900 dark:text-white">Success</p>
                  <p className="text-gray-500 dark:text-gray-500">#10b981</p>
                </Card>
                <Card className="p-4">
                  <div className="w-full h-20 bg-amber-500 rounded-lg mb-3"></div>
                  <p className="text-gray-900 dark:text-white">Warning</p>
                  <p className="text-gray-500 dark:text-gray-500">#f59e0b</p>
                </Card>
                <Card className="p-4">
                  <div className="w-full h-20 bg-red-500 rounded-lg mb-3"></div>
                  <p className="text-gray-900 dark:text-white">Error</p>
                  <p className="text-gray-500 dark:text-gray-500">#ef4444</p>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-gray-900 dark:text-white mb-4">Gradients</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="w-full h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-3"></div>
                  <p className="text-gray-900 dark:text-white">Primary Gradient</p>
                  <p className="text-gray-500 dark:text-gray-500">Blue to Purple</p>
                </Card>
                <Card className="p-4">
                  <div className="w-full h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mb-3"></div>
                  <p className="text-gray-900 dark:text-white">Success Gradient</p>
                  <p className="text-gray-500 dark:text-gray-500">Green to Emerald</p>
                </Card>
                <Card className="p-4">
                  <div className="w-full h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg mb-3"></div>
                  <p className="text-gray-900 dark:text-white">Hero Gradient</p>
                  <p className="text-gray-500 dark:text-gray-500">Multi-color</p>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Typography */}
        <TabsContent value="typography">
          <div className="space-y-6">
            <Card className="p-6">
              <h1 className="mb-4">Heading 1 - Main Page Title</h1>
              <h2 className="mb-4">Heading 2 - Section Title</h2>
              <h3 className="mb-4">Heading 3 - Subsection Title</h3>
              <h4 className="mb-4">Heading 4 - Card Title</h4>
              <p className="mb-4">
                Body text - This is regular paragraph text used throughout the application.
                It should be readable and maintain good contrast ratios.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Secondary text - Used for descriptions and less important information.
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Tertiary text - Used for metadata, timestamps, and auxiliary information.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Font Weights</h3>
              <div className="space-y-2">
                <p className="font-normal">Normal (400) - Body text and descriptions</p>
                <p className="font-medium">Medium (500) - Headings and emphasis</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Buttons */}
        <TabsContent value="buttons">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link Button</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Buttons with Icons</h3>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Resume
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="ghost">
                  <FileText className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Gradient Buttons (CTA)</h3>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
                  <Check className="w-4 h-4 mr-2" />
                  Get Started Free
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Button States</h3>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled Button</Button>
                <Button>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Forms */}
        <TabsContent value="forms">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Form Controls</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="text-input">Text Input</Label>
                  <Input id="text-input" placeholder="Enter text..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-input">Email Input</Label>
                  <Input id="email-input" type="email" placeholder="you@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textarea">Textarea</Label>
                  <Textarea id="textarea" placeholder="Enter longer text..." rows={4} />
                </div>

                <div className="space-y-2">
                  <Label>Checkboxes</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="check1" />
                      <label htmlFor="check1" className="text-gray-700 dark:text-gray-300">Option 1</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="check2" defaultChecked />
                      <label htmlFor="check2" className="text-gray-700 dark:text-gray-300">Option 2 (checked)</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Switches</Label>
                  <div className="flex items-center gap-3">
                    <Switch />
                    <span className="text-gray-700 dark:text-gray-300">Toggle setting</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Cards */}
        <TabsContent value="cards">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-gray-900 dark:text-white mb-2">Default Card</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Standard card with default styling
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
                <h3 className="text-white mb-2">Gradient Card</h3>
                <p className="text-blue-100">
                  Premium feature card with gradient background
                </p>
              </Card>

              <Card className="p-6 border-2 border-blue-500 shadow-lg">
                <Badge className="mb-2">Featured</Badge>
                <h3 className="text-gray-900 dark:text-white mb-2">Highlighted Card</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Card with accent border
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-gray-900 dark:text-white mb-1">Info Card</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Used for informational messages
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-gray-900 dark:text-white mb-1">Warning Card</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Used for warnings and caution
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Feedback */}
        <TabsContent value="feedback">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Success</Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Info</Badge>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Progress Bars</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">25% Complete</span>
                  </div>
                  <Progress value={25} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">50% Complete</span>
                  </div>
                  <Progress value={50} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">75% Complete</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">100% Complete</span>
                  </div>
                  <Progress value={100} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Status Indicators</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Active / Success</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Warning / Pending</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Error / Inactive</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Info / Processing</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Alert Messages</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-green-900 dark:text-green-200 mb-1">Success!</h4>
                    <p className="text-green-700 dark:text-green-300">Your changes have been saved successfully.</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-blue-900 dark:text-blue-200 mb-1">Information</h4>
                    <p className="text-blue-700 dark:text-blue-300">Please review the changes before submitting.</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-yellow-900 dark:text-yellow-200 mb-1">Warning</h4>
                    <p className="text-yellow-700 dark:text-yellow-300">You are approaching your usage limit.</p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-red-900 dark:text-red-200 mb-1">Error</h4>
                    <p className="text-red-700 dark:text-red-300">There was an error processing your request.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
