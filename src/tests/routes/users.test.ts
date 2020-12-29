import { router } from "../../router";

describe("Signup", () => {
  test.todo("Creates a new user with correct data");
  test.todo("Doesn't create duplicate user");
});

describe("Login", () => {
  test.todo("Login to existing user");
  test.todo("Doesn't login to existing user with wrong password");
  test.todo("Doesn't login to non-existant user");
});

describe("Signout", () => {
  test.todo("Doesn't signout unauthenticated user");
  test.todo("Signout all sessions when all is specified");
  test.todo("Signout correct token");
});

describe("User", () => {
  describe("View profile", () => {
    test.todo("Get own profile for authenticated user");
    test.todo("Don't get profile for unauthenticated user");
    test.todo("Shows own private information");
  });

  describe("Update profile", () => {
    test.todo("Correctly update authenticated user data");
    test.todo("Ignores invalid updates");
    test.todo("Doesn't allow updates for unauthenticated user");
  });

  describe("Delete", () => {
    test.todo("Deletes authenticated user");
    test.todo("Doesn't delete unauthenticated user");
  });
});

describe("Search users", () => {
  test.todo("Correctly searches by username or displayName");
  test.todo("Correctly searches by location");
  test.todo("Correctly searches by name and location");
  test.todo("Gives an error if no name or location provided");
  test.todo("Doesn't expose private user information");
});
