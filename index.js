const { configExists, configNotExists } = require("./helpers");
const { Command } = require("commander");
const chalk = require("chalk");

const SetConfig = require("./lib/SetConfig");

const GetBucket = require("./utils/GetBucket");
const ListObject = require("./utils/ListObject");
const DownloadObject = require("./utils/DownloadObject");

const program = new Command();

program
  .command("config")
  .description("Set config your Minio")
  .option("-ep, --endpoint <endpoint>", "Minio end point")
  .option("-p, --port <port>", "Minio port")
  .option("-e, --ssl <boolean>", "Minio HTTP (false) or HTTPS(true)")
  .option("-ak, --accesskey <accesskey>", "Minio access key")
  .option("-sk, --secretkey <secretkey>", "Minio secret key")
  .option("-r, --region <region>", "Minio region")
  .action((str, { _optionValues: args }) => {
    SetConfig(args);
  });

program
  .command("lb")
  .description("List of all buckets")
  .action(() => {
    if (!configExists()) return configNotExists();

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

    if (!configExists()) return configNotExists();

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

    if (!configExists()) return configNotExists();

    DownloadObject(args.bucket, args.zip, args.remove);
  });

program.parse(process.argv);
