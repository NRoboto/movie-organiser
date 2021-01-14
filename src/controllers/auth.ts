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

  await user.removeToken([reqToken]);

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
  await user.removeToken("all");

  res.send({
    ok: true,
    message: "All sessions signed out successfully",
  });
};
