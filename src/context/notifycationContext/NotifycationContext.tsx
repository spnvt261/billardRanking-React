import React, { createContext, useContext } from "react";
import type { NotificationType } from "../../components/nofitication/Notification";
import NotificationContainer from "../../components/nofitication/Notification";

export interface NotificationContextType {
    notify: (message: string, type: NotificationType, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const notify = (message: string, type: NotificationType, duration = 3000) => {
        const event = new CustomEvent("ADD_NOTIFICATION", { detail: { message, type, duration } });
        window.dispatchEvent(event);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
    return ctx;
};
