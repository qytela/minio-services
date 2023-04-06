const MinioClient = require("../lib/MinioClient");
const chalk = require("chalk");
const { table } = require("table");

const convertBytesToMB = (bytes) => {
  const mb = 1024 * 1024;
  const fileSizeInMB = bytes / mb;
  return fileSizeInMB.toFixed(2);
};

const ListObject = (bucketName, numLimit = 10) => {
  const limit = parseInt(numLimit);
  const stream = MinioClient.listObjects(bucketName, "", true);

  let data = [];

  stream.on("data", function (obj) {
    data.push(obj);
  });

  stream.on("end", function (obj) {
    const tableData = [
      ["OBJECT NAME", "OBJECT SIZE (MB)"],
      ...data
        .map((item, index) => {
          if (index < limit) {
            return [item.name, convertBytesToMB(item.size)];
          }
        })
        .filter((i) => i !== undefined),
    ];

    const config = {
      columns: {
        0: { alignment: "left" },
        1: { alignment: "right" },
      },
    };

    if (limit < data.length) {
      tableData.push([chalk.green(`${data.length - limit} more files...`), 0]);
    }

    const output = table(tableData, config);
    console.log(output);
  });

  stream.on("error", function (err) {
    console.log(err);
  });
};

module.exports = ListObject;
