import { Injectable } from '@nestjs/common';
import { CloudinaryConfig } from '../config';
import { UploadApiOptions } from 'cloudinary';

@Injectable()
export class UploadService {
  private cloudinary = CloudinaryConfig();

  async uploadFile(file: string, options?: UploadApiOptions) {
    const data = await this.cloudinary.uploader.upload(file, options);

    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  }

  async uploadFiles(files: string[], options?: UploadApiOptions) {
    let images: object[] = [];

    for (const file of files) {
      const data = await this.uploadFile(file, options);
      images.push({ secure_url: data.secure_url, public_id: data.public_id });
    }

    return images;
  }

  async deleteFileByPublicId(public_id: string) {
    return await this.cloudinary.uploader.destroy(public_id);
  }

  async deleteFolderByPrefix(prefix: string) {
    await this.cloudinary.api.delete_resources_by_prefix(prefix);
    await this.cloudinary.api.delete_folder(prefix);
  }
}
