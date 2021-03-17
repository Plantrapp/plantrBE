const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const helper = require("./helper");
const multer = require("multer");
const upload = multer();
const imageDataUri = require("image-data-uri");

cloudinary.config({
  cloud_name: "samuel-brown",
  api_key: "679133214658966",
  api_secret: "ZwOhfkMlf6bzL8GnA2iSrRYlI_U",
});

router.post("/prof_pic", (req, res) => {
  console.log(req.body);
  //   cloudinary.uploader.upload("", {}, (err, rez) =>
  //     console.log(err, rez)
  //   );
});

router.post("/", upload.single("prof_pic"), (req, res, next) => {
  console.log(req.file, req.body.description);
  let image = imageDataUri.encode(req.file.buffer, "image");

  cloudinary.uploader.upload(
    image,
    {
      upload_preset: "portfolio_pics",
      //   use_filename: true,
      //   unique_filename: false,
      public_id: `${req.body.username}/${req.file.originalname}`,
      //   folder: `profile_pics/${req.body.username}`,
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

module.exports = router;
