// src/contexts/Notification/useNotification.ts
import { useContext } from 'react';
import { NotificationContext, type NotificationContextType } from '../context/notifycationContext/NotifycationContext';

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within a NotificationProvider');
    return context;
};
