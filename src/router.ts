import express from "express";
import passport from "passport";
import {
  readSelf,
  readUser,
  updateUser,
  deleteUser,
  searchUser,
  signin,
  signup,
  getMovies,
  createList,
  getList,
} from "./controllers";

// useAuth provides req.user if a token is provided, otherwise req.user is undefined
const useAuth: express.RequestHandler = (req, res, next) =>
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return next();
      req.user = user;
      next();
    }
  )(req, res, next);

const requireAuth = passport.authenticate("jwt", {
  session: false,
});

const requireSignin = passport.authenticate("local", {
  session: false,
});

export const router = express.Router();

// Users
router.post("/signup", signup, signin);
router.post("/login", requireSignin, signin);
router.get("/user/", searchUser, requireAuth, readSelf); // If no search query params, searchUser will pass handling to readUser
router.get("/user/:username", useAuth, readUser);
router.patch("/user", requireAuth, updateUser);
router.delete("/user", requireAuth, deleteUser);

// Lists
router.post("/list", requireAuth, createList);
router.get("/list/:id", useAuth, getList);

// Movies
router.get("/movie", getMovies);
