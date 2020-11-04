"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const common_test_1 = require("./common.test");
const userDoc = {
    username: "Alice",
    password: "myPassword123!",
    gender: "enby",
    age: 30,
    location: "Norway",
};
// const checkRequired = async (isRequired: boolean, field: keyof UserDoc) => {
//   const { [field]: _, ...doc } = userDoc;
//
//   if (isRequired) await expect(new User(doc).save()).rejects.toThrow();
//   else await expect(new User(doc).save()).resolves.toMatchObject(doc);
// };
//
// const writeUser = async (fieldReplacements?: { [x: string]: any }) => {
//   const doc = {
//     ...userDoc,
//     ...fieldReplacements,
//   };
//
//   return await new User(doc).save();
// };
const checkRequired = common_test_1.checkRequiredForDoc(user_1.User, userDoc);
const writeUser = common_test_1.writeWithDoc(user_1.User, userDoc);
describe("User Model", () => {
    test("Has necessary data", () => {
        const user = new user_1.User({ ...userDoc, otherField: "Test" });
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
        const { initMongoose } = await Promise.resolve().then(() => __importStar(require("../db/init")));
        await initMongoose();
    });
    beforeEach(async () => {
        await user_1.User.deleteMany({});
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
            await expect(writeUser({ username: "     Alice      " })).resolves.toMatchObject(userDoc);
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
            await expect(writeUser({ password: "     myPassword123!     " })).resolves.toMatchObject(userDoc);
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
    describe("Location", async () => {
        test("Not required", async () => {
            await checkRequired(false, "location");
        });
    });
});
