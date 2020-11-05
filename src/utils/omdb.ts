import axios from "axios";
import { stringIsInt } from "./typeCheck";

const omdbApiUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`;

type Params = Record<string, string>;

const sanitiseOmdbQuery = (params: Params): Params => {
  const { i, query, type, year } = params;

  if (i) {
    return { i };
  } else {
    if (type && type !== "movie" && type !== "series")
      throw new Error("Type must be either 'movie' or 'series'");
    if (year && !stringIsInt(year)) throw new Error("Year must be an integer");

    return { s: query, type, y: year };
  }
};

const extractMovieData = (data: any) => ({
  title: data.Title,
  released: data.Released ?? data.Year,
  director: data.Director,
  writers: data.Writer?.split(",").map((x: string) => x.trim()),
  actors: data.Actors?.split(",").map((x: string) => x.trim()),
  plot: data.Plot,
  rating: data.imdbRating,
  imdbID: data.imdbID,
  image: data.Poster === "N/A" ? undefined : data.Poster,
});

export const omdbRequest = async (params: Params) => {
  let reqUrl = omdbApiUrl;
  const sanitisedParams = sanitiseOmdbQuery(params);

  for (const key of Object.keys(sanitisedParams)) {
    if (sanitisedParams[key]) reqUrl += `&${key}=${sanitisedParams[key]}`;
  }

  console.log("reqUrl", reqUrl);

  const { data } = await axios.get(reqUrl);

  console.log("data", data);

  if (data.Error) {
    throw new Error(data.Error);
  } else if (data.Search) {
    return data.Search.map((x: any) => extractMovieData(x));
  } else {
    return extractMovieData(data);
  }
};
