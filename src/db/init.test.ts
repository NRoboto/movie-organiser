import mongoose from "mongoose";

test("Should connect to database", async () => {
  const { initMongoose } = await import("./init");
  await initMongoose();
  expect(mongoose.connection.readyState).toBe(1); // 1 = Connected
});
