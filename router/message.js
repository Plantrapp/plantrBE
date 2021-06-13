const router = require("express").Router();

const helper = require("./helper");
const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs");

router.get("/:sender/:recipient", restricted, async (req, res) => {
  const sender_id = req.params.sender;
  const recipient_id = req.params.recipient;
  let response;
  await helper
    .findByAnd({ recipient_id }, { sender_id }, "message")
    .then((rez) => {
      response = rez;
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
  await helper
    .findByAnd(
      { recipient_id: sender_id },
      { sender_id: recipient_id },
      "message"
    )
    .then((rez) => {
      response.concat(rez);
      rez.forEach((item) => response.push(item));
      res.status(200).json(response);
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/", restricted, (req, res) => {
  helper
    .add(req.body, "message")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.put("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .update(req.body, id, "message")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/:id", restricted, (req, res) => {
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
