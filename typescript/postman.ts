import axios from 'axios';
import dotenv from 'dotenv';

import { Logger } from './logger.js';

dotenv.config();

const log = new Logger();

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;

async function getCollections() {
  try {
    const collections = await axios.get(`https://api.getpostman.com/collections?apikey=${POSTMAN_API_KEY}`);
    log.result(`Retrieved ${JSON.stringify(collections.data)}`);
  } catch (error) {
    log.error(error);
  }
}

getCollections();
