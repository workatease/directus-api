/**
 * @type {import('directus/dist/types').EndpointRegisterFunction}
 *
 */
module.exports = function registerEndpoint(router, { services, env, exceptions, database }) {
  // @TODO need it to take from context once it is implemented by directus
  const asyncHandler = require("directus/dist/utils/async-handler").default;
  const response = require("directus/dist/middleware/respond").respond;
  const RecordNotUniqueException = require("directus/dist/exceptions/database/record-not-unique")
    .RecordNotUniqueException;
  const logger = require("directus/dist/logger").default;

  const jwt = require("jsonwebtoken");

  const { ServiceUnavailableException } = exceptions;
  const { UsersService, RolesService, MailService } = services;
  router.post(
    "/",
    asyncHandler(async (req, res, next) => {
      try {
        const userService = new UsersService({ schema: req.schema, accountability: req.accountability });
        const roleService = new RolesService({ schema: req.schema, accountability: req.accountability });
        const mailService = new MailService({ schema: req.schema, accountability: req.accountability });
        const url = env.INVITE_URL;
        const role = await roleService
          .readSingleton({
            fields: ["*"],
            filter: {
              name: {
                _eq: env.REGISTER_USER_ROLE || "user",
              },
            },
          })
          .then((results) => {
            return results;
          });
        const { email, firsName, lastName } = req.body;
        const user = { email, role: role.id, first_name: firsName, last_name: lastName, status: "invited" };
        await userService.createOne(user);

        const expiresIn = env.INVITE_TOKEN_EXPIRE_IN || "7d";
        const payload = { email, scope: "invite" };
        const token = jwt.sign(payload, env.SECRET, { expiresIn });
        const inviteURL = url ?? env.PUBLIC_URL + "/admin/accept-invite";
        const acceptURL = inviteURL + "?token=" + token;
        const projectInfo = await database.select(["project_name", "project_logo"]).from("directus_settings").first();

        //  await sendInviteMail(env, projectInfo, user, acceptURL, expiresIn);
        const projectLogo = `${env.PUBLIC_URL}/assets/${projectInfo == null ? void 0 : projectInfo.project_logo}`;
        const data = {
          projectName: projectInfo == null ? void 0 : projectInfo.project_name,
          projectLogo,
          homepageUrl: env.PUBLIC_URL,
          firstName: user.first_name,
          lastName: user.last_name,
          activateUrl: acceptURL,
          email: user.email,
          url: projectLogo,
        };
        const template = { name: "activate-account", data };
        await mailService.send({ to: user.email, template, subject: "Activate your account" });
        res.locals.payload = { success: true };
        return next();
      } catch (error) {
        logger.error(error);
        if (error instanceof RecordNotUniqueException) {
          throw new ServiceUnavailableException("Email id is already registered");
        }
        throw error;

        // res.locals.payload = payload;
        // // throws the error correctly so left this the same
        // return next(error);
      }
    }),
    response
  );
};
