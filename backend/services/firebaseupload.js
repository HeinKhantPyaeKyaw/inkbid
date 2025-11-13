import { bucket } from '../config/firebase.js';

export const uploadFileToFirebase = async (file, folder) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
    });
    stream.on('error', (err) => reject(err));

    stream.on('finish', async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
};

export const uploadProfilePicture = async (file) => {
  return uploadFileToFirebase(file, 'profiles');
};
