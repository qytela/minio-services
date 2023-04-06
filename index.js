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
    GetBucket();
  });

program
  .command("lo")
  .description("List of all objets")
  .option("-b, --bucket <bucket>", "Bucket name")
  .action((str, { _optionValues: args }) => {
    if (!args.bucket) {
      return console.log(chalk.red("Bucket name required!"));
    }

    ListObject(args.bucket);
  });

program
  .command("db")
  .description("Download all files from bucket")
  .option("-b, --bucket <bucket>", "Bucket name")
  .option("-z, --zip <boolean>", "Compress to zip", false)
  .action((str, { _optionValues: args }) => {
    if (!args.bucket) {
      return console.log(chalk.red("Bucket name required!"));
    }

    DownloadObject(args.bucket, args.zip);
  });

program.parse(process.argv);
