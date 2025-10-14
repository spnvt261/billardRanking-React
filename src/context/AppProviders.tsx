// src/contexts/AppProviders.tsx
import React, { type ReactNode } from 'react';
import { NotificationProvider } from './notifycationContext/NotifycationContext';
import { WorkspaceProvider } from './workspaceContext/WorkspaceContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
        <NotificationProvider>
            <WorkspaceProvider>
                {children}
            </WorkspaceProvider>
        </NotificationProvider>    
      );
};
