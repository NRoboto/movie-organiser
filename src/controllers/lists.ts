import { RequestHandler } from "express";
import mongoose from "mongoose";
import { ListCreationDTO, ListDTO, ListModificationDTO, OkDTO } from "../DTOs";
import { isUser, List, User } from "../models";
import { ListDocument, MovieIdDocument } from "../models/List";
import { ReqAuthRequestHandler, UseAuthRequestHandler } from "./types";
import { ListMapper } from "../mappers";

export const createList: ReqAuthRequestHandler<
  ListDTO,
  ListCreationDTO
> = async (req, res, next, user) => {
  const list = await ListMapper.toDatabase(req.body, user);

  if (!list) return next({ message: "Unable to create list", status: 500 });

  return res.send(ListMapper.toListDTO(list));
};

export const getList: UseAuthRequestHandler<ListDTO> = async (
  req,
  res,
  next,
  user
) => {
  const id = req.params.id;
  if (!id) return next({ message: "Invalid id", status: 400 });

  let list = await List.findById(id);
  if (list && !list.userCanView(user)) list = null;

  if (!list)
    return next({ message: `List { id: ${id} } does not exist.`, status: 404 });

  return res.send(ListMapper.toListDTO(list));
};

export const getUserLists: UseAuthRequestHandler<ListDTO[]> = async (
  req,
  res,
  next,
  user
) => {
  const username = req.params.username;
  const { itemsPerPage, page, sort } = ListMapper.toListGetDTO(req.query);

  const lists = await User.getViewableLists(
    username,
    page,
    itemsPerPage,
    sort,
    user
  );

  res.send(lists.map(ListMapper.toListDTO));
};

export const getSelfLists: ReqAuthRequestHandler<ListDTO[]> = async (
  req,
  res,
  next,
  user
) => {
  const { itemsPerPage, page, sort } = ListMapper.toListGetDTO(req.query);

  const lists = await user.getLists(page, itemsPerPage, sort, true);
  if (!lists) return next({ message: "Unable to get lists", status: 500 });

  res.send(lists.map(ListMapper.toListDTO));
};

export const updateList: ReqAuthRequestHandler<
  ListDTO,
  ListModificationDTO
> = async (req, res, next, user) => {
  const addArr = req.body.add;
  const removeArr = req.body.remove;
  // const moveArr = req.body.move;

  const list = await List.findById(req.params.id);

  if (!list || !list.createdBy.equals(user._id))
    return next({ message: "List not found", status: 404 });

  // Add ids
  const addIds =
    addArr?.map((movieId) => ({ movieId } as MovieIdDocument)) ?? [];
  addIds.forEach((id) => list.movieIds.push(id));

  // Remove ids
  list.movieIds = list.movieIds.filter(
    (id) => !removeArr?.includes(id.id)
  ) as mongoose.Types.Array<MovieIdDocument>;

  const newList = await list.save({ validateBeforeSave: true });

  res.send(ListMapper.toListDTO(newList));
};

export const deleteList: ReqAuthRequestHandler<OkDTO> = async (
  req,
  res,
  next,
  user
) => {
  const list = await List.deleteOne({
    _id: req.params.id,
    createdBy: user.id,
  });

  if (list.deletedCount === 0)
    return next({ message: "List not found", status: 404 });

  res.send({
    ok: true,
    message: "List deleted successfully",
  });
};

export const searchList: RequestHandler = async (req, res) => {};
