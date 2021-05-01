/**
 * @type {import('directus/dist/types').EndpointRegisterFunction}
 *
 */
module.exports = function registerEndpoint(router, { services, env, exceptions, database }) {
  // @TODO need it to take from context once it is implemented by directus
  const asyncHandler = require("directus/dist/utils/async-handler").default;
  const response = require("directus/dist/middleware/respond").respond;
  const logger = require("directus/dist/logger").default;
  const storage = require("directus/dist/storage").default;
  const { FilesService } = services;
  router.get(
    "/:pk",
    asyncHandler(async (req, res, next) => {
      try {
        const id = req.params.pk?.substring(0, 36);
        const options = { schema: req.schema, accountability: req.accountability };
        const filesService = new FilesService(options);
        const file = await filesService.readOne(id);
        const response = await storage.disk(file.storage).getSignedUrl(file.filename_disk);

        res.locals.payload = { success: true, signedUrl: response.signedUrl };
        return next();
      } catch (error) {
        logger.error(error);
        throw error;
      }
    }),
    response
  );
};
