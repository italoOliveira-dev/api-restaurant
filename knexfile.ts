import { Knex } from 'knex';
import sqlite3 from 'sqlite3';

interface SQLITEConnection extends sqlite3.Database {}

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db',
  },
  pool: {
    afterCreate: (
      connection: SQLITEConnection,
      done: (error?: Error | null) => void
    ) => {
      connection.run('PRAGMA foreign_key = on');
      done();
    },
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
  seeds: {
    extension: 'ts',
    directory: './src/database/seeds',
  },
};

export default config;
