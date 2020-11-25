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
} from "./controllers";

const requireAuth = passport.authenticate("jwt", {
  session: false,
});
const requireSignin = passport.authenticate("local", {
  session: false,
});

export const router = express.Router();

// Users
router.get("/user/", searchUser, requireAuth, readSelf); // If no search query params, searchUser will pass handling to readUser
router.get("/user/:username", readUser);
router.patch("/user", requireAuth, updateUser);
router.delete("/user", requireAuth, deleteUser);

// Authentication
router.post("/login", requireSignin, signin);
router.post("/signup", signup, signin);

// Movies
router.get("/movie", getMovies);
