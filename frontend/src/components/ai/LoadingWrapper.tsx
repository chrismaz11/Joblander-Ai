import { ReactNode } from 'react';
import { AILoadingIndicator } from './AILoadingIndicator';

interface LoadingWrapperProps {
  loading: boolean;
  children?: ReactNode;
}

export function LoadingWrapper({ loading, children }: LoadingWrapperProps) {
  if (loading) {
    return <AILoadingIndicator />;
  }
  return <>{children}</>;
}