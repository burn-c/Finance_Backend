import { createConnection, getConnectionOptions, Connection } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, { name, url: process.env.DATABASE_URL }),
  );
};
