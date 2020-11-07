"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
// import { createUser, readUser, getMovies } from "./controllers";
const controllers_1 = require("./controllers");
exports.router = express_1.default.Router();
// Users
exports.router.post("/user", controllers_1.createUser);
exports.router.get("/user/:username", readUser);
// Movies
exports.router.get("/movie", controllers_1.getMovies);
