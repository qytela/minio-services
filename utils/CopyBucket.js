const fs = require("fs");
const chalk = require("chalk");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const CopyBucket = async (source, destination, withRemove) => {
  console.log("Source Bucket =>", chalk.green(source));
  console.log("Destination Bucket =>", chalk.green(destination), "\n");

  try {
    const { stdout: outputDownload } = await exec(`node index db -b ${source}`);
    if (/Bucket not exists!/g.test(outputDownload)) {
      return console.log(chalk.red(outputDownload));
    }

    await exec(`node index ub -s ./downloads/${source} -b ${destination}`);
    console.log(chalk.bgGreen("Success to sync bucket..."));

    if (withRemove) {
      console.log(`\n${chalk.bgBlue("Start remove folder...")}`);

      const folderPath = `./downloads/${source}`;
      fs.rmSync(folderPath, { recursive: true, force: true });

      console.log(`Folder '${chalk.green(folderPath)}' removed`);
      console.log(`${chalk.bgBlue("Finish remove folder...")}`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = CopyBucket;
