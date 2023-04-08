const { parseConfig } = require("../helpers");
const fs = require("fs");
const chalk = require("chalk");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const SyncBucket = async (source, destination, withRemove) => {
  const originalConfig = parseConfig().useConfig;

  const [sConfig, sBucket] = source.split(":");
  const [dConfig, dBucket] = destination.split(":");

  if (sConfig === dConfig) {
    return console.log(chalk.red("Config number must be different!"));
  }

  console.log(
    "Source Config =>",
    chalk.green(parseConfig().configs[sConfig].MINIO_END_POINT),
  );
  console.log("Source Bucket =>", chalk.green(sBucket));
  console.log("---------------------------------");
  console.log(
    "Destination Config =>",
    chalk.green(parseConfig().configs[dConfig].MINIO_END_POINT),
  );
  console.log("Destination Bucket =>", chalk.green(dBucket), "\n");

  try {
    // use source config
    await exec(`node index cu ${sConfig}`);

    // download from source bucket
    await exec(`node index db -b ${sBucket}`);

    // use destination config
    await exec(`node index cu ${dConfig}`);

    // upload to destination bucket
    await exec(`node index ub -s ./downloads/${sBucket} -b ${dBucket}`);
    await exec(`node index cu ${originalConfig}`);

    console.log(chalk.bgGreen("Success to sync bucket..."));

    if (withRemove) {
      console.log(`\n${chalk.bgBlue("Start remove folder...")}`);

      const folderPath = `./downloads/${sBucket}`;
      fs.rmSync(folderPath, { recursive: true, force: true });

      console.log(`Folder '${chalk.green(folderPath)}' removed`);
      console.log(`${chalk.bgBlue("Finish remove folder...")}`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = SyncBucket;
