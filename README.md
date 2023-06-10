# MinIO services command helper

Command helper for MinIO.

## Installation:

#### Clone `git` repository

```
git clone https://github.com/qytela/minio-services.git
```

## Usage:

`NodeJS`

```
node index help
```

```
Usage: node index [options] [command]

Options:
  -h, --help                    display help for command

Commands:
  config-list|cl                List config exists and current used
  config-new|cn [options]       Set new config
  config-use|cu <number>        Set config to use
  config-remove|cr <number>     Remove config
  list-bucket|lb                List of all buckets
  list-objcet|lo [options]      List of all objets
  download-bucket|db [options]  Download all files from bucket
  upload-bucket|ub [options]    Upload local files / folders to bucket
  copy-bucket|cb [options]      Copy from bucket one to another bucket (same config), short hand command download-bucket -> upload-bucket
  sync-bucket|sb [options]      Sync bucket from cloud one to another cloud (different config), CONFIG_NUMBER:BUCKET_NAME
  help [command]                display help for command
```
