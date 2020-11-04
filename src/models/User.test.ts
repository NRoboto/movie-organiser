import { User } from "./User";
import { checkRequiredForDoc, writeWithDoc } from "./common.testutil";

type UserDoc = {
  username?: string;
  password?: string;
  gender?: string;
  age?: number;
  location?: string;
};

const userDoc: UserDoc = {
  username: "Alice",
  password: "myPassword123!",
  gender: "enby",
  age: 30,
  location: "Norway",
};

const checkRequired = checkRequiredForDoc(User, userDoc);
const writeUser = writeWithDoc(User, userDoc);

describe("User Model", () => {
  test("Has necessary data", () => {
    const user = new User({ ...userDoc, otherField: "Test" });

    expect(user.get("username")).toBe("Alice");
    expect(user.get("password")).toBe("myPassword123!");
    expect(user.get("gender")).toBe("enby");
    expect(user.get("age")).toBe(30);
    expect(user.get("location")).toBe("Norway");
    expect(user.get("otherField")).toBeUndefined();
  });
});

describe("User Database", () => {
  beforeAll(async () => {
    const { initMongoose } = await import("../db/init");
    await initMongoose();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("Inserts new user", async () => {
    await expect(writeUser()).resolves.toMatchObject(userDoc);
  });

  describe("Username", () => {
    test("Is required", async () => {
      await checkRequired(true, "username");
    });

    test("Cannot be blank", async () => {
      await expect(writeUser({ username: "        " })).rejects.toThrow();
    });

    test("Cannot be >20 characters", async () => {
      await expect(writeUser({ username: "a".repeat(21) })).rejects.toThrow();
    });

    test("Trims blank space", async () => {
      await expect(
        writeUser({ username: "     Alice      " })
      ).resolves.toMatchObject(userDoc);
    });

    test("Cannot be profanity", async () => {
      await expect(writeUser({ username: "Ass" })).rejects.toThrow();
    });
  });

  describe("Password", () => {
    test("Is required", async () => {
      await checkRequired(true, "password");
    });

    test("Must be atleast 8 characters", async () => {
      await expect(writeUser({ password: "a".repeat(7) })).rejects.toThrow();
    });

    test("Trims blank space", async () => {
      await expect(
        writeUser({ password: "     myPassword123!     " })
      ).resolves.toMatchObject(userDoc);
    });
  });

  describe("Gender", () => {
    test("Not required", async () => {
      await checkRequired(false, "gender");
    });
  });

  describe("Age", () => {
    test("Not required", async () => {
      await checkRequired(false, "age");
    });

    test("Must be a number", async () => {
      await expect(writeUser({ age: "Hello" })).rejects.toThrow();
    });

    test("Cannot be negative", async () => {
      await expect(writeUser({ age: -30 })).rejects.toThrow();
    });

    test("Cannot be >120", async () => {
      await expect(writeUser({ age: 121 })).rejects.toThrow();
    });
  });

  describe("Location", () => {
    test("Not required", async () => {
      await checkRequired(false, "location");
    });
  });
});
