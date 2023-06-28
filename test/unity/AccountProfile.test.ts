import { AccountProfile } from "../../src/domain/AccountProfile";
import { Address } from "../../src/domain/Address";

test("Deve criar uma conta de profile para um client", () => {
    const accountProfile = new AccountProfile(
        "João",
        "joao@gmail.com",
        "senha123",
        new Address("Rua 1", 100, "Sao paulo")
    );

    expect(accountProfile.email).toBe("joao@gmail.com");
    expect(accountProfile.password).toBe("senha123");
});

test("Deve encriptar a senha e validar ela mesma!", async () => {
    const accountProfile = new AccountProfile(
        "João",
        "joao@gmail.com",
        "senha123",
        new Address("Rua 1", 100, "Sao paulo")
    );

    await accountProfile.encryptPassword();

    const password_is_valid = await accountProfile.verify("senha123");
    expect(password_is_valid).toBeTruthy();
});

test("Deve encriptar a senha e validar ela mesma!", async () => {
    const accountProfile = new AccountProfile(
        "João",
        "joao@gmail.com",
        "senha123",
        new Address("Rua 1", 100, "Sao paulo")
    );

    await accountProfile.encryptPassword();

    const password_is_valid = await accountProfile.verify("senha123");
    expect(password_is_valid).toBeTruthy();
});
