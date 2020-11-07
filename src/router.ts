import express from "express";
import { createUser, readUser, updateUser, getMovies } from "./controllers";

export const router = express.Router();

// Users
router.post("/user", createUser);
router.get("/user/:username", readUser);
router.patch("/user", updateUser);

// Movies
router.get("/movie", getMovies);
