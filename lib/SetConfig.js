const fs = require("fs");
const chalk = require("chalk");

const SetConfig = (args) => {
  console.log(args);

  const configFile = "./config.json";

  if (!fs.existsSync(configFile)) {
    fs.copyFileSync("./config.example.json", configFile);
  }

  const configData = fs.readFileSync(configFile);
  const config = JSON.parse(configData);

  if (args.endpoint) config.MINIO_END_POINT = args.endpoint;
  if (args.port) config.MINIO_PORT = parseInt(args.port);
  if (args.ssl) {
    const ssl = args.ssl === "true";
    config.MINIO_USE_SSL = ssl;
  }
  if (args.accesskey) config.MINIO_ACCESS_KEY = args.accesskey;
  if (args.secretkey) config.MINIO_SECRET_KEY = args.secretkey;
  if (args.region) config.MINIO_REGION = args.region;

  console.log(chalk.bgGreen("Success set config..."));

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
};

module.exports = SetConfig;
