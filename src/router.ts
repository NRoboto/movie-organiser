import express from "express";
import passport from "passport";
import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  searchUser,
  signin,
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
router.post("/user", createUser);
router.get("/user/", searchUser, readUser); // If no search query params, searchUser will pass handling to readUser
router.get("/user/:username", readUser);
router.patch("/user", updateUser);
router.delete("/user", deleteUser);

// Authentication
router.post("/login", requireSignin, signin);

// Movies
router.get("/movie", getMovies);
