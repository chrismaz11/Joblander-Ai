import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, CreditCard, Calendar, AlertCircle } from 'lucide-react';

interface Subscription {
  id: string;
  status: string;
  tier: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export function BillingDashboard() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id })
      });

      if (response.ok) {
        await fetchSubscription();
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  const tierColors = {
    free: 'bg-gray-100 text-gray-800',
    basic: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Manage your Job-Lander subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge className={tierColors[user?.tier || 'free']}>
                {user?.tier?.charAt(0).toUpperCase() + user?.tier?.slice(1)} Plan
              </Badge>
              {subscription && (
                <p className="text-sm text-gray-600 mt-1">
                  Status: {subscription.status}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm">
              Upgrade Plan
            </Button>
          </div>

          {subscription && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Update Payment Method
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Download Invoices
          </Button>
          {subscription && !subscription.cancelAtPeriodEnd && (
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
