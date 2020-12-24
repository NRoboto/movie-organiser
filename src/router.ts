import express, { RequestHandler } from "express";
import passport from "passport";
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
router.post("/list", useReqAuthHandler(createList));
router.get("/list/:id", useUseAuthHandler(getList));
router.get("/user/:username/list", useUseAuthHandler(getUserLists));
router.get("/list", useReqAuthHandler(getSelfLists));
router.patch("/list/:id", useReqAuthHandler(updateList));
router.delete("/list/:id", useReqAuthHandler(deleteList));

// Movies
router.get("/movie", getMovies);

// Error handling
const errHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
  res.status(err.status ?? 500).send({ error: err.message });
};

router.use(errHandler);
