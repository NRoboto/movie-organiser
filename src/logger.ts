import { createWriteStream } from "fs";
import { join } from "path";
import bunyan from "bunyan";

export const logger = bunyan.createLogger({
  name: "Movie Organiser",
  streams: [
    {
      level: "info",
      stream: process.stdout,
    },
    {
      type: "file",
      level: "warn",
      stream: createWriteStream(join(__dirname, "..", "log.json"), {
        flags: "a",
      }),
    },
  ],
});
