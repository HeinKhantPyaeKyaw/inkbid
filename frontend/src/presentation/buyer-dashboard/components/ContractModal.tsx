import { ContractModalProps } from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import { Dialog, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  article,
  buyerName,
  onAgree,
}) => {
  if (!article) return null;

  const contractPeriod = '30 Days';
  const terms = `Buyer agrees to purchase "${article.title}" for ${
    article.highest_bid ?? 0
  } THB.
    Seller guarantees ownership transfer after full payment.
    Contract period: ${contractPeriod}.
    Both parties agree to follow InkBid’s platform rules.`;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      maxWidth="sm"
    >
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg"
        >
          <DialogTitle className="text-xl font-semibold text-center text-indigo-600 mb-4">
            InkBid Contract Agreement
          </DialogTitle>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Article Title:</strong> {article.title}
            </p>
            <p>
              <strong>Buyer:</strong> {buyerName}
            </p>
            <p>
              <strong>Seller:</strong> {article.author?.name ?? 'Unknown'}
            </p>
            <p>
              <strong>Final Price:</strong> {article.highest_bid ?? 0} THB
            </p>
            <p>
              <strong>Contract Period:</strong> {contractPeriod}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-indigo-600 mb-2">
              Terms & Conditions
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {terms}
            </p>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Disagree
            </button>
            <button
              onClick={onAgree}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Agree
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default ContractModal;
