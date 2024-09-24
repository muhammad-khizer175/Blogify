const JWT = require("jsonwebtoken")
const secret = "Galaxy$20"

let convertPayloadToToken = (user) =>{

    let payload = {
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role

    }
  return JWT.sign(payload,secret)
}

let convertTokenToPayload = (token) =>{
    return JWT.verify(token,secret)
}

module.exports = {
    convertPayloadToToken,
    convertTokenToPayload,
}