const { convertTokenToPayload } = require("../services/auth");

let checkForAuthenticationToken = (tokenName) => {
  return (req, res, next) => {
    let cookieTokenValue = req.cookies[tokenName];
    // if no cookie means he is not a user so we will call next
    if (!cookieTokenValue) return next();

    try {
      let userPayload = convertTokenToPayload(cookieTokenValue);
      req.user = userPayload;
    } catch (error) {}

    return next();
  };
};

module.exports = {
  checkForAuthenticationToken,
};
