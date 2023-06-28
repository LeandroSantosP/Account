export interface Currency {
    calculate(input: Input): Promise<Output>;
}

export type Input = {
    currency: string;
};

export type Output = {
    price: number;
    code: string;
};
