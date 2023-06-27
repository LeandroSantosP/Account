export interface Queue {
    connect(): Promise<void>;
    publisher(queueName: string, data: any): Promise<void>;
    consume(queueName: string, callback: Function): Promise<void>;
}
