import { AccountCode } from "../../src/AccountCode";
test("Deve criar uma sequencia assim que a conta e criada a partir da data", () => {
  const account_date = new Date("2001-02-01");
  const account_code = new AccountCode(account_date, 99);
  expect(account_code.value).toBe("200100000099");
});
