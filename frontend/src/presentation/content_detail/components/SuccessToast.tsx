"use client";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessToastProps {
  message: string;
  onClose: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-xl shadow-lg max-w-sm">
            <FaCheckCircle className="w-6 h-6 flex-shrink-0 text-green-600" />
            <p className="font-Montserrat text-sm">{message}</p>
            <button
              onClick={onClose}
              className="ml-auto text-green-600 hover:text-green-800 font-bold"
            >
              ✕
            </button>
          </div>
        </motion.div>
    
    </AnimatePresence>
  );
};
