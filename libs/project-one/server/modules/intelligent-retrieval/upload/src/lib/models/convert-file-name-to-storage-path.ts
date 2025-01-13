export const convertFileNameToStoragePath = (
  tenantId: string,
  fileName: string
) => {
  return `${tenantId}/${fileName}`;
};
