import { User, isUser } from "../models";
import {
  ReqAuthRequestHandler,
  SigninRequestHandler,
  NoAuthRequestHandler,
} from "./types";
import { OkDTO, RegisterDTO, TokenDTO } from "../DTOs";
import { UserMapper } from "../mappers";

export const signin: SigninRequestHandler<TokenDTO> = async (
  req,
  res,
  next,
  user
) => {
  const token = await user.createToken();
  res.send(UserMapper.toTokenDTO(token));
};

export const signup: NoAuthRequestHandler<TokenDTO, RegisterDTO> = async (
  req,
  res,
  next
) => {
  const { username } = req.body;

  // TODO: Perhaps refactor into repository `exists` function?
  const user = await User.findOne({ username });
  if (user) return next({ message: "Email already in use", status: 422 });

  const newUser = await UserMapper.toDatabase(req.body);
  if (!newUser) return next({ message: "Error creating user", status: 500 });

  return await signin(req, res, next, newUser);
};

export const signout: ReqAuthRequestHandler<OkDTO> = async (
  req,
  res,
  next,
  user
) => {
  const reqToken = req.body.token;

  if (!reqToken) return next({ message: "No token provided", status: 400 });

  user.tokens = user.tokens.filter((token) => token.token !== reqToken);
  await user.save();

  res.send({
    ok: true,
    message: "Signed out successfully",
  });
};

export const signoutAll: ReqAuthRequestHandler<OkDTO> = async (
  req,
  res,
  next,
  user
) => {
  if (req.body.all !== "true") return next();

  user.tokens = [];
  await user.save();

  res.send({
    ok: true,
    message: "All sessions signed out successfully",
  });
};
