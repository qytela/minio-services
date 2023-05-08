const MinioClient = require("../lib/MinioClient");
const moment = require("moment-timezone");
const { table } = require("table");

const GetBucket = () => {
  MinioClient.listBuckets(function (err, buckets) {
    if (err) return console.error(err);

    const tableData = [
      ["BUCKET NAME", "CREATED DATE"],
      ...buckets.map((bucket) => {
        const fDate = moment(bucket.creationDate).format("DD MMMM YYYY");
        return [bucket.name, fDate];
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
};

module.exports = GetBucket;
