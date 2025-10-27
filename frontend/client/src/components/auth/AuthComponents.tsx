import React, { useState } from 'react';
import { useAuth } from '../../lib/aws/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const { signIn, signInWithGoogle, signInWithAmazon, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithGoogle();
      if (result.redirecting) {
        // User will be redirected to Google
        return;
      }
      if (!result.success) {
        setError(result.error || 'Google login failed');
      }
    } catch (error) {
      setError('Google login failed');
    }
  };

  const handleAmazonLogin = async () => {
    setError('');
    try {
      const result = await signInWithAmazon();
      if (result.redirecting) {
        // User will be redirected to Amazon
        return;
      }
      if (!result.success) {
        setError(result.error || 'Amazon login failed');
      }
    } catch (error) {
      setError('Amazon login failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your Job-Lander account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          <Button
            variant="outline"
            onClick={handleAmazonLogin}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M.045 18.153c.326.348.75.522 1.274.522.457 0 .87-.13 1.24-.391a3.15 3.15 0 001.001-1.044c.261-.435.391-.913.391-1.435 0-.804-.217-1.479-.652-2.024-.435-.545-1.022-.848-1.762-.913L0 12.848v5.305zM8.348 4.217c1.24 0 2.175.348 2.805 1.044s.945 1.631.945 2.805c0 .978-.261 1.87-.783 2.675-.522.804-1.24 1.413-2.152 1.826l1.435 3.044h1.914l-1.718-2.892c1.044-.348 1.87-1.001 2.479-1.957.609-.956.913-2.088.913-3.393 0-1.761-.522-3.175-1.566-4.24C10.675.063 9.218-.435 7.392-.435H2.61v18.588h1.914V4.217h4.824zm7.087 14.371c-.87 0-1.631-.261-2.283-.783-.652-.522-.978-1.196-.978-2.022 0-.652.196-1.24.588-1.762.391-.522.913-.891 1.566-1.109l2.152-.652c.587-.174.891-.435.891-.783 0-.391-.174-.696-.522-.913-.348-.217-.826-.326-1.435-.326-.739 0-1.37.196-1.892.588-.522.391-.783.956-.783 1.696h-1.827c0-1.305.478-2.37 1.435-3.196.956-.826 2.24-1.24 3.85-1.24 1.435 0 2.588.304 3.458.913.87.609 1.305 1.479 1.305 2.61v6.697c0 .391.043.739.13 1.044.087.304.239.565.457.783v.109c-.391.174-.783.261-1.175.261-.652 0-1.131-.239-1.435-.717-.087-.13-.152-.304-.196-.522-.609.478-1.283.804-2.022.978-.739.174-1.479.261-2.218.261zm.217-1.566c.826 0 1.566-.217 2.218-.652.652-.435.978-1.001.978-1.696v-.978c-.174.087-.391.174-.652.261l-1.305.391c-.739.217-1.283.478-1.631.783-.348.304-.522.652-.522 1.044 0 .435.174.783.522 1.044.348.261.826.391 1.435.391zm-1.566 1.305z"
                fill="#FF9900"
              />
            </svg>
            Amazon
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { signUp, signInWithGoogle, signInWithAmazon, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    company: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [verificationCode, setVerificationCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        {
          given_name: formData.firstName,
          family_name: formData.lastName,
          'custom:job_title': formData.jobTitle,
          'custom:company': formData.company,
        }
      );

      if (result.success) {
        if (result.isSignUpComplete) {
          onSuccess?.();
        } else {
          setStep('verify');
        }
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Note: confirmSignUp should be called from useAuth hook
      // const result = await confirmSignUp(formData.email, verificationCode);
      // For now, we'll simulate success
      onSuccess?.();
    } catch (error) {
      setError('Invalid verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We sent a verification code to {formData.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleVerification} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep('signup')}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Back to signup
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join Job-Lander to build your perfect resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title (Optional)</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                type="text"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="TechCorp Inc"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={async () => {
              const result = await signInWithGoogle();
              if (result.success && !result.redirecting) {
                onSuccess?.();
              }
            }}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          <Button
            variant="outline"
            onClick={async () => {
              const result = await signInWithAmazon();
              if (result.success && !result.redirecting) {
                onSuccess?.();
              }
            }}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M.045 18.153c.326.348.75.522 1.274.522.457 0 .87-.13 1.24-.391a3.15 3.15 0 001.001-1.044c.261-.435.391-.913.391-1.435 0-.804-.217-1.479-.652-2.024-.435-.545-1.022-.848-1.762-.913L0 12.848v5.305zM8.348 4.217c1.24 0 2.175.348 2.805 1.044s.945 1.631.945 2.805c0 .978-.261 1.87-.783 2.675-.522.804-1.24 1.413-2.152 1.826l1.435 3.044h1.914l-1.718-2.892c1.044-.348 1.87-1.001 2.479-1.957.609-.956.913-2.088.913-3.393 0-1.761-.522-3.175-1.566-4.24C10.675.063 9.218-.435 7.392-.435H2.61v18.588h1.914V4.217h4.824zm7.087 14.371c-.87 0-1.631-.261-2.283-.783-.652-.522-.978-1.196-.978-2.022 0-.652.196-1.24.588-1.762.391-.522.913-.891 1.566-1.109l2.152-.652c.587-.174.891-.435.891-.783 0-.391-.174-.696-.522-.913-.348-.217-.826-.326-1.435-.326-.739 0-1.37.196-1.892.588-.522.391-.783.956-.783 1.696h-1.827c0-1.305.478-2.37 1.435-3.196.956-.826 2.24-1.24 3.85-1.24 1.435 0 2.588.304 3.458.913.87.609 1.305 1.479 1.305 2.61v6.697c0 .391.043.739.13 1.044.087.304.239.565.457.783v.109c-.391.174-.783.261-1.175.261-.652 0-1.131-.239-1.435-.717-.087-.13-.152-.304-.196-.522-.609.478-1.283.804-2.022.978-.739.174-1.479.261-2.218.261zm.217-1.566c.826 0 1.566-.217 2.218-.652.652-.435.978-1.001.978-1.696v-.978c-.174.087-.391.174-.652.261l-1.305.391c-.739.217-1.283.478-1.631.783-.348.304-.522.652-.522 1.044 0 .435.174.783.522 1.044.348.261.826.391 1.435.391zm-1.566 1.305z"
                fill="#FF9900"
              />
            </svg>
            Amazon
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Already have an account? Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export const AuthModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="p-4 pt-2">
            <LoginForm
              onSuccess={() => setIsOpen(false)}
              onSwitchToSignup={() => setActiveTab('signup')}
            />
          </TabsContent>
          
          <TabsContent value="signup" className="p-4 pt-2">
            <SignupForm
              onSuccess={() => setIsOpen(false)}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};