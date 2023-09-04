import { expect } from "chai";

import { TestDataSource, setup, teardown } from "../DatabaseSetup.ts";
import { User } from "../../db/entities/User.ts";
describe("User Entity Tests", function () {
  before(async function () {
    await setup(User.name);
  });

  after(async function () {
    await teardown(User.name);
  });

  let userId: number;

  it("should create a new user", async function () {
    console.log("Creating a new user");
    const user = new User();
    user.username = "test_user";
    user.password = "test_password";
    user.email = "test@email.com";

    const savedUser = await TestDataSource.getRepository("User").save(user);

    expect(savedUser.id).to.exist;
    userId = savedUser.id;
  });

  it("should retrieve the user by ID", async function () {
    const user = await TestDataSource.getRepository(User).findOne({ where: { id: userId } });
    expect(user).to.exist;
    expect(user!.username).to.equal("test_user");
  });

  it("should update the user", async function () {
    await TestDataSource.getRepository(User).update(userId, { username: "updated_user" });
    const user = await TestDataSource.getRepository(User).findOne({ where: { id: userId } });
    expect(user!.username).to.equal("updated_user");
  });

  it("should delete the user", async function () {
    await TestDataSource.getRepository(User).delete(userId);
    const user = await TestDataSource.getRepository(User).findOne({ where: { id: userId } });
    expect(user).to.be.null;
  });
});
