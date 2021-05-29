const router = require("express").Router();
const cloudinary = require("cloudinary").v2;

const helper = require("./helper");
const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.get("/", restricted, (req, res) => {
  helper
    .find("user")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.get("/:id", restricted, (req, res) => {
  const id = req.params.id;

  helper
    .findById(id, "user")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.get("/info/:username", restricted, (req, res) => {
  const username = req.params.username;

  helper
    .findBy({ username }, "user")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/", restricted, (req, res) => {
  helper
    .add(req.body, "user")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.put("/:id", restricted, (req, res) => {
  const id = req.params.id;

  if (req.body.key) {
    delete req.body.key;
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    helper
      .update(req.body, id, "user")
      .then((rez) => res.status(200).json(rez))
      .catch((err) => res.status(500).json({ status: 500, err }));
    return;
  }
  if (req.body.previous_password) {
    if (bcrypt.compareSync(req.body.previous_password, req.body.oldPassword)) {
      delete req.body.oldPassword;
      delete req.body.previous_password;
      req.body.password = bcrypt.hashSync(req.body.password, 8); // Change number to an ENV variable 🔦
    } else {
      res.status(401).json({ status: 401, msg: "not old password" });
    }
  }
  if (req.files) {
    const image = req.files.file.path;

    cloudinary.uploader.upload(
      image,
      {
        upload_preset: "prof_pic",
        public_id: `${req.body.id}/profile_pic`,
      },
      (err, rez) => {
        if (err) {
          console.log(err);
        } else {
          const changes = { ...req.body };
          changes.profile_picture = rez.secure_url;
          helper
            .update(changes, id, "user")
            .then((rez) => res.status(200).json(rez))
            .catch((err) => res.status(500).json({ status: 500, err }));
        }
      }
    );
  } else {
    helper
      .update(req.body, id, "user")
      .then((rez) => res.status(200).json(rez))
      .catch((err) => res.status(500).json({ status: 500, err }));
  }
});

router.delete("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .remove(id, "user")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

function checkRole(role) {
  return (req, res, next) => {
    if (req.jwt.role === role) {
      next();
    } else {
      res.status(403).json({ message: "You are not authorized" });
    }
  };
}

module.exports = router;
