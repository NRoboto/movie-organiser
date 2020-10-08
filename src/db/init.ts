import mongoose from "mongoose";
import chalk from "chalk";

export const initMongoose = async () => {
  await mongoose.connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("error", (err) => {
    console.log(chalk.bgRed("Error"), err);
  });

  return mongoose.STATES[mongoose.connection.readyState];
};
