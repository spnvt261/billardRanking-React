// src/contexts/Notification/NotificationContext.tsx
import React, { createContext, useState, type ReactNode } from 'react';
import Notification from '../../components/nofitication/Notification';

export type NotificationType = 'success' | 'error' | 'loading';

export interface NotificationData {
    message: string;
    type: NotificationType;
    id: number;
}

export interface NotificationContextType {
    notify: (message: string, type: NotificationType, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let idCounter = 0;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    // const notify = (message: string, type: NotificationType, duration = 3000) => {
    //     setNotifications((prev) => {
    //         if (prev.length > 0) return prev;
    //         const id = idCounter++;
    //         const newNotification = { message, type, id };

    //         setTimeout(() => {
    //             setNotifications((prev) => prev.filter((n) => n.id !== id));
    //         }, duration);

    //         return [...prev, newNotification];
    //     });
    // };
    const notify = (message: string, type: NotificationType, duration = 3000) => {
        const id = idCounter++; // tạo id duy nhất cho mỗi notification
        const newNotification = { message, type, id };

        setNotifications((prev) => [...prev, newNotification]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            {notifications.map((n) => (
                <Notification
                    key={n.id}
                    message={n.message}
                    type={n.type}
                    onClose={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
                />
            ))}
        </NotificationContext.Provider>
    );
};
