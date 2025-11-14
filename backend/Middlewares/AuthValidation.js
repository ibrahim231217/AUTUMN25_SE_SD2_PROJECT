const joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(30).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Bad Request bro!", error: error.details[0].message });
  }
  next();
};

// Login Validation
const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).max(30).required(),
  });


  
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Bad Request broo", error: error.details[0].message });
  }
  next();
};

module.exports = { signupValidation, loginValidation };
