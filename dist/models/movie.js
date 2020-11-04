"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validIMDBIdPrefixes = ["tt", "mm", "co", "ev", "ch", "ni"];
const movieSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    released: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    director: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    writers: {
        type: [String],
        required: true,
        trim: true,
        minlength: 1,
    },
    actors: {
        type: [String],
        required: true,
        trim: true,
        minlength: 1,
    },
    plot: {
        type: String,
        required: false,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    imdbID: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            return validIMDBIdPrefixes.some((prefix) => value.startsWith(prefix));
        },
    },
});
exports.Movie = mongoose_1.default.model("movie", movieSchema);
