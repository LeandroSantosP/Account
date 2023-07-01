import { z } from "zod";

export const create_profile_schema = z
    .object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        address: z.object({
            street: z.string(),
            city: z.string(),
            number: z.number(),
        }),
    })
    .strict();

export const create_account_schema = z
    .object({
        client_id: z.string().uuid(),
        owner_name: z.string(),
        email: z.string(),
    })
    .strict();

export const get_account_schema = z.object({
    client_id: z.string().uuid(),
});

export const deposit_account_schema = z
    .object({
        account_code: z.string(),
        amount: z.number().min(0),
        deposit_date: z.string().refine((value) => {
            return !!/^\d{4}-\d{2}-\d{2}$/.test(value);
        }),
        currency: z.string().optional(),
    })
    .strict();
