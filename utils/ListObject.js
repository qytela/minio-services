const MinioClient = require("../lib/MinioClient");
const { convertBytesToMB } = require("../helpers");
const chalk = require("chalk");
const { table } = require("table");

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
