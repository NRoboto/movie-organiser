import { RequestHandler } from "express";
import mongoose from "mongoose";
import { isUser, List, User } from "../models";
import { ListDocument, MovieIdDocument } from "../models/List";

export const createList: RequestHandler = async (req, res) => {
  const { isPublic = true, ids = [] } = req.body;

  if (!isUser(req.user))
    return res.status(500).send({ error: "Authentication error" });

  try {
    const list = await new List({
      createdBy: req.user._id,
      movieIds: ids.map((id: string) => ({
        movieId: id,
      })),
      isPublic,
    }).save();

    return res.send({ list });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

export const getList: RequestHandler = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ error: "Invalid id" });

  try {
    let list = await List.findById(id);

    if (list && !list.userCanView(req.user)) list = null;

    if (!list)
      return res
        .status(404)
        .send({ error: `List { id: ${id} } does not exist.` });

    res.send(list);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

export const getUserLists: RequestHandler = async (req, res) => {
  const username = req.params.username;

  try {
    const itemsPerPage = 5;
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 0;
    const sort: { [key: string]: any } = {};

    if (typeof req.query.sort === "string") {
      const [sortBy, order] = req.query.sort.split("_");
      sort[sortBy] = order === "asc" ? 1 : -1;
    }

    const lists = await User.getViewableLists(
      username,
      page,
      itemsPerPage,
      sort,
      isUser(req.user) ? req.user : undefined
    );

    res.send({ lists });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

export const getSelfLists: RequestHandler = async (req, res) => {
  if (!isUser(req.user))
    return res.status(500).send({ error: "Authentication error" });

  try {
    const itemsPerPage = 5;
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 0;
    const sort: { [key: string]: any } = {};

    if (typeof req.query.sort === "string") {
      const [sortBy, order] = req.query.sort.split("_");
      sort[sortBy] = order === "asc" ? 1 : -1;
    }

    const lists = await req.user.getLists(page, itemsPerPage, sort, true);

    if (!lists) res.status(500).send({ error: "Unable to get lists" });

    console.log("lists", lists);

    res.send({ lists });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

export const updateList: RequestHandler = async (req, res) => {
  const addArr: string[] | undefined = req.body.add;
  const removeArr: string[] | undefined = req.body.remove;
  // const moveArr: string[] | undefined = req.body.move;

  try {
    const list = await List.findById(req.params.id);

    if (!list) return res.status(404).send({ error: "List not found" });

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
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};
