import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("Create Statement", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("should be able to create a new statement", async () => {
    const user = await usersRepository.create({
      email: "jest@test.com",
      name: "Test Jest",
      password: "test"
    });

    const statement = await createStatementUseCase.execute({
      user_id: (user.id ? user.id : ""),
      amount: 100,
      description: "deposit 100",
      type: OperationType.DEPOSIT
    });


    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement with a nonexistent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "errortest",
        amount: 100,
        description: "deposit 100",
        type: OperationType.DEPOSIT
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement of type withdraw if the user have insufficient funds", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: "jest@test.com",
        name: "Test Jest",
        password: "test"
      });

      await createStatementUseCase.execute({
        user_id: (user.id ? user.id : ""),
        amount: 100,
        description: "deposit 100",
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
