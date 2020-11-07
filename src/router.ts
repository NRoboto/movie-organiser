import express from "express";
import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  searchUser,
  getMovies,
} from "./controllers";

export const router = express.Router();

// Users
router.post("/user", createUser);
router.get("/user/", searchUser, readUser); // If no search query params, searchUser will pass handling to readUser
router.get("/user/:username", readUser);
router.patch("/user", updateUser);
router.delete("/user", deleteUser);

// Movies
router.get("/movie", getMovies);
