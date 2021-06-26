const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const helper = require("./helper");
const imageDataUri = require("image-data-uri");
const formData = require("express-form-data");

const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.get("/", restricted, (req, res) => {
  helper
    .find("portfolio_posts")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.get("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .findById(id, "portfolio_posts")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});
router.get("/user/:user_id", restricted, (req, res) => {
  const user_id = req.params.user_id;
  helper
    .findBy({ user_id }, "portfolio_posts")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/", restricted, (req, res) => {
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
        alert("There was an error while uploading your picture.");
      } else {
        const newPost = {
          url: rez.secure_url,
          user_id: req.body.user_id,
          description: req.body.description,
          created_at: new Date().toString(),
          public_id: rez.public_id,
        };
        helper
          .add(newPost, "portfolio_posts")
          .then((rez) => res.status(200).json(rez))
          .catch((err) => console.log(err));
      }
    }
  );
});

router.put("/:id", restricted, (req, res) => {
  const id = req.params.id;

  helper
    .update(req.body, id, "portfolio_posts")
    .then((rez) => {
      res.status(200).json(rez);
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .remove(id, "portfolio_posts")
    .then((rez) => {
      // const trim_start = rez.url.search("/portfolio_pics");
      // console.log(trim_start);
      // let public_id = rez.url.slice(trim_start, -4);
      // public_id = public_id.replace(/%/g, " ");
      // console.log(public_id);
      cloudinary.uploader.destroy(rez.public_id, (err, result) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("deleted");
        }
      });
      res.status(200).json(rez);
    })
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
