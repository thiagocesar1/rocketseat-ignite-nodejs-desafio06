import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepository: IStatementsRepository;
let usersRepository: IUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("Get Statement Operation", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("should not be able to get a statement operation of a nonexistent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "usererror",
        statement_id: "statement_id"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a nonexistent statement operation of an user", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: "jest@test.com",
        name: "Test Jest",
        password: "test"
      });
      await getStatementOperationUseCase.execute({
        user_id: (user.id ? user.id : ""),
        statement_id: "statement_id"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should be able to get a statement operation of an user", async () => {
      const user = await usersRepository.create({
        email: "jest@test.com",
        name: "Test Jest",
        password: "test"
      });

      const statement = await statementsRepository.create({
        amount: 100,
        description: "deposit 100",
        type: OperationType.DEPOSIT,
        user_id: (user.id ? user.id : "")
      });

      const statementOperation = await getStatementOperationUseCase.execute({
        user_id: (user.id ? user.id : ""),
        statement_id: (statement.id ? statement.id : "")
      });

      expect(statementOperation).toBeInstanceOf(Statement);
      expect(statementOperation).toHaveProperty("id");
  });
});
