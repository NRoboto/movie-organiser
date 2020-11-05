import { RequestHandler } from "express";
import { omdbRequest } from "../utils/omdb";

export const getMovies: RequestHandler = async (req, res) => {
  try {
    const data = await omdbRequest(req.query as Record<string, string>);
    res.send(data);
  } catch (err) {
    res.status(500).send({ error: err.toString() });
  }
};
