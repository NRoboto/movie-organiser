"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const passport_1 = __importDefault(require("passport"));
const init_1 = require("./db/init");
const router_1 = require("./router");
const app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(router_1.router);
init_1.initMongoose()
    .then((status) => {
    console.log("MongoDB", chalk_1.default.bgGreen(status));
})
    .catch((err) => {
    console.log(chalk_1.default.bgRed("Error"), err);
});
app.listen(process.env.PORT, () => {
    console.log(chalk_1.default.bgMagenta(`Server is listening on port ${process.env.PORT}`));
});
