const { parseConfig, configExists, configNumberExists } = require("../helpers");
const Minio = require("minio");

const MinioClient = () => {
  if (configExists() && configNumberExists()) {
    const config = parseConfig().configs[parseConfig().useConfig];

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

module.exports = MinioClient();
