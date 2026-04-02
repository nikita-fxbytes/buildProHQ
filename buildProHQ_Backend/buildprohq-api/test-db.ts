import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

async function testConnection() {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
  console.log('Testing connection with:');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  
  const ds = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await ds.initialize();
    console.log('Connected!');
    await ds.destroy();
  } catch (err) {
    console.error('Failed to connect:', err);
  }
}

testConnection();
