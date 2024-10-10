export interface UpdateUserDTO {
  userName?: string;
  email?: string;
  cellPhone?: string;
  about?: string;
  enterpriseName?: string;

  imagePerfil?: string;

  // Endereço
  addressCity?: string;
  addressStreet?: string;
  addressState?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressZipCode?: string;
  addressNeighborhood?: string;

  // Redes sociais
  facebook?: string;
  youtube?: string;
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  otherSocial?: string;
}
