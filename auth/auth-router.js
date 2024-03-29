const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;

const router = require("express").Router();

const helper = require("../router/helper");

router.post("/register", (req, res) => {
  const credentials = req.body;
  console.log(req.body);
  credentials.id = uuid();
  if (isValid(credentials)) {
    const rounds = Number(process.env.BCRYPT_ROUNDS) || 8;

    const hash = bcryptjs.hashSync(credentials.password, rounds);
    console.log("post hash");
    credentials.password = hash;

    helper
      .add(credentials, "user")
      .then((user) => {
        const token = makeJwt(user);

        res.status(201).json({ data: user, token });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: error });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    helper
      .findBy({ username }, "user")
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeJwt(user);

          res.status(200).json({
            message: "login successful",
            token,
            role: user.role,
            user,
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

function makeJwt({ id, username, role }) {
  const payload = {
    username,
    role,
    subject: id,
  };
  const config = {
    jwtSecret: process.env.JWT_SECRET || "is it secret, is it safe?",
  };
  const options = {
    expiresIn: "8 hours",
  };

  return jwt.sign(payload, config.jwtSecret, options);
}

function isValid(user) {
  return Boolean(
    user.username && user.password && typeof user.password === "string"
  );
}

module.exports = router;
