"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chalk_1 = __importDefault(require("chalk"));
mongoose_1.default
    .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .catch((e) => console.log(chalk_1.default.bgRed("Error"), e));
mongoose_1.default.connection.on("error", (err) => {
    console.log(chalk_1.default.bgRed("Error"), err);
});
