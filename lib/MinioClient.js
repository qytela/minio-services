const Minio = require("minio");
const fs = require("fs");

const MinioClient = () => {
  const configFile = "./config.json";

  if (fs.existsSync(configFile)) {
    const configData = fs.readFileSync(configFile);
    const config = JSON.parse(configData);

    return new Minio.Client({
      endPoint: config.MINIO_END_POINT,
      port: config.MINIO_PORT,
      useSSL: config.MINIO_USE_SSL,
      accessKey: config.MINIO_ACCESS_KEY,
      secretKey: config.MINIO_SECRET_KEY,
      region: config.MINIO_REGION,
    });
  }
};

module.exports = MinioClient;
