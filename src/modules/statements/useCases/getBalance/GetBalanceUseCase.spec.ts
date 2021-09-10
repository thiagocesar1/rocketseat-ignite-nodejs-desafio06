import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepository: IStatementsRepository;
let usersRepository: IUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it("should be able to get the user balance", async () => {
    const user = await usersRepository.create({
      email: "jest@test.com",
      name: "Test Jest",
      password: "test"
    });

    const balance = await getBalanceUseCase.execute({
      user_id: (user.id ? user.id : ""),
    })

    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get the balance of a nonexistent user", async () => {
    expect(async() => {
      await getBalanceUseCase.execute({
        user_id: "errortest",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
