import express from "express";
import { createUser, getMovies } from "./controllers";

export const router = express.Router();

// Users
router.post("/user", createUser);

// Movies
router.get("/movie", getMovies);
