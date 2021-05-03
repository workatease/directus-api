/**
 * @type {import('directus/dist/types').HookRegisterFunction}
 *
 */
module.exports = function registerHook({ env, exceptions, services }) {
  const ffmpeg = require("fluent-ffmpeg");
  const logger = require("directus/dist/logger").default;
  const utils = require("./utils");
  const ffprobeStatic = require("ffprobe-static");
  const ffmpegPath = require("ffmpeg-static");
  const getAudioDurationInSeconds = require("get-audio-duration").getAudioDurationInSeconds;
  ffmpeg.setFfmpegPath(ffmpegPath);
  ffmpeg.setFfprobePath(ffprobeStatic.path);

  return {
    "files.update": async function ({ item, accountability, schema, database, payload, collection }) {
      const { AssetsService, FilesService } = services;
      const options = { knex: database, accountability, schema, collection };
      const assetService = new AssetsService(options);
      const fileService = new FilesService(options);
      const key = item[0];
      if (payload.type && payload.type.startsWith("video/")) {
        const buffer = await assetService.getAsset(key, {});
        let data = {};
        ffmpeg.ffprobe(buffer.stream, async function (err, metadata) {
          if (err) {
            logger.warn(`Couldn't extract MetaData information from file: ${key}`);
            logger.warn(err);
          }
          if (metadata) {
            data.height = utils.getHeight(metadata.streams);
            data.width = utils.getWidth(metadata.streams);
            data.metadata = JSON.stringify(metadata);
            data.duration = utils.getVideoDuration(metadata.streams);

            await fileService.updateOne(key, data);
          }
        });
      }
      if (payload.type && payload.type.startsWith("audio/")) {
        /**
         * @TODO
         *  still testing
         */
        const buffer = await assetService.getAsset(key, {});
        let data = {};
        data.duration = await getAudioDurationInSeconds(buffer.stream);
        await fileService.updateOne(key, data);
      }
    },
  };
};
