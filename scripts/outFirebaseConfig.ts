import { promises as fsPromises } from 'fs'
const firebaseTools = require('firebase-tools');

const env = process.argv[2];
console.log('env:', env);

(async () => {
  const firebaseRC = JSON.parse(await fsPromises.readFile('./.firebaserc', 'utf-8'));
  const projectId = firebaseRC.projects[env];
  console.log('projectId:', projectId);
  await firebaseTools.use(projectId, {});
  const apps = await firebaseTools.apps.list('WEB', {});
  const currentApp = apps[0];
  const config = await firebaseTools.apps.sdkconfig('WEB', currentApp.appId, {});
  console.log(config.sdkConfig);
  await fsPromises.writeFile('./config/sdkConfig.json', JSON.stringify(config.sdkConfig, null, 2));
})();
