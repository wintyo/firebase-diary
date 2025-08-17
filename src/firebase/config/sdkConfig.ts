import demoConfig from "./sdkConfig.demo.json";
import prodConfig from "./sdkConfig.prod.json";

import type { FirebaseOptions } from "firebase/app";

const config: FirebaseOptions = (() => {
  switch (import.meta.env.MODE) {
    case "production":
      return prodConfig;
    default:
      return demoConfig;
  }
})();

export default config;
