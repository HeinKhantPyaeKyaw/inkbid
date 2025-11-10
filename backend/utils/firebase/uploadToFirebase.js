import { admin } from '../../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadPDFToFirebase = async (pdfBuffer, fileName) => {
  try {
    const bucket = admin.storage().bucket();

    const uniqueId = uuidv4();
    const filePath = `contracts/${fileName}-${uniqueId}.pdf`;

    const file = bucket.file(filePath);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
      },
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    console.log(`Uploaded contract PDF to Firebase: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF to Firebase: ', error);
    throw new Error('Failed to upload contract PDF to Firebase.');
  }
};
