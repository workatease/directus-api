// extensions/hooks/google-recaptcha-v2/index.js
module.exports = function registerHook({ env, exceptions }) {
  const querystring = require("querystring");
  const axios = require("axios");
  const { BaseException } = exceptions;
  const VERIFY_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify";
  return {
    "auth.login.before": async function (input) {
      // @TODO
      // make sure the some endpoints has to be validated
      // like a list of url if it does not have a re captcha response then fail the request
      if (
        env.RECAPTCHA_SECRET_KEY === undefined ||
        env.RECAPTCHA_SECRET_KEY === null ||
        env.RECAPTCHA_SECRET_KEY === ""
      ) {
        throw new BaseException("key is missing", 500, "");
      }
      const captcha = input["g-recaptcha-response"];
      if (captcha) {
        const postBody = querystring.stringify({
          secret: env.RECAPTCHA_SECRET_KEY,
          response: captcha,
          remoteip: input?.ip || undefined,
        });
        const response = await axios.post(VERIFY_ENDPOINT, postBody);
        const { data } = response;
        if (data.success === false) {
          throw new BaseException(data["error-codes"], 400, "RECAPTCHA_FAILURE");
        }
      }
    },
  };
};
