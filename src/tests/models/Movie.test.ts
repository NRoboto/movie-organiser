import { Movie } from "../../models/Movie";
import { checkRequiredForDoc, writeWithDoc } from "../fixtures/common.testutil";

const movieDoc = {
  title: "The Truman Show",
  released: "05 Jun 1998",
  director: "Peter Weir",
  writers: ["Andrew Niccol"],
  actors: ["Jim Carrey", "Ed Harris", "Laura Linney"],
  plot:
    "An insurance salesman discovers his whole life is actually a reality TV show.",
  rating: 8.1,
  imdbID: "tt0120382",
};

const checkRequired = checkRequiredForDoc(Movie, movieDoc);
const writeMovie = writeWithDoc(Movie, movieDoc);

describe("Movie database", () => {
  beforeAll(async () => {
    const { initMongoose } = await import("../../db/init");
    await initMongoose();
  });

  beforeEach(async () => {
    await Movie.deleteMany({});
  });

  test("Inserts new movie", async () => {
    await expect(writeMovie()).resolves.toMatchObject(movieDoc);
  });

  describe("Title", () => {
    test("Is required", async () => {
      await checkRequired(true, "title");
    });

    test("Trims blank space", async () => {
      await expect(
        writeMovie({ title: "   The Truman Show   " })
      ).resolves.toMatchObject(movieDoc);
    });

    test("Cannot be blank", async () => {
      await expect(writeMovie({ title: "" })).rejects.toThrow();
    });
  });

  describe("Released", () => {
    test("Is required", async () => {
      await checkRequired(true, "released");
    });

    test("Trims blank space", async () => {
      await expect(
        writeMovie({ released: "   05 Jun 1998   " })
      ).resolves.toMatchObject(movieDoc);
    });

    test("Cannot be blank", async () => {
      await expect(writeMovie({ title: "" })).rejects.toThrow();
    });
  });

  describe("Director", () => {
    test("Is required", async () => {
      await checkRequired(true, "director");
    });

    test.only("Trims blank space", async () => {
      await expect(
        writeMovie({ director: "   Peter Weir   " })
      ).resolves.toMatchObject(movieDoc);
    });

    test("Cannot be blank", async () => {
      await expect(writeMovie({ director: "" })).rejects.toThrow();
    });
  });

  describe("Writers", () => {
    test("Is required", async () => {
      await checkRequired(true, "writers");
    });

    test("Trims blank space", async () => {
      await expect(
        writeMovie({ writers: ["   Andrew Niccol   "] })
      ).resolves.toMatchObject(movieDoc);
    });

    test("Must have atleast one", async () => {
      await expect(writeMovie({ writers: [] })).rejects.toThrow();
    });

    test("Entries cannot be blank", async () => {
      await expect(writeMovie({ writers: ["", "", ""] })).rejects.toThrow();
    });
  });

  describe("Actors", () => {
    test("Is required", async () => {
      await checkRequired(true, "actors");
    });

    test("Trims blank space", async () => {
      await expect(
        writeMovie({
          actors: ["   Jim Carrey", "Ed Harris   ", "   Laura Linney   "],
        })
      ).resolves.toMatchObject(movieDoc);
    });

    test("Must have atleast one", async () => {
      await expect(writeMovie({ actors: [] })).rejects.toThrow();
    });

    test("Entries cannot be blank", async () => {
      await expect(writeMovie({ actors: ["", "", ""] })).rejects.toThrow();
    });
  });

  describe("Plot", () => {
    test("Is not required", async () => {
      await checkRequired(false, "plot");
    });

    test("Trims blank space", async () => {
      await expect(
        writeMovie({
          plot:
            "   An insurance salesman discovers his whole life is actually a reality TV show.   ",
        })
      ).resolves.toMatchObject(movieDoc);
    });
  });

  describe("Rating", () => {
    test("Is required", async () => {
      await checkRequired(true, "rating");
    });

    test("Cannot be negtive", async () => {
      await expect(writeMovie({ rating: -1 })).rejects.toThrow();
      await expect(writeMovie({ rating: -0.1 })).rejects.toThrow();
    });

    test("Cannot be >10", async () => {
      await expect(writeMovie({ rating: 11 })).rejects.toThrow();
      await expect(writeMovie({ rating: 10.1 })).rejects.toThrow();
    });
  });

  describe("IMDB ID", () => {
    test("Is not required", async () => {
      await checkRequired(true, "imdbID");
    });

    test("Trims blank space", async () => {
      await expect(
        writeMovie({ imdbID: "   tt0120382   " })
      ).resolves.toMatchObject(movieDoc);
    });

    test("Valid prefix are accepted", async () => {
      const validIMDBIdPrefixes = ["tt", "mm", "co", "ev", "ch", "ni"];
      validIMDBIdPrefixes
        .map((prefix) => `${prefix}0120382`)
        .forEach(async (imdbID) => {
          await expect(writeMovie({ imdbID })).resolves.not.toThrow();
        });
    });

    test("Cannot begin with invalid prefix", async () => {
      await expect(writeMovie({ imdbID: "tm0120382" })).rejects.toThrow();
    });
  });
});
