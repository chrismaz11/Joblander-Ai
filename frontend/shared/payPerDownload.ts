// Pay-Per-Download Configuration
export const PAY_PER_DOWNLOAD = {
  price: 295, // $2.95 in cents
  currency: 'USD',
  description: 'One-time download fee',
  formats: ['PDF', 'DOCX'],
  validityHours: 24, // Download link valid for 24 hours
};

export interface DownloadPayment {
  id: string;
  userId: string;
  documentId: string;
  documentType: 'resume' | 'cover_letter';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt: Date;
  createdAt: Date;
}

export function formatDownloadPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

export function createDownloadPaymentIntent(documentId: string, documentType: 'resume' | 'cover_letter') {
  return {
    amount: PAY_PER_DOWNLOAD.price,
    currency: PAY_PER_DOWNLOAD.currency,
    metadata: {
      documentId,
      documentType,
      type: 'download'
    }
  };
}