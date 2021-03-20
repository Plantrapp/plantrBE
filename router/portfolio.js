const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const helper = require("./helper");
const imageDataUri = require("image-data-uri");
const formData = require("express-form-data");

const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs");

cloudinary.config({
  cloud_name: "samuel-brown",
  api_key: "679133214658966",
  api_secret: "ZwOhfkMlf6bzL8GnA2iSrRYlI_U",
});

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
  let originalName = req.files.file.originalFilename.slice(0, -4);
  let image = req.files.file.path;
  let public_id = `${
    req.body.user_id
  }/${new Date().toDateString()}/${originalName}`;

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
        console.log(rez);
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

router.put("/:id", (req, res) => {
  const id = req.params.id;

  helper
    .update(req.body, id, "portfolio_posts")
    .then((rez) => {
      console.log(rez);
      res.status(200).json(rez);
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  helper
    .remove(id, "portfolio_posts")
    .then((rez) => {
      console.log(rez);
      // const trim_start = rez.url.search("/portfolio_pics");
      // console.log(trim_start);
      // let public_id = rez.url.slice(trim_start, -4);
      // public_id = public_id.replace(/%/g, " ");
      // console.log(public_id);
      cloudinary.uploader.destroy(rez.public_id, (err, result) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log(result);
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
