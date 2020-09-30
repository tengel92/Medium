import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import newman from 'newman';
import { Collection, Variable } from 'postman-collection';

import { Logger } from './logger.js';

interface PostmanMetadata {
  id: string;
  name: string;
  owner: string;
  uid: string;
}

interface NewmanResponse {
  httpResponseCode: number;
  responseData?: string;
}

interface VariableDefinition {
  name: string;
  values: Variable[];
}

dotenv.config();

const log = new Logger();

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;

// using any as Collection[] for some reason complains about .info. in collection.info.name
function filterCollection(collectionName: string, collections: any[]): any {
  return collections.filter((collection) => {
    if (collection.info.name === collectionName) {
      return collection as Collection;
    }
  });
}

//TODO: Ideally should have a better return type of any. Can't seem to get Collection from newman package to work here
async function getCollectionData(collectionMetadata: PostmanMetadata[]): Promise<Collection[] | undefined> {
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
        collectionData.push(response.value.data.collection);
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

async function executeNewmanRequest(
  collection: Collection,
  globalVariables?: VariableDefinition[],
  environmentVariables?: VariableDefinition[]
): Promise<NewmanResponse | undefined> {
  try {
    return await new Promise((resolve, reject) => {
      newman
        .run({
          collection: collection,
          insecure: true,
          globals: globalVariables ? { ...globalVariables } : {},
          environment: environmentVariables ? { ...environmentVariables } : {},
        })
        .on('start', (err, args) => {
          log.result(`running a collection ...`);
        })
        .on('done', (err, summary) => {
          if (err || summary.error) {
            log.error(`collection run encountered an error.`);
            reject(err);
          } else {
            const response = {
              httpResponseCode: summary.run.executions[0].response.code,
              responseData: summary.run.executions[0].response.stream.toString(),
            };
            resolve(response);
          }
        });
    });
  } catch (error) {
    log.error(error);
  }
}

let collectionData: Collection[] = [];
let filteredCollection: any;

const collectionMetadata = await getCollectionMetadata();
if (collectionMetadata) {
  const collections = await getCollectionData(collectionMetadata);
  if (collections) {
    collectionData.push(...collections);
    filteredCollection = filterCollection('Node Requests', collectionData);
    console.log(filteredCollection);
  }
}
const environmentData = await getEnvironmentData();

// if (collectionData && environmentData) {
//   for (const collection of collectionData) {
//     if (collection.collection.info.name === 'JSON Placeholder') {
//       console.log(collection.collection);
//     }
//   }
// }

// log.result(`Collection Data: ${JSON.stringify(collectionData)}`);
// log.result(`Environment Data: ${JSON.stringify(environmentData)}`);
