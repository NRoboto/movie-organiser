import { RequestHandler } from "express";
import mongoose from "mongoose";
import { isUser, List } from "../models";

export const createList: RequestHandler = async (req, res) => {
  const { isPublic = true, ids = [] } = req.body;

  if (!isUser(req.user))
    return res.status(500).send({ error: "Authentication error" });

  try {
    const list = await new List({
      createdBy: req.user._id,
      movieIds: ids.map((id: string) => ({
        id,
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
