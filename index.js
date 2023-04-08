#!/usr/bin/env node

const {
  parseConfig,
  configExists,
  configNumberExists,
  configNotExists,
} = require("./helpers");
const { Command } = require("commander");
const chalk = require("chalk");

const {
  NewConfig,
  SetConfig,
  RemoveConfig,
  ListConfig,
} = require("./lib/SetConfig");

const GetBucket = require("./utils/GetBucket");
const ListObject = require("./utils/ListObject");
const DownloadObject = require("./utils/DownloadObject");
const UploadObject = require("./utils/UploadObject");
const CopyBucket = require("./utils/CopyBucket");
const SyncBucket = require("./utils/SyncBucket");

const program = new Command();

program
  .command("config-list")
  .alias("cl")
  .description("List config exists and current used")
  .action(() => {
    if (!configExists()) return configNotExists();

    ListConfig();
  });

program
  .command("config-new")
  .alias("cn")
  .description("Set new config")
  .option("-ep, --endpoint <endpoint>", "Minio end point", "localhost")
  .option("-p, --port <port>", "Minio port", 9000)
  .option("-e, --ssl", "Minio HTTP (false) or HTTPS(true)", false)
  .option("-ak, --accesskey <accesskey>", "Minio access key", "fansa")
  .option("-sk, --secretkey <secretkey>", "Minio secret key", "password")
  .option("-r, --region <region>", "Minio region", "us-east-1")
  .action((str, { _optionValues: args }) => {
    NewConfig(args);
  });

program
  .command("config-use")
  .alias("cu")
  .usage("<number>")
  .description("Set config to use")
  .argument("<number>", "Select a configuration number")
  .action((str) => {
    if (!str) {
      return console.log(chalk.red("Number required!"));
    }

    const number = parseInt(str);

    if (!configExists()) return configNotExists();
    if (!parseConfig().configs[number]) {
      console.log(chalk.red("Config number invalid!"));
      console.log(chalk.yellow("Set your config first..."));
      return;
    }

    SetConfig(number);
  });

program
  .command("config-remove")
  .alias("cr")
  .usage("<number>")
  .description("Remove config")
  .argument("<number>", "Select a configuration number")
  .action((str) => {
    if (!str) {
      return console.log(chalk.red("Number required!"));
    }

    const number = parseInt(str);

    if (!parseConfig().configs[number]) {
      console.log(chalk.red("Config number invalid!"));
      console.log(chalk.yellow("Set your config first..."));
      return;
    }

    RemoveConfig(number);
  });

program
  .command("list-bucket")
  .alias("lb")
  .description("List of all buckets")
  .action(() => {
    if (!configExists() || !configNumberExists()) return configNotExists();

    GetBucket();
  });

program
  .command("list-objcet")
  .alias("lo")
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
  .command("download-bucket")
  .alias("db")
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

program
  .command("upload-bucket")
  .alias("ub")
  .description("Upload local files / folders to bucket")
  .option("-s, --source <source>", "Local source path")
  .option("-b, --bucket <bucket>", "Destination bucket name")
  .action((str, { _optionValues: args }) => {
    if (!args.source) {
      return console.log(chalk.red("Source path required!"));
    }
    if (!args.bucket) {
      return console.log(chalk.red("Bucket name required!"));
    }
    if (!configExists() || !configNumberExists()) return configNotExists();

    UploadObject(args.source, args.bucket);
  });

program
  .command("copy-bucket")
  .alias("cb")
  .description(
    "Copy from bucket one to another bucket (same config), short hand command download-bucket -> upload-bucket",
  )
  .option("-s, --source <source>", "Source bucket name")
  .option("-d, --destination <destination>", "Destination bucket name")
  .option(
    "-r, --remove",
    "Remove folder after finish copy (same as remove command download-bucket)",
    false,
  )
  .action((str, { _optionValues: args }) => {
    if (!args.source) {
      return console.log(chalk.red("Source path required!"));
    }
    if (!args.destination) {
      return console.log(chalk.red("Destination path required!"));
    }
    if (!configExists() || !configNumberExists()) return configNotExists();

    CopyBucket(args.source, args.destination, args.remove);
  });

program
  .command("sync-bucket")
  .alias("sb")
  .description(
    "Sync bucket from cloud one to another cloud (different config), CONFIG_NUMBER:BUCKET_NAME",
  )
  .option("-s, --source <source>", "Source bucket name (e.g: 0:bucket-one)")
  .option(
    "-d, --destination <destination>",
    "Destination bucket name (e.g: 1:another-bucket)",
  )
  .option(
    "-r, --remove",
    "Remove folder after finish sync (same as remove command download-bucket)",
    false,
  )
  .action((str, { _optionValues: args }) => {
    if (!args.source) {
      return console.log(chalk.red("Source path required!"));
    }
    if (!args.destination) {
      return console.log(chalk.red("Destination path required!"));
    }
    if (!configExists() || !configNumberExists()) return configNotExists();

    SyncBucket(args.source, args.destination, args.remove);
  });

program.parse(process.argv);
