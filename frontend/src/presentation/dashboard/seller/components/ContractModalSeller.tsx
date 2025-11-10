import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Paper,
} from "@mui/material";

type Author = { _id: string; name: string };
type Winner = { _id: string; name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  article: {
    _id: string;
    title: string;
    highest_bid?: number; 
    current_bid?: number;
    author: Author;
    winner?: Winner | null;
  } | null;
  onAgree: () => void;
  signing?: boolean;
};

const ContractModalSeller: React.FC<Props> = ({
  isOpen,
  onClose,
  article,
  onAgree,
  signing = false,
}) => {
  if (!article) return null;

  const buyerName = article.winner?.name || "Buyer";
  const sellerName = article.author?.name || "Seller";
  const title = article.title;
  const price = article.highest_bid ?? article.current_bid ?? 0;

  const terms = `
1. **Parties Involved**
   This Contract is entered into between **${buyerName}** (“Buyer”) and **${sellerName}** (“Seller”) through the InkBid platform, operated by InkBid Technologies.

2. **Scope of Agreement**
   The Seller agrees to transfer to the Buyer the right to publicly use, display, and distribute the article titled **"${title}"** following successful payment via the InkBid platform.

3. **Ownership and Rights**
   - The Seller retains full ownership of the article at all times.
   - The Buyer is licensed to publicly use and display the article under the terms of this agreement.
   - The Buyer may **not** resell, sublicense, or modify the article for profit without the Seller’s explicit written consent.

4. **Payment Terms**
   The Buyer agrees to pay **${price} THB** to the Seller through the InkBid platform.
   Payment must be completed within five (5) business days after both parties have signed this agreement.
   The platform may temporarily withhold payment for verification and fraud prevention.

5. **Delivery and Access**
   The Seller must ensure the article is accessible in its original form and shall not alter or delete its contents after the Buyer has obtained access through the platform.

6. **Exclusivity and Parallel Use**
   - This license is **exclusive**; the Seller may not license the article to others unless a separate written exclusivity agreement is made.
   - The Seller must not misrepresent the article’s availability or licensing status.

7. **Confidentiality**
   Both parties agree not to disclose personal, payment, or platform-related information shared in the course of this transaction.

8. **Breach of Contract**
   - If the Buyer fails to complete payment, the contract is void.
   - If the Seller reuses or resells the article during the active period, InkBid reserves the right to penalize or suspend the Seller’s account.
   - InkBid is not liable for any dispute arising outside its platform.

9. **Termination**
   Either party may request early termination via the InkBid platform, subject to mutual written consent. Refunds may be issued only if both parties agree.

10. **Governing Law**
   This Agreement shall be governed by and construed in accordance with the applicable laws under which InkBid operates.

11. **Acknowledgement**
   By signing, both parties confirm that they have read and understood all terms and conditions stated herein and agree to be legally bound by them.
`;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, overflow: "hidden" },
      }}
    >
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: 700, color: "#4F46E5" }}
      >
        InkBid Contract Agreement
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            <b>Article Title:</b> {title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Buyer:</b> {buyerName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Seller:</b> {sellerName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Final Price:</b> ฿{price} THB
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#4F46E5", mb: 1 }}
        >
          Terms & Conditions
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            maxHeight: 240,
            overflowY: "auto",
            p: 2,
            backgroundColor: "#FAFAFA",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-line", color: "#333" }}
          >
            {terms}
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Disagree
        </Button>
        <Button
          onClick={onAgree}
          variant="contained"
          color="primary"
          disabled={signing}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          {signing ? "Signing..." : "Agree"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractModalSeller;
