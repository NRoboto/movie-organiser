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
    displayName: {
        type: String,
        unique: true,
        required: false,
        minlength: 3,
        maxlength: 20,
        trim: true,
        async validate(value) {
            if (filter.isProfane(value))
                throw new Error("Display name cannot contain profanity.");
            const existingUser = await exports.User.findOne({
                username: value.toLowerCase(),
            });
            if (existingUser)
                throw new Error(`Display name cannot be the same as another user's username`);
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
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.updatedAt;
    delete user.__v;
    delete user._id;
    return user;
};
userSchema.methods.isPassword = function (pass) {
    const user = this;
    return user.password === pass; // NOTE: Should use bcrypt
};
userSchema.pre("save", function () {
    const user = this;
    if (user.isNew) {
        user.displayName = user.username;
        user.username = user.username.toLowerCase();
    }
});
exports.User = mongoose_1.default.model("user", userSchema);
