import { ListCreationDTO, ListDTO, ListGetDTO, MovieIdDTO } from "../DTOs";
import { List, ListDocument, MovieIdDocument, UserDocument } from "../models";

export abstract class ListMapper {
  public static toMovieIdDTO(movieId: MovieIdDocument): MovieIdDTO {
    return {
      listEntryId: movieId.id,
      movieId: movieId.movieId,
      createdAt: movieId.createdAt!,
    };
  }

  public static toListDTO(list: ListDocument): ListDTO {
    return {
      listId: list.id,
      createdBy: list.createdBy.toHexString(),
      movieIds: list.movieIds.map(ListMapper.toMovieIdDTO),
      isPublic: list.isPublic,
    };
  }

  public static toListGetDTO(query: Record<string, any>): ListGetDTO {
    const itemsPerPage = query.itemCount ? parseInt(query.itemCount, 10) : 5;
    const page = typeof query.page === "string" ? parseInt(query.page, 10) : 0;

    const sort: { [key: string]: any } = {};
    if (typeof query.sort === "string") {
      const [sortBy, order] = query.sort.split("_");
      sort[sortBy] = order === "asc" ? 1 : -1;
    }

    return { itemsPerPage, page, sort };
  }

  public static async toDatabase(
    raw: ListCreationDTO,
    owner: UserDocument
  ): Promise<ListDocument> {
    return await new List({
      createdBy: owner.id,
      movieIds: raw.movieIds?.map((id) => ({
        movieId: id,
      })),
      isPublic: raw.isPublic,
    }).save();
  }
}
