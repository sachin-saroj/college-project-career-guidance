import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../../../config/env';
import streamifier from 'streamifier';
import multer from 'multer';
import { AppError } from '../../../utils/AppError';

// Configure Cloudinary
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: ENV.CLOUDINARY_API_KEY || 'demo',
  api_secret: ENV.CLOUDINARY_API_SECRET || 'demo',
});

// Configure Multer (Memory Storage)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400));
    }
  },
});

export class UploadService {
  /**
   * Uploads a buffer stream to Cloudinary
   */
  static async uploadImageBuffer(fileBuffer: Buffer, folder: string = 'avatars'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          format: 'webp',
          transformation: [{ width: 250, height: 250, crop: 'fill', gravity: 'face' }],
        },
        (error, result) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Deletes an image from Cloudinary by extracting the public ID from the URL
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from secure URL
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split('.')[0];
      const folderPath = urlParts[urlParts.length - 2];

      await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary', error);
      // We don't throw here to prevent blocking the user's workflow if Cloudinary fails
    }
  }
}
