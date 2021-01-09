import {
  PrivateProfileDTO,
  PublicProfileDTO,
  RegisterDTO,
  SigninDTO,
  TokenDTO,
} from "../DTOs";
import { TokenDocument, User, UserDocument } from "../models";

export abstract class UserMapper {
  public static toTokenDTO(token: TokenDocument): TokenDTO {
    return {
      token: token.token,
      createdAt: token.createdAt!,
    };
  }

  public static toSigninDTO(
    user: UserDocument,
    token: TokenDocument
  ): SigninDTO {
    return {
      username: user.username,
      token: token.token,
    };
  }

  public static toPublicProfileDTO(user: UserDocument): PublicProfileDTO {
    return {
      username: user.username,
      displayName: user.displayName!,
      gender: user.gender,
      age: user.age,
      location: user.location,
      createdAt: user.createdAt!,
    };
  }

  public static toPrivateProfileDTO(user: UserDocument): PrivateProfileDTO {
    return {
      ...UserMapper.toPublicProfileDTO(user),
      tokens: user.tokens.map(UserMapper.toTokenDTO),
    };
  }

  public static async toDatabase(raw: RegisterDTO): Promise<UserDocument> {
    const { username, password, gender, age, location } = raw;

    return await new User({
      username,
      password,
      gender,
      age,
      location,
    }).save();
  }
}
