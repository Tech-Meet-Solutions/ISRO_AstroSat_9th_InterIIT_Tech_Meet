export interface Source {
  id: number;
  Name: string;
  Type: string;
  RA: number;
  Dec: number;
  GLON: number;
  GLAT: number;
  Class: string;
  isObserved_uvit: boolean;
  isObserved_sxt: boolean;
  isObserved_laxpc: boolean;
  isObserved_czti: boolean;
}

export interface SourceA {
  id: number;
  Name: string;
  Type: string;
  RA: number;
  Dec: number;
  Opt: string;
  r_Opt: string;
  r_Fx: string;
  Vmag: string;
  B_V: string;
  U_B: string;
  E_BV: string;
  r_Vmag: string;
  Fx: string;
  Range: string;
  Porb: string;
  Porb2: string;
  GLON: string;
  GLAT: string;
  Ppulse: string;
  r_Ppulse: string;
  Cat: string;
  SpType: string;
  Class: string;
  publications: any;

  uvit: any;
  sxt: any;
  laxpc: any;
  czti: any;
  refs: any;
}

export interface SourceB {
  id: number;
  Object: string;
  obsid: string;
  RA: number;
  Dec: number;
  instrument: string;
  date_time: string;
  proposal_id: string;
  target_id: string;
  observer: string;
  abstract: string;
}

export interface Paper {
  identifier: number;
  Name: string;
  Authors: string;
  Bib: string;
  Keywords: string;
  Abstract: string;
}

export interface Source_Visibility {

  vis_uvit: boolean;
  vis_laxpc: boolean;
  vis_czti: boolean;
  vis_sxt: boolean;
}

export interface Refs {

  id: String;
  bib: String;
  Name: String;
  desc: String;
}
