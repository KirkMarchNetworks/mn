import { ApiFile } from './api-file.decorator';
import { fileMimetypeFilter } from './models/file-mimetype-filter';
import { join } from 'path';

// Reference: https://notiz.dev/blog/type-safe-file-uploads
export function ApiImageFile(
  fileName = 'image',
  required = true,
) {
  return ApiFile(fileName, required, {
    fileFilter: fileMimetypeFilter('image'),
    dest: join(__dirname, 'temp'),
    limits: {
      // 1 MB
      fileSize: 1000000
    }
  });
}
