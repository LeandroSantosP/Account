import pino from "pino";
import PinoPretty from "pino-pretty";

const stream = PinoPretty({ colorize: true });
const logger = pino(
  {
    base: {
      pid: false,
    },
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "dd/MM - HH:mm:ss",
        ignore: "pid, hostname",
      },
    },
  },
  stream
);

export { logger };
