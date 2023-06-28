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
        client_id: z.string(),
        owner_name: z.string(),
        email: z.string(),
    })
    .strict();
