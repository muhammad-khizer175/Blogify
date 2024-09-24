const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { convertPayloadToToken } = require("../services/auth");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
    default: "/images/default.png",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
} , {timestamps:true});

// In this pre when user is saved before the user is saved this function runs
// avoid using arrow functions in pre.
userSchema.pre("save", function (next) {
  // this referes to the user is in between to be saved
  let user = this;
  
// isModified method explicitly marks the property, so that it can be calculated as updated.
// if (!user.isModified("password")) return; here we are checking that whether our updated value is calculated or not.
// Writing only return returns undefined which is same as writing nothing which automaticly return undefined.
  if (!user.isModified("password")) return;

  let salt = randomBytes(16).toString();

  let hashedPassword = createHmac("sha256", salt)
  // user.password is the password provided by the user that will be hashed
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  let user = await this.findOne({ email });
  if (!user) throw new Error("user not found!");

  //  password that is provided by user not hashed one we will hash it and the compare the provided one and the real one.
  // sha256 is alogorithm while salt is secret

  let providedHashedPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (providedHashedPassword !== user.password)
    throw new Error("incorrect password!");

  let token = convertPayloadToToken(user)
 
  return token
});

const User = model("user", userSchema);

module.exports = User;
