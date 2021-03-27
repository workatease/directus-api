/*
|-----------------------------------|
| Endpoint         |   Method       |
|-----------------------------------|
| /custom/register |   POST         |
|-----------------------------------|

Body


register user and send email verification email flow
    1) Register User with firstName and lastName and email
    2) Send Email with verification link
    3) Verify with Password use existing verify supported by directus


  Env Variables  
  INVITE_TOKEN_EXPIRE_IN: 1d --> default 7days
  REGISTER_USER_ROLE: --> default user

  Permissions:
        Role read permission for public - use custom permission for even granular access 
*/
module.exports = function registerEndpoint(router, { services, env, exceptions, database }) {
  // @TODO need it to take from context once it is implemented by directus
  const asyncHandler = require("directus/dist/utils/async-handler").default;
  const response = require("directus/dist/middleware/respond").respond;
  const RecordNotUniqueException = require("directus/dist/exceptions/database/record-not-unique")
    .RecordNotUniqueException;
  const logger = require("directus/dist/logger").default;
  const sendInviteMail = require("./mail").default;
  const jwt = require("jsonwebtoken");

  const { InvalidCredentialsException, ServiceUnavailableException } = exceptions;
  const { UsersService, RolesService } = services;
  router.post(
    "/",
    asyncHandler(async (req, res, next) => {
      try {
        const userService = new UsersService({ schema: req.schema, accountability: req.accountability });
        const roleService = new RolesService({ schema: req.schema, accountability: req.accountability });

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
        await userService.create(user);
        const expiresIn = env.INVITE_TOKEN_EXPIRE_IN || "7d";
        const payload = { email, scope: "invite" };
        const token = jwt.sign(payload, env.SECRET, { expiresIn });
        const inviteURL = url ?? env.PUBLIC_URL + "/admin/accept-invite";
        const acceptURL = inviteURL + "?token=" + token;
        const projectInfo = await database.select(["project_name", "project_logo"]).from("directus_settings").first();

        await sendInviteMail(env, projectInfo, user, acceptURL, expiresIn);
        res.locals.payload = { success: true };
        return next();
      } catch (error) {
        if (error instanceof RecordNotUniqueException) {
          throw new InvalidCredentialsException("Email id is already registered");
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
