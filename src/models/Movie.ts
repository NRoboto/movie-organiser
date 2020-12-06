import mongoose from "mongoose";
import { isValidIMDBId } from "../utils/omdb";

const movieSchema = new mongoose.Schema({
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
    validate(value: string) {
      return isValidIMDBId(value);
    },
  },
});

export const Movie = mongoose.model("movie", movieSchema);
