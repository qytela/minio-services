const fs = require("fs");
const chalk = require("chalk");
const { exec } = require("child_process");

const CopyBucket = (source, destination, withRemove) => {
  console.log("Source Bucket =>", chalk.green(source));
  console.log("Destination Bucket =>", chalk.green(destination), "\n");

  exec(`node index db -b ${source}`, (errDownload, outputDownload) => {
    if (errDownload) {
      return console.log(errDownload);
    }
    if (/Bucket not exists!/g.test(outputDownload)) {
      return console.log(chalk.red(outputDownload));
    }

    exec(
      `node index ub -s ./downloads/${source} -b ${destination}`,
      (errUpload, outputUpload) => {
        if (errUpload) {
          return console.log(errUpload);
        }

        console.log(chalk.bgGreen("Success to sync bucket..."));

        if (withRemove) {
          console.log(`\n${chalk.bgBlue("Start remove folder...")}`);

          const folderPath = `./downloads/${source}`;
          fs.rmSync(folderPath, { recursive: true, force: true });

          console.log(`Folder '${chalk.green(folderPath)}' removed`);
          console.log(`${chalk.bgBlue("Finish remove folder...")}`);
        }
      },
    );
  });
};

module.exports = CopyBucket;
