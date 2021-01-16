import path from "path";
import express from "express";
import passport from "passport";
import cors from "cors";
// @ts-ignore Catches async errors in express routes
import "express-async-errors";

import { router } from "./router";

export const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(passport.initialize());

// TODO: Set CORS policy to only allow same origin
app.options("*", cors<any>());
app.use(cors());

app.use(router);
