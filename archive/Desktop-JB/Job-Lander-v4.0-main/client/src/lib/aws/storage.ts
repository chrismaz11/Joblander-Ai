import { uploadData, downloadData, remove, list } from 'aws-amplify/storage';

// S3 Storage utilities
export const storageService = {
  // Upload file to S3
  uploadFile: async (key: string, file: File, options?: {
    level?: 'guest' | 'protected' | 'private';
    contentType?: string;
    onProgress?: (progress: { transferredBytes: number; totalBytes?: number }) => void;
  }) => {
    try {
      const result = await uploadData({
        key,
        data: file,
        options: {
          accessLevel: options?.level || 'private',
          contentType: options?.contentType || file.type,
          onProgress: options?.onProgress,
        },
      }).result;

      return {
        success: true,
        key: result.key,
        url: `https://amplify-joblanderv4-chris-joblanderstoragebucket26-hzjb92i7sfbm.s3.amazonaws.com/${result.key}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Upload failed',
      };
    }
  },

  // Upload resume file
  uploadResume: async (userId: string, file: File) => {
    const timestamp = Date.now();
    const key = `resumes/${userId}/${timestamp}-${file.name}`;
    return storageService.uploadFile(key, file, {
      contentType: file.type,
    });
  },

  // Download file from S3
  downloadFile: async (key: string, options?: {
    level?: 'guest' | 'protected' | 'private';
  }) => {
    try {
      const result = await downloadData({
        key,
        options: {
          accessLevel: options?.level || 'private',
        },
      }).result;

      return {
        success: true,
        data: result.body,
        contentType: result.contentType,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Download failed',
      };
    }
  },

  // Delete file from S3
  deleteFile: async (key: string, options?: {
    level?: 'guest' | 'protected' | 'private';
  }) => {
    try {
      await remove({
        key,
        options: {
          accessLevel: options?.level || 'private',
        },
      });

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Delete failed',
      };
    }
  },
};
