import mongoose from "mongoose";
import { logger } from "../logger";

export const initMongoose = async () => {
  await mongoose.connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("error", (err) => {
    logger.fatal("Mongoose connection error", err);
  });

  return mongoose.STATES[mongoose.connection.readyState];
};
