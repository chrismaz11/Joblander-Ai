import { Theme } from '@aws-amplify/ui-react';

export const jobLanderAmplifyTheme: Theme = {
  name: 'job-lander-professional',
  tokens: {
    colors: {
      brand: {
        primary: { 80: '#2563eb' },  // Professional blue
        secondary: { 80: '#7c3aed' } // AI purple accent
      },
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc'
      },
      font: {
        primary: '#1e293b',
        secondary: '#64748b'
      }
    },
    space: {
      large: '2rem',
      xl: '3rem'
    },
    fonts: {
      default: {
        variable: 'Inter, system-ui, sans-serif',
        static: 'Inter, system-ui, sans-serif'
      }
    },
    fontSizes: {
      medium: '1rem',
      large: '1.125rem',
      xl: '1.25rem'
    },
    radii: {
      small: '0.375rem',
      medium: '0.5rem',
      large: '0.75rem'
    }
  }
};

export default jobLanderAmplifyTheme;