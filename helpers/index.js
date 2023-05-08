const fs = require("fs");
const chalk = require("chalk");

const configFileName = "./config.json";

const convertBytesToMB = (bytes) => {
  const mb = 1024 * 1024;
  const fileSizeInMB = bytes / mb;
  return fileSizeInMB.toFixed(2);
};

const parseConfig = () => {
  const configData = fs.readFileSync(configFileName);
  const config = JSON.parse(configData);

  return config;
};

const configExists = () => {
  return fs.existsSync(configFileName);
};

const configNumberExists = () => {
  const config = parseConfig();
  return config.configs[config.useConfig] !== undefined;
};

const configNotExists = () => {
  console.log(chalk.red("Config has not been set!"));
};

module.exports = {
  configFileName,

  convertBytesToMB,
  parseConfig,
  configExists,
  configNumberExists,
  configNotExists,
};
