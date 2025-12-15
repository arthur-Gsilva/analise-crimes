import { Pool } from 'pg';
import db from './databases';

const pool = new Pool({
  user: db.user,
  host: db.host,
  database: db.database,
  password: db.password,
  port: db.port,
});

export default pool;
