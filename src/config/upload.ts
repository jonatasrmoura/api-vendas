import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const uploadFolter = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  directory: uploadFolter,
  storage: multer.diskStorage({
    destination: uploadFolter,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');

      const filename = `${fileHash}-${file.originalname}`;

      callback(null, filename);
    },
  }),
};
