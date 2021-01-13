import { RequestHandler } from "express";
import passport from "passport";
import {
  ReqAuthRequestHandler,
  SigninRequestHandler,
  UseAuthRequestHandler,
} from "../controllers/types";

export const useReqAuthHandler = (
  handler: ReqAuthRequestHandler
): RequestHandler => async (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error, user, info) => {
      if (error) return next(error);
      if (!user) return next({ message: "Authentication failed", status: 401 });

      try {
        await handler(req, res, next, user);
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

export const useUseAuthHandler = (
  handler: UseAuthRequestHandler
): RequestHandler => async (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error, user, info) => {
      if (error) return next(error);

      try {
        await handler(req, res, next, user);
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

export const useSigninHandler = (
  handler: SigninRequestHandler
): RequestHandler => async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (error, user, info) => {
      if (error) return next(error);
      if (!user) return next({ message: "Authentication failed", status: 401 });

      try {
        await handler(req, res, next, user);
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};
