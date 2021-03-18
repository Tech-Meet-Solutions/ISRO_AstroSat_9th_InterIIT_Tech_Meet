export interface Source {
  pk: number;
  Name: string;
  RA: number;
  Dec: number;
  isObserved: boolean;
  Publications: Array<number>;
  category: string;
}
