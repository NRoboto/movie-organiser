import { User, UserDocument, isUser } from "../models/User";
import {
  ReqAuthRequestHandler,
  UseAuthRequestHandler,
  NoAuthRequestHandler,
} from "./types";
import { UserMapper } from "../mappers";
import {
  OkDTO,
  PrivateProfileDTO,
  ProfileDTO,
  PublicProfileDTO,
} from "../DTOs";

export const readSelf: ReqAuthRequestHandler<PrivateProfileDTO> = async (
  req,
  res,
  next,
  user
) => {
  res.send(UserMapper.toPrivateProfileDTO(user));
};

export const readUser: UseAuthRequestHandler<ProfileDTO> = async (
  req,
  res,
  next,
  user
) => {
  const username = req.params.username;

  const foundUser = await User.getByUsername(username);
  if (!foundUser)
    return next({ message: `User "${username}" not found.`, status: 404 });

  if (user?.username === username)
    return res.send(UserMapper.toPrivateProfileDTO(foundUser));

  res.send(UserMapper.toPublicProfileDTO(foundUser));
};

export const updateUser: ReqAuthRequestHandler<PrivateProfileDTO> = async (
  req,
  res,
  next,
  user
) => {
  const updatedUser = await user.updateDetails(req.body);
  res.send(UserMapper.toPrivateProfileDTO(updatedUser));
};

export const deleteUser: ReqAuthRequestHandler<OkDTO> = async (
  req,
  res,
  next,
  user
) => {
  const deletedUser = await user.deleteOne();

  if (!deletedUser)
    return next({ message: "Unable to delete user", status: 500 });

  res.send({
    ok: true,
    message: "User deleted successfully",
  });
};

export const searchUser: NoAuthRequestHandler<PublicProfileDTO[]> = async (
  req,
  res,
  next
) => {
  const { name, location } = req.query;

  if (!name && !location) return next();


  const users = await User.search(name, location);

  res.send(users.map(UserMapper.toPublicProfileDTO));
};
