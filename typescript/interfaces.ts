import { Logger } from './logger';

const log = new Logger();

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address | Address[];
  phone: string;
  website: string;
  company: Company;
  logCompany?: (company: Company) => void;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

const logUserAddress = (userAddress: Address | Address[]) => {
  if (Array.isArray(userAddress)) {
    log.result(`The user has ${userAddress.length} addresses`);
    for (const [index, address] of userAddress.entries()) {
      log.result(`The user's address ${index + 1} is ${address.street} ${address.suite}`);
    }
  } else {
    log.result(`The user's address is ${userAddress.street} ${userAddress.suite}`);
  }
};

const getUser = (users: User[]) => {
  for (const user of users) {
    log.result(`The user's name is ${user.name}`);
    log.result(`The user's phone number is ${user.phone}`);
    logUserAddress(user.address);
    user.logCompany?.(user.company);
  }
};

getUser([
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: [
      {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496',
        },
      },
      {
        street: 'Random Street',
        suite: 'Apt. 321',
        city: 'Attenborough',
        zipcode: '93187-4259',
        geo: {
          lat: '-37.9911',
          lng: '82.0137',
        },
      },
    ],
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
    logCompany: (company) => {
      log.result(company.name);
    },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    address: {
      street: 'Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566-7771',
      geo: {
        lat: '-43.9509',
        lng: '-34.4618',
      },
    },
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    company: {
      name: 'Deckow-Crist',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains',
    },
  },
]);
