const router = require("express").Router();
const sgMail = require("@sendgrid/mail");
const helper = require("./helper");
const restricted = require("../auth/restricted-middleware");
const URL = require("../index");
const uuid = require("uuid").v4;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get("/password/:hash", (req, res) => {
  const hash = req.params;
  helper
    .findBy(hash, "hashes")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await helper.findBy({ email }, "user");
    if (user.length === 0) {
      return res
        .status(422)
        .json({ status: 422, msg: "Error: User not found" });
    }

    const user_id = user[0].id;
    const hash = await helper.findBy({ user_id }, "hashes");

    if (hash.length > 0) {
      if (!hash[0].isHashUsed && Date.now() < hash[0].expires) {
        res.status(422).json({ message: "Error: Email already sent" });
        return;
      }
    }

    const hashData = {
      user_id,
      email,
      hash: uuid(),
      isHashUsed: false,
      expires: Date.now() + 21600000,
    };

    const msg = {
      to: email, // Change to your recipient
      from: "zavierstod@gmail.com", // Change to your verified sender
      subject: "Plantr Forgot Password",
      html: `
      <h1>Plantr Reset Password</h1>
      <p>Click the link below to reset your password</p>
      <a href="https://deployed-plantr-fe-git-main-plantr.vercel.app/forgot-password/${hashData.hash}">Reset Password</a>
      `,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    await helper
      .add(hashData, "hashes")
      .then((rez) => res.status(200).json(rez))
      .catch((err) => res.status(500).json({ status: 500, err }));

    console.log(`Email sent to ${email}!`);
  } catch {
    return res.status(500).json({ message: "error" });
  }
});

router.put("/password/", (req, res) => {
  const { id, isHashUsed } = req.body;
  helper
    .update({ isHashUsed }, id, "hashes")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

module.exports = router;
