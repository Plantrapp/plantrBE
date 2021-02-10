const router = require("express").Router();

const helper = require("./helper");
const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  helper
    .find("message")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.get("/:sender/:recipient", (req, res) => {
  const sender = req.params.sender;
  const recipient = req.params.recipient;
  helper
    .findByAnd(recipient, sender, "message")
    .then((rez) => {
      const response = rez;
      helper
        .findByAnd(sender, recipient, "message")
        .then((rez) => {
          response.forEach((item) => rez.push(item));
          res.status(200).json(rez);
        })
        .catch((err) => res.status(500).json({ status: 500, err }));
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/", (req, res) => {
  helper
    .add(req.body, "message")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  helper
    .update(req.body, id, "message")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  helper
    .remove(id, "message")
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
