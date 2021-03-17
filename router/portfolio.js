const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const helper = require("./helper");
const imageDataUri = require("image-data-uri");
const formData = require("express-form-data");

const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  helper
    .find("portfolio_posts")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  helper
    .findById(id, "portfolio_posts")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});
router.get("/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  helper
    .findBy({ user_id }, "portfolio_posts")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/", (req, res) => {
  console.log(req.files, req.body);
  let originalName = req.files.file.originalFilename.slice(0, -4);
  let image = req.files.file.path;

  cloudinary.uploader.upload(
    image,
    {
      upload_preset: "portfolio_pics",
      public_id: `${
        req.body.user_id
      }/${new Date().toDateString()}/${originalName}`,
    },
    (err, rez) => {
      if (err) {
        console.log(err);
      } else {
        console.log(rez);
        const newPost = {
          url: rez.secure_url,
          user_id: req.body.user_id,
          description: req.body.description,
          created_at: new Date().toString(),
        };
        helper
          .add(newPost, "portfolio_posts")
          .then((rez) => res.status(200).json(rez))
          .catch((err) => console.log(err));
      }
    }
  );
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  helper
    .update(req.body, id, "portfolio_posts")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  helper
    .remove(id, "portfolio_posts")
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
