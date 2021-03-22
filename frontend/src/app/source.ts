export interface Source {
  id: number;
  Name: string;
  RA: number;
  Dec: number;
  isObserved: boolean;
  Publications: any;
  category: string;
}

export interface SourceA {
  id: number;
  Name: string;
  RA: number;
  Dec: number;
  isObserved_uvit: boolean;
  isObserved_laxpc: boolean;
  isObserved_czti: boolean;
  isObserved_sxt: boolean;
  Publications: any;
  category: string;
  uvit:any;
  sxt:any;
  laxpc:any;
  czti:any;
}

export interface SourceB {
  id: number;
  Name: string;
  RA: number;
  Dec: number;
  category: string;
}
