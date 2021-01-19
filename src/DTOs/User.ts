export interface RegisterDTO {
  username: string;
  password: string;
  gender?: string;
  age?: number;
  location?: string;
}

export interface TokenDTO {
  token: string;
  createdAt: string;
}

export interface SigninDTO {
  username: string;
  token: string;
}

export interface PublicProfileDTO {
  username: string;
  displayName: string;
  gender?: string;
  age?: number;
  location?: string;
  createdAt: string;
  isSelf: boolean;
}

export interface PrivateProfileDTO extends PublicProfileDTO {
  tokens: TokenDTO[];
  isSelf: true;
}

export type ProfileDTO = PublicProfileDTO | PrivateProfileDTO;
