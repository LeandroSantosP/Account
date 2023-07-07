import { Charge } from "../../src/domain/Charge";
import { ChargeWithOutTax } from "../../src/domain/ChargeWithOutTax";
import { ChargeWithTax } from "../../src/domain/ChargeWithTax";

test("Deve criar uma cobrança", function () {
    const charge = ChargeWithTax.create("Test", 1000, "1234", new Date("2021-01-01"));
    expect(charge).toBeDefined();
});

test("Deve ser possível pagar uma cobrança", function () {
    const charge = ChargeWithTax.create("Test", 1000, "1234", new Date("2023-01-01"));

    const payment = charge.pay({
        amount: 500,
        payment_date: new Date("2023-01-21"),
    });

    const payment2 = charge.pay({
        amount: 500,
        payment_date: new Date("2023-01-21"),
    });

    expect(payment2.total_amount).toBe(1000);
    expect(payment2.amount_pay).toBe(500);
    expect(payment2.rest_for_payment).toBe(0);
});

test("Deve adicionar uma taxa de 1% casso nao seja pago em 1 mes", function () {
    const charge = ChargeWithTax.create("Test", 1000, "1234", new Date("2023-01-01"));

    charge.pay({
        amount: 200,
        payment_date: new Date("2023-03-21"),
    });

    const { amount_pay, rest_for_payment, total_amount } = charge.pay({
        amount: 800,
        payment_date: new Date("2023-03-21"),
    });

    expect(total_amount).toBe(1000);
    expect(amount_pay).toBe(800);
    expect(rest_for_payment).toBe(200);
});

test("Deve lançar um erro casso tente pagar mais do que o valor da cobrança", function () {
    const charge = ChargeWithTax.create("Test", 1000, "1234", new Date("2023-01-01"));

    expect(() =>
        charge.pay({
            amount: 2000,
            payment_date: new Date("2023-01-21"),
        })
    ).toThrow(new Error("Invalid amount 2000, current value for pay 1000"));
});

test("Deve ser efetuar o pagamento sem cobrar taxa!", () => {
    const charge = ChargeWithOutTax.create("Test", 1000, "1234", new Date("2023-01-01"));
    charge.pay({
        amount: 500,
        payment_date: new Date("2023-03-21"),
    });

    const { amount_pay, rest_for_payment, total_amount } = charge.pay({
        amount: 500,
        payment_date: new Date("2023-03-21"),
    });

    expect(total_amount).toBe(1000);
    expect(amount_pay).toBe(500);
    expect(rest_for_payment).toBe(0);
});
