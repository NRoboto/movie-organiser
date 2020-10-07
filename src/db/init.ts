import mongoose from "mongoose";
import chalk from "chalk";

mongoose
  .connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .catch((e) => console.log(chalk.bgRed("Error"), e));

mongoose.connection.on("error", (err) => {
  console.log(chalk.bgRed("Error"), err);
});
