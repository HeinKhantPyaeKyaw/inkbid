"use client";
import { useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // auto close after 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ y: 50, opacity: 0 }} // start below screen
          animate={{ y: 0, opacity: 1 }} // slide up & fade in
          exit={{ y: 50, opacity: 0 }} // slide down & fade out
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-xl shadow-lg max-w-sm">
            <FaTimesCircle className="w-6 h-6 flex-shrink-0 text-red-600" />
            <p className="font-Montserrat text-sm">{message}</p>
            <button
              onClick={onClose}
              className="ml-auto text-red-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
