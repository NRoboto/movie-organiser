"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bad_words_1 = __importDefault(require("bad-words"));
const filter = new bad_words_1.default();
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true,
        validate(value) {
            if (filter.isProfane(value))
                throw new Error("Username cannot contain profanity.");
            return true;
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
    },
    gender: {
        type: String,
        required: false,
    },
    age: {
        type: Number,
        required: false,
        min: 0,
        max: 120,
    },
    location: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("user", userSchema);
