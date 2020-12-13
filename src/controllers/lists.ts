import { RequestHandler } from "express";
import mongoose from "mongoose";
import { isUser, List, User } from "../models";
import { ListDocument, MovieIdDocument } from "../models/List";
import { ReqAuthRequestHandler, UseAuthRequestHandler } from "./types";

export const createList: ReqAuthRequestHandler = async (
  req,
  res,
  next,
  user
) => {
  const { isPublic = true, ids = [] } = req.body;

  const list = await new List({
    createdBy: user._id,
    movieIds: ids.map((id: string) => ({
      movieId: id,
    })),
    isPublic,
  }).save();

  if (!list) return next({ message: "Unable to create list", status: 500 });

  return res.send({ list });
};

export const getList: UseAuthRequestHandler = async (req, res, next, user) => {
  const id = req.params.id;
  if (!id) return next({ message: "Invalid id", status: 400 });

  let list = await List.findById(id);
  if (list && !list.userCanView(user)) list = null;

  if (!list)
    return next({ message: `List { id: ${id} } does not exist.`, status: 404 });

  res.send(list);
};

const parseGetListQuery = (query: Record<string, any>) => {
  const itemsPerPage = 5;
  const page = typeof query.page === "string" ? parseInt(query.page) : 0;

  const sort: { [key: string]: any } = {};
  if (typeof query.sort === "string") {
    const [sortBy, order] = query.sort.split("_");
    sort[sortBy] = order === "asc" ? 1 : -1;
  }

  return { itemsPerPage, page, sort };
};

export const getUserLists: UseAuthRequestHandler = async (
  req,
  res,
  next,
  user
) => {
  const username = req.params.username;
  const { itemsPerPage, page, sort } = parseGetListQuery(req.query);

  const lists = await User.getViewableLists(
    username,
    page,
    itemsPerPage,
    sort,
    user
  );

  res.send({ lists });
};

export const getSelfLists: ReqAuthRequestHandler = async (
  req,
  res,
  next,
  user
) => {
  const { itemsPerPage, page, sort } = parseGetListQuery(req.query);

  const lists = await user.getLists(page, itemsPerPage, sort, true);
  if (!lists) return next({ message: "Unable to get lists", status: 500 });

  res.send({ lists });
};

export const updateList: ReqAuthRequestHandler = async (
  req,
  res,
  next,
  user
) => {
  const addArr: string[] | undefined = req.body.add;
  const removeArr: string[] | undefined = req.body.remove;
  // const moveArr: string[] | undefined = req.body.move;

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

  res.send({ list: newList });
};

export const deleteList: ReqAuthRequestHandler = async (
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

  res.send(list);
};
