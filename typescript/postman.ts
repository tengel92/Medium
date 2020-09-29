import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

import { Logger } from './logger.js';

interface PostmanMetadata {
  id: string;
  name: string;
  owner: string;
  uid: string;
}

dotenv.config();

const log = new Logger();

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;

//TODO: Ideally should have a better return type of any. Can't seem to get Collection from newman package to work here
async function getCollectionData(collectionMetadata: PostmanMetadata[]): Promise<any[] | undefined> {
  try {
    const promiseArray: Promise<AxiosResponse<any>>[] = [];
    for (const collection of collectionMetadata) {
      promiseArray.push(
        axios.get(`https://api.getpostman.com/collections/${collection.uid}?apikey=${POSTMAN_API_KEY}`)
      );
    }
    const allResponses = await Promise.allSettled(promiseArray);
    // TODO: comeback to put better type of any
    const collectionData: any[] = [];
    allResponses.forEach((response) => {
      if (response.status === 'fulfilled') {
        collectionData.push(response.value.data);
      } else {
        log.error(`An error occurred for ${response}`);
      }
    });
    return collectionData;
  } catch (error) {
    log.error(error);
  }
}

async function getCollectionMetadata(): Promise<PostmanMetadata[] | undefined> {
  try {
    const collectionsResponse = await axios.get(`https://api.getpostman.com/collections?apikey=${POSTMAN_API_KEY}`);
    return collectionsResponse.data.collections;
  } catch (error) {
    log.error(error);
  }
}

async function getEnvironmentData(): Promise<PostmanMetadata[] | undefined> {
  try {
    const environmentResponse = await axios.get(`https://api.getpostman.com/environments?apikey=${POSTMAN_API_KEY}`);
    return environmentResponse.data.environments;
  } catch (error) {
    log.error(error);
  }
}

const collectionMetadata = await getCollectionMetadata();
let collectionData;
if (collectionMetadata) {
  collectionData = await getCollectionData(collectionMetadata);
}
const environmentData = await getEnvironmentData();

if (collectionData) {
  for (const collection of collectionData) {
    if (collection.collection.info.name === 'JSON Placeholder') {
      console.log(collection.collection);
    }
  }
}

// log.result(`Collection Data: ${JSON.stringify(collectionData)}`);
// log.result(`Environment Data: ${JSON.stringify(environmentData)}`);
