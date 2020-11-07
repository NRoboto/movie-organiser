import express from "express";
import { createUser, readUser, getMovies } from "./controllers";

export const router = express.Router();

// Users
router.post("/user", createUser);
router.get("/user/:username", readUser);

// Movies
router.get("/movie", getMovies);
