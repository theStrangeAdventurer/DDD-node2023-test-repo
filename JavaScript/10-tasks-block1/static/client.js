'use strict';

const transport = {
  ws: {
    createClient(url, structure) {
      const api = {};
      const services = Object.keys(structure);
      const socket = new WebSocket(url);
      for (const serviceName of services) {
        api[serviceName] = {};
        const service = structure[serviceName];
        const methods = Object.keys(service);
        for (const methodName of methods) {
          api[serviceName][methodName] = (...args) => new Promise((resolve) => {
            const packet = { name: serviceName, method: methodName, args };
            socket.send(JSON.stringify(packet));
            socket.onmessage = (event) => {
              const data = JSON.parse(event.data);
              resolve(data);
            };
          });
        }
      }
      return { api, socket };
    }
  },
  http: {
    createClient(url, structure) {
      const api = {};
      const services = Object.keys(structure);
      const urlParams = ['id', 'mask'];

      const requestMaker = async (urlParts = [], body = {}) => {
        const response = await fetch(
          `${url}/${urlParts.join('/')}`,
          { method: 'POST', body: JSON.stringify(body)
        });

        if (response.status !== 200)
          throw new Error();

        return response.json();
      };

      for (const serviceName of services) {
        api[serviceName] = {};
        const service = structure[serviceName];
        const methods = Object.keys(service);
        for (const methodName of methods) {
          api[serviceName][methodName] = (...args) => {
            const urlParts = [
              serviceName,
              methodName
            ];

            let body = {};

            for (const [index, argName] of structure[serviceName][methodName].entries()) {
              if (urlParams.includes(argName))
                urlParts.push(args[index])
              else
                body = Object.assign(body, args[index]);
            }
            return requestMaker(urlParts, body);
          };
        }
      }
      return { api };
    }
  } 
}

const scaffold = (url, structure) => {
  /**
   * @type {'ws' | 'http'}
   */
  const protocol = url.split(':')[0];

  if (!transport[protocol])
    throw new Error(`Unsupported transport protocol: ${protocol}`);

  return Object.assign(transport[protocol].createClient(url, structure), { transport: protocol });
};

// TODO: Не хватает метаданных:
// какие из полей должны использоваться как часть url
// А какие должны передаваться как body
const structure = {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  country: {
    read: ['id'],
    delete: ['id'],
    find: ['mask'],
  },
};

const wsUrl = 'ws://127.0.0.1:8001';
const httpUrl = 'http://127.0.0.1:8001';

const { api, socket, transport: createdClientTransport } = scaffold(httpUrl, structure);

switch (createdClientTransport) {
  case 'ws':
    socket.addEventListener('open', async () => {
      const data = await api.user.read(3);
      console.dir({ data, transport: createdClientTransport });
    });
    break;
  case 'http':
    (async function () {
      const data = await api.user.read(1);
      console.dir({ data, transport: createdClientTransport });
    })();
    break;
  default:
    throw new Error('Unknown transport');
}
