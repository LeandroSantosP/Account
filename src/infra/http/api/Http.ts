type method = "get" | "post" | "put" | "delete";

export interface Http {
    connection: any;
    listen(): Promise<void>;
    public(method: method, url: string, callback: Function): void;
}
