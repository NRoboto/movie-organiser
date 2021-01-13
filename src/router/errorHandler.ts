import express from "express";
import { logger } from "../logger";

export const errHandler: express.ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  logger.warn(err);
  res.status(err.status ?? 500).send({ error: err.message });
};
