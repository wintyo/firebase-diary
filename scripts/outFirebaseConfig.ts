import { promises as fsPromises } from 'fs'
const firebaseTools = require('firebase-tools');

(async () => {
  const apps = await firebaseTools.apps.list('WEB', {});
  console.log(apps);
  const currentApp = apps[0];
  const config = await firebaseTools.apps.sdkconfig('WEB', currentApp.appId, {});
  console.log(config);
  await fsPromises.writeFile('./config/sdk.json', JSON.stringify(config.sdkConfig, null, 2));
})();
