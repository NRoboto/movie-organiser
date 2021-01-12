import fs from "fs";
import express, { RequestHandler } from "express";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import {
  readSelf,
  readUser,
  updateUser,
  deleteUser,
  searchUser,
  signin,
  signup,
  signout,
  signoutAll,
  getMovies,
  createList,
  getList,
  getUserLists,
  getSelfLists,
  updateList,
  deleteList,
} from "./controllers";
import {
  ReqAuthRequestHandler,
  SigninRequestHandler,
  UseAuthRequestHandler,
} from "./controllers/types";
import { logger } from "./logger";

// Authentication handlers
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

// Router
export const router = express.Router();

// Users
router.post("/signup", signup);
router.post("/login", useSigninHandler(signin));
router.post(
  "/signout",
  useReqAuthHandler(signoutAll),
  useReqAuthHandler(signout)
); // If body doesn't contain { "all": true }, signout from token

router
  .route("/user")
  .get(useReqAuthHandler(readSelf))
  .patch(useReqAuthHandler(updateUser))
  .delete(useReqAuthHandler(deleteUser));

router.get("/users", searchUser);

router.get("/user/:username", useUseAuthHandler(readUser));

// Lists
router
  .route("/list")
  .get(useReqAuthHandler(getSelfLists))
  .post(useReqAuthHandler(createList));

router
  .route("/list/:id")
  .get(useUseAuthHandler(getList))
  .patch(useReqAuthHandler(updateList))
  .delete(useReqAuthHandler(deleteList));

router.get("/user/:username/list", useUseAuthHandler(getUserLists));

// Movies
router.get("/movie", getMovies);

// Docs
const swaggerDocument = YAML.parse(fs.readFileSync("swagger.yaml", "utf-8"));
router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(swaggerDocument));

// Error handling
const errHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
  logger.info(err);
  res.status(err.status ?? 500).send({ error: err.message });
};

router.use(errHandler);
