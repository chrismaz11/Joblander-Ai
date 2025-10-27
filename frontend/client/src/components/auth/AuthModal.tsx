import { useState } from 'react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'confirm'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn({ username: email, password });
      onClose();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp({ username: email, password });
      setMode('confirm');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode });
      await signIn({ username: email, password });
      onClose();
    } catch (error) {
      console.error('Confirmation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Confirm Account'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={mode === 'signin' ? handleSignIn : mode === 'signup' ? handleSignUp : handleConfirm}>
          <div className="space-y-4">
            {mode !== 'confirm' && (
              <>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            {mode === 'confirm' && (
              <div>
                <Label htmlFor="code">Confirmation Code</Label>
                <Input
                  id="code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Confirm'}
            </Button>
            
            {mode === 'signin' && (
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode('signup')}>
                Need an account? Sign Up
              </Button>
            )}
            
            {mode === 'signup' && (
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode('signin')}>
                Have an account? Sign In
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
