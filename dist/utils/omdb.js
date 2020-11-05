"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omdbRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const typeCheck_1 = require("./typeCheck");
const omdbApiUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`;
const sanitiseOmdbQuery = (params) => {
    const { i, query, type, year } = params;
    if (i) {
        return { i };
    }
    else {
        if (type && type !== "movie" && type !== "series")
            throw new Error("Type must be either 'movie' or 'series'");
        if (year && !typeCheck_1.stringIsInt(year))
            throw new Error("Year must be an integer");
        return { s: query, type, y: year };
    }
};
const extractMovieData = (data) => {
    var _a, _b, _c;
    return ({
        title: data.Title,
        released: (_a = data.Released) !== null && _a !== void 0 ? _a : data.Year,
        director: data.Director,
        writers: (_b = data.Writer) === null || _b === void 0 ? void 0 : _b.split(",").map((x) => x.trim()),
        actors: (_c = data.Actors) === null || _c === void 0 ? void 0 : _c.split(",").map((x) => x.trim()),
        plot: data.Plot,
        rating: data.imdbRating,
        imdbID: data.imdbID,
        image: data.Poster === "N/A" ? undefined : data.Poster,
    });
};
exports.omdbRequest = async (params) => {
    let reqUrl = omdbApiUrl;
    const sanitisedParams = sanitiseOmdbQuery(params);
    for (const key of Object.keys(sanitisedParams)) {
        if (sanitisedParams[key])
            reqUrl += `&${key}=${sanitisedParams[key]}`;
    }
    console.log("reqUrl", reqUrl);
    const { data } = await axios_1.default.get(reqUrl);
    console.log("data", data);
    if (data.Error) {
        throw new Error(data.Error);
    }
    else if (data.Search) {
        return data.Search.map((x) => extractMovieData(x));
    }
    else {
        return extractMovieData(data);
    }
};
