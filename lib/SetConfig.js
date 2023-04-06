const { configFileName, parseConfig, configExists } = require("../helpers");
const fs = require("fs");
const chalk = require("chalk");
const { table } = require("table");

const NewConfig = (args) => {
  console.log(args);

  if (!configExists()) {
    fs.copyFileSync("./config.example.json", configFileName);
  }

  const config = parseConfig();

  let defaultConfig = {
    MINIO_END_POINT: "localhost",
    MINIO_PORT: 9000,
    MINIO_USE_SSL: false,
    MINIO_ACCESS_KEY: "fansa",
    MINIO_SECRET_KEY: "password",
    MINIO_REGION: "us-east-1",
  };

  config.configs.push(defaultConfig);

  if (args.endpoint) defaultConfig.MINIO_END_POINT = args.endpoint;
  if (args.port) defaultConfig.MINIO_PORT = parseInt(args.port);
  if (args.ssl) defaultConfig.MINIO_USE_SSL = args.ssl;
  if (args.accesskey) defaultConfig.MINIO_ACCESS_KEY = args.accesskey;
  if (args.secretkey) defaultConfig.MINIO_SECRET_KEY = args.secretkey;
  if (args.region) defaultConfig.MINIO_REGION = args.region;

  console.log(chalk.bgGreen("Config has been set..."));

  fs.writeFileSync(configFileName, JSON.stringify(config, null, 2));
};

const SetConfig = (number) => {
  const config = parseConfig();

  console.log(
    "Config =>",
    chalk.yellow(config.configs[number].MINIO_END_POINT),
  );

  config.useConfig = number;

  fs.writeFileSync(configFileName, JSON.stringify(config, null, 2));
  console.log(chalk.bgGreen("Config has been set..."));
};

const RemoveConfig = (number) => {
  const config = parseConfig();

  console.log(
    "Config =>",
    chalk.yellow(config.configs[number].MINIO_END_POINT),
  );

  config.configs.splice(number, 1);

  fs.writeFileSync(configFileName, JSON.stringify(config, null, 2));
  console.log(chalk.bgGreen("Config has been remove..."));
};

const ListConfig = () => {
  const tableData = [
    ["END POINT", "NUMBER"],
    ...parseConfig().configs.map((item, index) => {
      const isUse = parseConfig().useConfig === index;
      return [
        isUse ? chalk.green(item.MINIO_END_POINT) : item.MINIO_END_POINT,
        index,
      ];
    }),
  ];

  const config = {
    columns: {
      0: { alignment: "left" },
      1: { alignment: "right" },
    },
  };

  const output = table(tableData, config);
  console.log(output);
};

module.exports = {
  NewConfig,
  SetConfig,
  RemoveConfig,
  ListConfig,
};
