const MinioClient = require("../lib/MinioClient");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const uploadMinio = (bucketName, objectName, filePath) => {
  const metaData = {};

  return new Promise((resolve, reject) => {
    MinioClient.fPutObject(
      bucketName,
      objectName,
      filePath,
      metaData,
      (err, obj) => {
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

const walkDir = async (dirPath, absolutePath, bucketName) => {
  const uploadPromises = [];

  const fsStat = fs.statSync(dirPath);
  if (fsStat.isDirectory()) {
    const fsReadDir = fs.readdirSync(dirPath);

    fsReadDir.forEach((file) => {
      const pathJoin = path.join(dirPath, file);
      const stat = fs.statSync(pathJoin);
      if (stat.isDirectory()) {
        uploadPromises.push(walkDir(pathJoin, absolutePath, bucketName));
      } else if (stat.isFile()) {
        const relativePath = path.relative(absolutePath, dirPath);
        const objectName = path.join(relativePath, file).replace(/\\/g, "/");
        const filePath = pathJoin.replace(`${__dirname}/`, "");

        const uploadPromise = new Promise((resolve, reject) => {
          uploadMinio(bucketName, objectName, filePath)
            .then(() => resolve())
            .catch(() => reject());
        });
        uploadPromises.push(uploadPromise);
      }
    });
  } else if (fsStat.isFile()) {
    const uploadPromise = new Promise((resolve, reject) => {
      uploadMinio(bucketName, dirPath, dirPath)
        .then(() => resolve())
        .catch(() => reject());
    });
    uploadPromises.push(uploadPromise);
  }

  await Promise.all(uploadPromises);
};

const UploadObject = async (directoryPath, bucketName) => {
  if (!fs.existsSync(directoryPath)) {
    return console.log(chalk.red("Path not exists!"));
  }

  const bucketExists = await MinioClient.bucketExists(bucketName);
  if (!bucketExists) {
    return console.log(chalk.red("Bucket not exists!"));
  }

  const fsStat = fs.statSync(directoryPath);
  if (fsStat.isDirectory()) {
    console.log("Path =>", chalk.green(directoryPath));
  } else if (fsStat.isFile()) {
    console.log("File =>", chalk.green(directoryPath));
  }

  console.log("Bucket =>", chalk.green(bucketName));

  console.log(chalk.bgBlue("\nStart uploading all objects..."));
  walkDir(directoryPath, directoryPath, bucketName).then(() => {
    console.log(chalk.bgBlue("Finish uploading all objects..."));
  });
};

module.exports = UploadObject;
