import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (req: any, file: any, callback: any) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const ext = extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
      ),
      false,
    );
  }
};

export const videoFileFilter = (req: any, file: any, callback: any) => {
  const allowedMimeTypes = ['video/mp4', 'video/webm'];
  const allowedExtensions = ['.mp4', '.webm'];

  const ext = extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestException(
        'Invalid file type. Only MP4 and WebM videos are allowed.',
      ),
      false,
    );
  }
};
