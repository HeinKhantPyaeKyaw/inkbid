import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'inkbid-95cc3.firebasestorage.app',
  });
}

const bucket = getStorage().bucket();
export { admin, bucket };
