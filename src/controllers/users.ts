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

  const foundUser = await User.findOne({ username });
  if (!foundUser)
    return next({ message: `User "${username}" not found.`, status: 404 });

  const toProfileDTO =
    user?.username === username
      ? UserMapper.toPrivateProfileDTO
      : UserMapper.toPublicProfileDTO;

  res.send(toProfileDTO(foundUser));
};

export const updateUser: ReqAuthRequestHandler<PrivateProfileDTO> = async (
  req,
  res,
  next,
  user
) => {
  const updatableFields: (keyof UserDocument)[] = [
    "displayName",
    "password",
    "age",
    "gender",
    "location",
  ];

  const updates = updatableFields
    .filter((field) => req.body[field])
    .reduce((updates, field) => {
      updates[field] = req.body[field];
      return updates;
    }, {} as { [key in keyof UserDocument]?: any });

  const updatedUser = Object.assign(user, updates);
  await updatedUser.save();

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

  const getSearchRegex = (value: any) =>
    value ? new RegExp(`.*${value}.*`, "i") : /.*/;
  const nameRegex = getSearchRegex(name);

  const users = await User.find({
    $or: [{ username: nameRegex }, { displayName: nameRegex }],
    location: getSearchRegex(location),
  });

  res.send(users.map(UserMapper.toPublicProfileDTO));
};
