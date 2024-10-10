export interface User {
  // id: string;
  userName: string;
  email: string;
  password: string;
  clienturi: string;
  token: string;
  refreshToken: string;

  cellPhone?: string;
  about?: string;
  enterpriseName?: string;
  imagePerfil?: string;
  addressCity?: string;
  addressState?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressZipCode?: string;
  addressNeighborhood?: string;
  tiktok?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
  whatsapp?: string;
  otherSocial?: string;
}
