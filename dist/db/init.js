"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMongoose = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chalk_1 = __importDefault(require("chalk"));
exports.initMongoose = async () => {
    await mongoose_1.default.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.log(chalk_1.default.bgRed("Error"), err);
    });
    return mongoose_1.default.STATES[mongoose_1.default.connection.readyState];
};
