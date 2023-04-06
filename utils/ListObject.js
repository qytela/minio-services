const MinioClient = require("../lib/MinioClient");
const { table } = require("table");

const convertBytesToMB = (bytes) => {
  const mb = 1024 * 1024;
  const fileSizeInMB = bytes / mb;
  return fileSizeInMB.toFixed(2);
};

const ListObject = (bucketName) => {
  const stream = MinioClient.listObjects(bucketName, "", true);

  let data = [];

  stream.on("data", function (obj) {
    data.push(obj);
  });

  stream.on("end", function (obj) {
    const tableData = [
      ["OBJECT NAME", "OBJECT SIZE (MB)"],
      ...data.map((item) => {
        return [item.name, convertBytesToMB(item.size)];
      }),
    ];

    const config = {
      columns: {
        0: { alignment: "left" },
        1: { alignment: "right" },
      },
    };

    const output = table(tableData, config);
    console.log(output);
  });

  stream.on("error", function (err) {
    console.log(err);
  });
};

module.exports = ListObject;
