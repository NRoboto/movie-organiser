import express from "express";
import mongoose from "mongoose";
import { NextError } from "../controllers/types";
import { ErrorDTO } from "../DTOs";
import { logger } from "../logger";

const errorIsValidationError = (
  error: any
): error is mongoose.Error.ValidationError => error.name === "ValidationError";

export const errHandler: express.ErrorRequestHandler<
  Record<string, any>,
  ErrorDTO
> = (err: NextError | mongoose.Error, _req, res, _next) => {
  logger.warn(err);

  // Mongoose validation errors
  if (errorIsValidationError(err)) {
    const errors = Object.entries(err.errors).map(
      (error) => `${error[0]} ${error[1].message}`
    );

    return res.status(400).send({ errors });
  }

  res.status((err as NextError).status ?? 500).send({ errors: [err.message] });
};
