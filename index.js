const {
  parseConfig,
  configExists,
  configNumberExists,
  configNotExists,
} = require("./helpers");
const { Command } = require("commander");
const chalk = require("chalk");

const { NewConfig, SetConfig, ListConfig } = require("./lib/SetConfig");

const GetBucket = require("./utils/GetBucket");
const ListObject = require("./utils/ListObject");
const DownloadObject = require("./utils/DownloadObject");

const program = new Command();

program
  .command("config-list")
  .description("List config exists and current used")
  .action(() => {
    ListConfig();
  });

program
  .command("config-new")
  .description("Set new config Minio")
  .option("-ep, --endpoint <endpoint>", "Minio end point", "localhost")
  .option("-p, --port <port>", "Minio port", 9000)
  .option("-e, --ssl <boolean>", "Minio HTTP (false) or HTTPS(true)", false)
  .option("-ak, --accesskey <accesskey>", "Minio access key", "fansa")
  .option("-sk, --secretkey <secretkey>", "Minio secret key", "password")
  .option("-r, --region <region>", "Minio region", "us-east-1")
  .action((str, { _optionValues: args }) => {
    NewConfig(args);
  });

program
  .command("config-use")
  .description("Set config to use")
  .option("-n, --number <number>", "Choose config")
  .action((str, { _optionValues: args }) => {
    if (!args.number) {
      return console.log(chalk.red("Number required!"));
    }

    if (!configExists()) return configNotExists();
    if (!parseConfig().configs[args.number]) {
      console.log(chalk.red("Config number invalid!"));
      console.log(chalk.yellow("Set your config first..."));
      return;
    }

    SetConfig(args.number);
  });

program
  .command("lb")
  .description("List of all buckets")
  .action(() => {
    if (!configExists() || !configNumberExists()) return configNotExists();

    GetBucket();
  });

program
  .command("lo")
  .description("List of all objets")
  .option("-b, --bucket <bucket>", "Bucket name")
  .option("-l, --limit <limit>", "Limit to show all objects", 10)
  .action((str, { _optionValues: args }) => {
    if (!args.bucket) {
      return console.log(chalk.red("Bucket name required!"));
    }

    if (!configExists() || !configNumberExists()) return configNotExists();

    ListObject(args.bucket, args.limit);
  });

program
  .command("db")
  .description("Download all files from bucket")
  .option("-b, --bucket <bucket>", "Bucket name")
  .option("-z, --zip", "Compress to zip", false)
  .option("-r, --remove", "Remove folder after finish zip", false)
  .action((str, { _optionValues: args }) => {
    if (!args.bucket) {
      return console.log(chalk.red("Bucket name required!"));
    }

    if (!configExists() || !configNumberExists()) return configNotExists();

    DownloadObject(args.bucket, args.zip, args.remove);
  });

program.parse(process.argv);
