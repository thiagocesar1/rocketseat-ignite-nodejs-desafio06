import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "jest@test.com",
      name: "Test Jest",
      password: "test"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with an existent e-mail", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "jest@test.com",
        name: "Test Jest",
        password: "test"
      });

      await createUserUseCase.execute({
        email: "jest@test.com",
        name: "Test Error",
        password: "error"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
