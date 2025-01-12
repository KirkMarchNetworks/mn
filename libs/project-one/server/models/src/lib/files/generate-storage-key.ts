import { generateFileId } from './generate-file-id';

export const generateStorageKey = (tenantId: string, userId: string) => {
  return `${tenantId}/${userId}/${generateFileId()}`;
}
