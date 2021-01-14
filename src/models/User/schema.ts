import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Filter from "bad-words";
import { UserDocument } from ".";
import { TokenObject, tokenSchema } from "..";

const filter = new Filter();

export const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "required"],
      minlength: [3, "must be atleast 3 characters"],
      maxlength: [20, "cannot be more than 20 characters"],
      trim: true,
      validate: [
        async (value: string) => !filter.isProfane(value),
        "cannot contain profanity",
      ],
    },
    displayName: {
      type: String,
      unique: true,
      required: [false, "required"],
      minlength: [3, "must be atleast 3 characters"],
      maxlength: [20, "cannot be more than 20 characters"],
      trim: true,
      validate: [
        async (value: string) => !filter.isProfane(value),
        "cannot contain profanity",
      ],
    },
    password: {
      type: String,
      required: [true, "required"],
      minlength: [8, "must be atleast 8 characters"],
      trim: true,
      select: false,
    },
    gender: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
      required: false,
      min: [0, "cannot be less than 0"],
      max: [120, "cannot be greater than 120"],
    },
    location: {
      type: String,
      required: false,
    },
    tokens: {
      type: [tokenSchema],
      select: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

userSchema.virtual("lists", {
  ref: "list",
  localField: "_id",
  foreignField: "createdBy",
});

userSchema.methods.toJSON = function () {
  throw new Error("Model should not be serialised directly");
};

userSchema.methods.isPassword = async function (pass) {
  const user = this;

  return await bcrypt.compare(pass, user.password);
};

userSchema.methods.createToken = async function () {
  const user = this;

  const iat = new Date().getTime();
  const jwtObject: TokenObject = { sub: user.id, iat };
  const token = jwt.sign(jwtObject, process.env.JWT_SECRET!);

  user.tokens.push({ token });
  await user.save();

  return user.tokens[0];
};

userSchema.methods.getLists = async function (
  page = 0,
  itemsPerPage = 5,
  sort,
  showPrivate = false
) {
  const user = this;

  const limit = itemsPerPage;
  const skip = itemsPerPage * page;

  const match: { [key: string]: boolean } = {};
  if (!showPrivate) match["isPublic"] = true;

  await user
    .populate({
      path: "lists",
      match,
      options: {
        limit,
        skip,
        sort,
      },
    })
    .execPopulate(); // NOTE: Currently returns all movie Ids, should only return first

  return (user as any).lists;
};

userSchema.methods.updateDetails = async function (updates) {
  const user = this;

  const updatableFields: readonly (keyof UserDocument)[] = [
    "displayName",
    "password",
    "age",
    "gender",
    "location",
  ];

  const updatesToApply = updatableFields
    .filter((field) => updates[field])
    .reduce((updateObj, field) => {
      updateObj[field] = updates[field];
      return updateObj;
    }, {} as { [key in keyof UserDocument]?: any });

  return await Object.assign(user, updatesToApply).save();
};

userSchema.methods.removeToken = async function (tokensOrAll) {
  const user = this;

  if (tokensOrAll === "all") user.tokens = [];
  else user.tokens = user.tokens.filter((t) => !tokensOrAll.includes(t.token));

  return await user.save();
};

userSchema.pre<UserDocument>("save", async function (next) {
  const user = this;

  if (user.isNew) {
    user.displayName = user.username;
    user.username = user.username.toLowerCase();
  }

  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 10);

  next();
});

userSchema.post<UserDocument>("save", (error: any, doc: any, next: any) => {
  if (error.name === "MongoError" && error.code === 11000)
    return next(
      new mongoose.Error.ValidatorError({
        message: "A user with this username already exists",
      })
    );
  next();
});
