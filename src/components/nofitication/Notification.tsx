import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
  AiOutlineCloseCircle,
} from "react-icons/ai";

type NotificationType = "success" | "error" | "loading";

interface NotificationProps {
  message: string;
  type: NotificationType;
  duration?: number;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  duration = 2800,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const value = Math.min((elapsed / duration) * 100, 100);
      setProgress(value);

      if (elapsed >= duration) {
        clearInterval(interval);
        setVisible(false); 
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);


  const handleExitComplete = () => {
    onClose?.();
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <AiOutlineCheckCircle className="w-6 h-6 text-green-300" />;
      case "error":
        return <AiOutlineCloseCircle className="w-6 h-6 text-red-300" />;
      case "loading":
        return (
          <AiOutlineLoading3Quarters className="w-6 h-6 text-blue-300 animate-spin" />
        );
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case "success":
        return "bg-green-400";
      case "error":
        return "bg-red-400";
      case "loading":
        return "bg-blue-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="notification"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-5 inset-x-0 z-50 flex justify-center"
        >
          <div className="w-[300px] sm:w-[400px] relative flex items-center space-x-3 px-4 py-3 rounded-md shadow-md text-gray-100 overflow-hidden bg-gray-600">
            {getIcon()}
            <span className="flex-1">{message}</span>
            <button
              onClick={() => setVisible(false)}
              className="ml-2 text-gray-300 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="absolute bottom-0 left-[-1rem] h-[3px] w-[110%] bg-white/10">
              <div
                className={`h-full transition-[width] duration-200 ease-linear ${getProgressColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
