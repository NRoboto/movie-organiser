import express from "express";
import { getMovies } from "./controllers";

export const router = express.Router();

router.get("/movie", getMovies);
