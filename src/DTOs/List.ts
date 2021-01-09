export interface MovieIdDTO {
  listEntryId: string;
  movieId: string;
  createdAt: string;
}

export interface ListCreationDTO {
  movieIds: string[];
  isPublic: boolean;
}

export interface ListDTO {
  listId: string;
  createdBy: string;
  movieIds: MovieIdDTO[];
  isPublic: boolean;
  // createdAt: string;
}

export interface ListModificationDTO {
  add: string[];
  remove: string[];
}
