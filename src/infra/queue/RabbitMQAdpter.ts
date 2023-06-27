import { Queue } from "./Queue";
import amqp, { Connection } from "amqplib";

export class RabbitMQAdapter implements Queue {
    connection!: Connection;
    static instance: RabbitMQAdapter;

    static getInstance() {
        if (!this.instance) {
            this.instance = new RabbitMQAdapter();
        }
        return this.instance;
    }

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
    }

    async publisher(queueName: string, data: any): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    }

    async consume(queueName: string, callback: Function): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        await channel.consume(queueName, async (message) => {
            if (!message) return;
            const input = await JSON.parse(message.content.toString());
            await callback(input);
            channel.ack(message);
        });
    }
}
