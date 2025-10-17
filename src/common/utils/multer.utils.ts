import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';

interface MulterOptions {
  path?: string;
  allowFileTypes: string[];
  maxFileSize?: number;
}

export const UploadFileOptions = ({
  path = 'general',
  allowFileTypes,
  maxFileSize,
}: MulterOptions) => {
  const storage = diskStorage({
    destination(req, file, callback) {
      const destinationPath = `/tmp/uploads/${path}`;
      callback(null, destinationPath);
    },
    filename(req, file, callback) {
      const filename = `${Date.now()}-${file.originalname}`;
      callback(null, filename);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: Function,
  ) => {
    if (allowFileTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Invalid file type'), false);
    }
  };

  return {
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter,
    storage,
  };
};