import { DbSearchDataType } from '../models/db-search-data-type';

// Found this here
// https://www.typescriptlang.org/play/?ssl=28&ssc=74&pln=1&pc=1#code/C4TwDgpgBAIgKgeSgXigJQgYwPYCcAmAPAM7C4CWAdgOYA0UAhpSAHwDcAsAFCiRQAy5YBFwMANnHDRUpCjSgAfKJQCuAWwBGIxVA3ZsYiEx0by1KsE5duvaAHEIwGOVyh4CANIQQxQkggAHsKU+MSwiCwoUADe3FBQANoeUFRQANbe2ABmUAgAugC0APwAXFAActiU5SpiYgwahn5JeZGBwaFQAIK4oiCEVFnaXSxx8VBFFVU1dQ1NI1DtECFhgsKiElJj4xNQHtvjZclLK1CyVNQHO5MOTi5uiF4+hJXVtfWNEIQjbUHLnYNtOV9lwdmDdsDFn9TucaFdwbsAAYAEmiHgAvgA6VHA9GI+HgsqUCAANxEBMOylJ5NBCKJ1NwBzKrxmHyaCBavw6qyEInEkkg8MmIMJeyh3LOZAuFJujmcrhA7ievhZ7zmXw5HlaXP+YUBuAqIoR8UmkJOnVhl1pxpNUBRaKxOIx+OtNvpZMZrtFxI9FPdNPRCQyIGyuTyVls3TqSu8YRkUvkSlUmm0SmIIE0BgjUigcFExAAFjGfFF7ZasSoQhAslQIPhETpk1oDWmM3oxNm+ABRAKYMQqfAQPMMQvF3z+aGdLrRx6xyKoCcS4ej2clyY+7RlBCd+xy1fj8W68IIedQHt9gdD-NF-eEW7yh6eWN+FjsbjcAD0H6hDDAhmI748DmCAaAAVgK0gxGMDAAIylMo6jNrQ0EAEzwbEroaDBZSWshmFoWUGHgpg2G6PohhMPCmAoYRFL4KRTYiHhxr4DRZEGEYlDMWC6LcfEvEHBoADMtFelAJHwXoHGUWJ1HoXRDGIUxdFsVJFFcfCAmulp-HcQwImSnIdDcOiO65GBypRPet4geBUhvlwOCUKQUDYBZsakbZlmoAA5AwKGYsJmLUZirE+VYTkuW5oHKmxXmxlEfkweFgGRrZEEAOpCAWPR9FERGMHBRJKbgCR5HpBFQZhpG4YJlUFTsJFlGpnFUWxDVgvRxUprgfGdap5GcX1ukHIG5WCQZHXxBJzWDTJxH1Qp3VISps3SRpYljcN4lCfJYnxF1CE9dtB0Det206eMW1jNdtL6ThCbGVwpk2MBYFZcAOW9AwIDeVA1lPs86VSB9X19A5kXAK573ZblyqeTDn25T9f1+QFWEpY5VRRYjYOxVuuPI79CW+f5gXJWwQA
type DTO = Record<string, any>;
type LiteralType = string | number | boolean | bigint;

type GetDirtyDTOKeys<O extends DTO> = {
  [K in keyof O]-?: NonNullable<O[K]> extends Array<infer A>
    ? NonNullable<A> extends LiteralType
      ? K
      : K extends string
        ? GetDirtyDTOKeys<NonNullable<A>> extends infer NK
          ? NK extends string
            ? `${K}.${NK}`
            : never
          : never
        : never
    : NonNullable<O[K]> extends LiteralType
      ? K
      : K extends string
        ? GetDirtyDTOKeys<NonNullable<O[K]>> extends infer NK
          ? NK extends string
            ? `${K}.${NK}`
            : never
          : never
        : never
}[keyof O];
type AllDTOKeys = string | number | symbol;
type TrashDTOKeys = `${string}.undefined` | number | symbol;
type ExcludeTrashDTOKeys<O extends AllDTOKeys> = O extends TrashDTOKeys ? never : O;
type GetDTOKeys<O extends DTO> = ExcludeTrashDTOKeys<GetDirtyDTOKeys<O>>;

export interface SearchValueInterface {
  displayName: string;
  dbType: DbSearchDataType;
}

export interface SortValueInterface {
  displayName: string;
}

export interface SortSearchInterface<T extends object> {
  sort: Partial<Record<GetDTOKeys<T>, Required<SortValueInterface>>>;
  search: Partial<Record<GetDTOKeys<T>, SearchValueInterface>>;
}
