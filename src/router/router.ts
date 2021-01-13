import fs from "fs";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import {
  readSelf,
  readUser,
  updateUser,
  deleteUser,
  searchUser,
  signin,
  signup,
  signout,
  signoutAll,
  getMovies,
  createList,
  getList,
  getUserLists,
  getSelfLists,
  updateList,
  deleteList,
} from "../controllers";
import {
  useReqAuthHandler,
  useSigninHandler,
  useUseAuthHandler,
} from "./authHandlers";
import { errHandler } from "./errorHandler";

// Create router
export const router = express.Router();

// Users
router.post("/signup", signup);
router.post("/login", useSigninHandler(signin));
router.post("/signout", useReqAuthHandler(signout));
router.post("/signout/all", useReqAuthHandler(signoutAll));

router
  .route("/user")
  .get(useReqAuthHandler(readSelf))
  .patch(useReqAuthHandler(updateUser))
  .delete(useReqAuthHandler(deleteUser));

router.get("/users", searchUser);

router.get("/user/:username", useUseAuthHandler(readUser));

// Lists
router
  .route("/list")
  .get(useReqAuthHandler(getSelfLists))
  .post(useReqAuthHandler(createList));

router
  .route("/list/:id")
  .get(useUseAuthHandler(getList))
  .patch(useReqAuthHandler(updateList))
  .delete(useReqAuthHandler(deleteList));

router.get("/user/:username/list", useUseAuthHandler(getUserLists));

// Movies
router.get("/movie", getMovies);

// Docs
const swaggerDocument = YAML.parse(fs.readFileSync("swagger.yaml", "utf-8"));
router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(swaggerDocument));

router.use(errHandler);
