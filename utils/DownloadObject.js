const MinioClient = require("../lib/MinioClient");
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const zip = new JSZip();

const downloadFile = (objectName, bucketName) => {
  return new Promise((resolve, reject) => {
    MinioClient.fGetObject(
      bucketName,
      objectName,
      `./downloads/${bucketName}/${objectName}`,
      (err) => {
        const dots = ".".repeat(
          Math.max(process.stdout.columns - objectName.length - 7, 0),
        );

        if (err) {
          console.log(err);
          console.log(`${objectName}${dots}${chalk.red("FAILED")}`);
          reject();
        } else {
          console.log(`${objectName}${dots}${chalk.green("SUCCESS")}`);
          resolve();
        }
      },
    );
  });
};

const traverseFolder = (dir, zipFolder) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const fileContent = fs.readFileSync(filePath);
      zipFolder.file(file, fileContent);
    } else if (stat.isDirectory()) {
      const newZipFolder = zipFolder.folder(file);
      traverseFolder(filePath, newZipFolder);
    }
  });
};

const DownloadObject = async (
  bucketName,
  withZip = false,
  withRemove = false,
) => {
  const bucketExists = await MinioClient.bucketExists(bucketName);
  if (!bucketExists) {
    return console.log(chalk.red("Bucket not exists!"));
  }

  let data = [];

  const stream = MinioClient.listObjects(bucketName, "", true);

  stream.on("data", (obj) => {
    data.push(obj);
  });

  stream.on("end", async () => {
    console.log("Path =>", chalk.green(`./downloads/${bucketName}\n`));
    console.log(chalk.bgBlue("Start downloading all objects..."));

    await Promise.all(
      data.map(async (obj) => {
        await downloadFile(obj.name, bucketName);
      }),
    );

    console.log(chalk.bgBlue("Finish downloading all objects..."));

    if (withZip) {
      console.log(`\n${chalk.bgBlue("Start zip...")}`);

      const folderPath = `./downloads/${bucketName}`;
      const outputFileName = `./downloads/${bucketName}.zip`;

      traverseFolder(folderPath, zip);

      zip
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(fs.createWriteStream(outputFileName))
        .on("finish", () => {
          console.log(
            `Folder '${chalk.green(folderPath)}' success zip to '${chalk.green(
              outputFileName,
            )}'`,
          );

          console.log(`${chalk.bgBlue("Finish zip...")}`);
        });
    }

    if (withRemove) {
      console.log(`\n${chalk.bgBlue("Start remove folder...")}`);

      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`Folder '${chalk.green(folderPath)}' removed`);

      console.log(`${chalk.bgBlue("Finish remove folder...")}`);
    }
  });

  stream.on("error", (err) => {
    console.log(err);
  });
};

module.exports = DownloadObject;
