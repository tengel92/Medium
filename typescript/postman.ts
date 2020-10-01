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

function filterCollection(collectionName: string, collections: any[]): Collection | undefined {
  return collections.find((collection: any) => collection.info.name === collectionName);
}

function filterRequest(requestName: string, collection: any): Collection | undefined {
  const specificRequest = collection.item.find((item: any) => item.name === requestName);
  collection.item = specificRequest;
  return collection;
}

async function getCollectionData(collectionMetadata: PostmanMetadata[]): Promise<Collection[] | undefined> {
  try {
    const promiseArray: Promise<AxiosResponse<any>>[] = [];
    for (const collection of collectionMetadata) {
      promiseArray.push(
        axios.get(`https://api.getpostman.com/collections/${collection.uid}?apikey=${POSTMAN_API_KEY}`)
      );
    }
    const allResponses = await Promise.allSettled(promiseArray);
    const collectionData: Collection[] = [];
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

async function getAllPostmanData(): Promise<[Collection[], PostmanMetadata[]]> {
  let collectionData: Collection[] = [];
  let environmentData: PostmanMetadata[] = [];

  const collectionMetadata = await getCollectionMetadata();
  if (collectionMetadata) {
    const collections = await getCollectionData(collectionMetadata);
    if (collections) {
      collectionData.push(...collections);
    }
  }

  const environmentQuery = await getEnvironmentData();
  if (environmentQuery) {
    environmentData.push(...environmentQuery);
  }

  return [collectionData, environmentData];
}

const [collectionData, environmentData] = await getAllPostmanData();
// console.log(`Collections: `, JSON.stringify(collectionData));
// console.log(`Environments: `, JSON.stringify(environmentData));

const filteredCollection = filterCollection('Node Requests', collectionData);
if (filteredCollection) {
  const filteredRequest = filterRequest('getAllUsers', filteredCollection);
  if (filteredRequest) {
    const response = await executeNewmanRequest(filteredRequest);
    log.result(`Response: ${response?.responseData}`);
  }
}
