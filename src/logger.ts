import bunyan from "bunyan";

export const logger = bunyan.createLogger({
  name: "Movie Organiser",
});
