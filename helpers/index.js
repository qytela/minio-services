const fs = require("fs");
const chalk = require("chalk");

const convertBytesToMB = (bytes) => {
  const mb = 1024 * 1024;
  const fileSizeInMB = bytes / mb;
  return fileSizeInMB.toFixed(2);
};

const configExists = () => {
  const configFile = "./config.json";
  return fs.existsSync(configFile);
};

const configNotExists = () => {
  console.log(chalk.red("Config has not been set!"));
  console.log(
    "example =>",
    chalk.yellow(
      "node index config -ep localhost -p 9000 -e false -ak fansa -sk password -r us-east-1",
    ),
  );
};

module.exports = {
  convertBytesToMB,
  configExists,
  configNotExists,
};
