"use strict";

exports.__esModule = true;
exports.default = void 0;

/* to be used until mail is provided as a service in directus
 * See the below discussion
 * https://github.com/directus/directus/discussions/4664
 *
 */
const getMailTransporter = async (env) => {
  const nodemailer = require("nodemailer");
  const logger = require("directus/dist/logger").default;
  const ServiceUnavailableException = require("directus/dist/exceptions/service-unavailable")
    .ServiceUnavailableException;
  let transporter = null;

  if (env.EMAIL_TRANSPORT === "sendmail") {
    transporter = nodemailer.createTransport({
      sendmail: true,
      newline: env.EMAIL_SENDMAIL_NEW_LINE || "unix",
      path: env.EMAIL_SENDMAIL_PATH || "/usr/sbin/sendmail",
    });
  } else if (env.EMAIL_TRANSPORT.toLowerCase() === "smtp") {
    transporter = nodemailer.createTransport({
      pool: env.EMAIL_SMTP_POOL,
      host: env.EMAIL_SMTP_HOST,
      port: env.EMAIL_SMTP_PORT,
      secure: env.EMAIL_SMTP_SECURE,
      auth: {
        user: env.EMAIL_SMTP_USER,
        pass: env.EMAIL_SMTP_PASSWORD,
      },
    });
  } else {
    logger.warn("Illegal transport given for email. Check the EMAIL_TRANSPORT env var.");
  }

  if (transporter) {
    await transporter
      .verify()
      .then((data) => console.log(data))
      .catch((error) => {
        if (error) {
          //Promise.reject("Could not send email... Please retry after some time ");
          throw new ServiceUnavailableException("Could not send email... Please retry after some time ");
          logger.warn(`Couldn't connect to email server.`);
          logger.warn(`Email verification error: ${error}`);
        } else {
          logger.info(`Email connection established`);
        }
      });
  }
  return transporter;
};

const sendInviteMail = async (env, projectInfo, user, acceptURL, expiresIn) => {
  try {
    const { Liquid } = require("liquidjs");

    const path = require("path");

    const liquidEngine = new Liquid({
      root: path.resolve(env.EXTENSIONS_PATH, "templates"),
      extname: ".liquid",
    });
    const projectLogo = `${env.PUBLIC_URL}/assets/${projectInfo == null ? void 0 : projectInfo.project_logo}`;
    const context = {
      projectName: projectInfo == null ? void 0 : projectInfo.project_name,
      projectLogo,
      homepageUrl: env.PUBLIC_URL,
      firstName: user.first_name,
      lastName: user.last_name,
      activateUrl: acceptURL,
      email: user.email,
      url: projectLogo,
    };
    const html = await liquidEngine.renderFile("activate-account", context);

    const transporter = await getMailTransporter(env);

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: user.email,
      html,
      subject: `[${projectInfo == null ? void 0 : projectInfo.project_name}] Activate your account`,
    });
  } catch (error) {
    throw error;
  }
};

var _default = sendInviteMail;
exports.default = _default;
