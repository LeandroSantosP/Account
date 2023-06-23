export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ENV: 'TEST' | 'DEV' | 'PROD';
      HOST: string;
    }
  }
}
