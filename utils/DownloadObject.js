const MinioClient = require("../lib/MinioClient");
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const zip = new JSZip();

const downloadFile = (objectName, bucketName) => {
  return new Promise((resolve) => {
    MinioClient.fGetObject(
      "pnm-dashboard",
      objectName,
      `./downloads/${bucketName}/${objectName}`,
      (err) => {
        const dots = ".".repeat(50 - objectName.length);

        if (err) console.log(`${objectName}${dots}${chalk.red("FAILED")}`);
        console.log(`${objectName}${dots}${chalk.green("SUCCESS")}`);
        resolve(true);
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

const DownloadObject = (bucketName, withZip = false) => {
  let data = [];

  const stream = MinioClient.listObjects(bucketName, "", true);

  stream.on("data", (obj) => {
    data.push(obj);
  });

  stream.on("end", async () => {
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

          console.log(`${chalk.bgBlue("End zip...")}`);
        });
    }
  });

  stream.on("error", (err) => {
    console.log(err);
  });
};

module.exports = DownloadObject;
