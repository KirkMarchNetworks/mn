export interface CreateSearchQueryInterface {
  tenantId: string,
  lowerCaseQuery?: string,
  originalCaseQuery?: string,
  fileName?: string,
  vector: number[],
}
