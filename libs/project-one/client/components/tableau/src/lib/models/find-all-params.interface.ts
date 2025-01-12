export interface FindAllParamsInterface {
  take?: number;
  skip?: number;
  sort?: string;
  search?: string;
  [ key: string ]: string|number|undefined;
}
