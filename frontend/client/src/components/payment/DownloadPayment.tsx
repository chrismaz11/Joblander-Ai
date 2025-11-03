import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface DownloadPaymentProps {
  documentId: string;
  documentType: 'resume' | 'cover_letter';
  onSuccess: (downloadUrl: string) => void;
  onCancel: () => void;
}

function DownloadPaymentInner({ documentId, documentType, onSuccess, onCancel }: DownloadPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const initializePayment = async () => {
    try {
      const response = await fetch('/api/payments/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, documentType }),
      });
      
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement }
    });

    if (error) {
      console.error('Payment failed:', error);
    } else if (paymentIntent?.status === 'succeeded') {
      // Get download URL from backend
      const response = await fetch(`/api/downloads/${paymentIntent.id}`);
      const { downloadUrl } = await response.json();
      onSuccess(downloadUrl);
    }

    setLoading(false);
  };

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download for $2.95
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pay once to download your {documentType === 'resume' ? 'resume' : 'cover letter'} as PDF.
          </p>
          <div className="flex gap-2">
            <Button onClick={initializePayment} className="flex-1">
              Continue to Payment
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Pay $2.95 to Download</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                },
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={!stripe || loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Pay $2.95'}
            </Button>
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function DownloadPayment(props: DownloadPaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <DownloadPaymentInner {...props} />
    </Elements>
  );
}