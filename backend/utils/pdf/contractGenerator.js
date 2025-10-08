import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generateContractPDF = async (contractData) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 Size

  // Embed a standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text, x, y, size = 12, color = rgb(0, 0, 0)) => {
    page.drawText(text, { x, y, size, font, color });
  };

  // Add title
  drawText('INKBID CONTRACT AGGREMENT', 150, 800, 18, rgb(0.2, 0.2, 0.6));

  const yStart = 760;
  const lineGap = 20;

  // Add Contract Details section
  const details = [
    `Article Title: ${contractData.articleTitle}`,
    `Buyer Name: ${contractData.buyerName}`,
    `Seller Name: ${contractData.authorName}`,
    `Final Price: ${Number(contractData.finalPrice)} THB`,
    `Contract Period: ${contractData.contractPeriod}`,
    `Agreement Date: ${new Date(
      contractData.agreementDate,
    ).toLocaleDateString()}`,
    contractData.purchasedDate
      ? `Purchased Date: ${new Date(contractData.purchasedDate).toDateString()}`
      : null,
  ].filter(Boolean);

  details.forEach((line, index) => {
    drawText(line, 60, yStart - index * lineGap);
  });

  // Add Terms & Conditions Sections
  const terms =
    contractData.terms ||
    'This agreement binds both parties under InkBid regulations.';
  const wrappedTerms = terms.match(/.{1,80}/g) || [];
  const termsStartY = yStart - details.length * lineGap - 40;

  drawText('Terms & Conditions: ', 60, termsStartY, 14, rgb(0.2, 0.2, 0.6));

  wrappedTerms.forEach((line, i) => {
    drawText(line.trim(), 60, termsStartY - (i + 1) * 16);
  });

  // ? Signature placeholder might be implemented later

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
