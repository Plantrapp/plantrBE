const router = require("express").Router();

const helper = require("./helper");
const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs");

router.get("/", restricted, (req, res) => {
  helper
    .find("blogs")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.get("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .findById(id, "blogs")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});
router.get("/user/:author_id", restricted, (req, res) => {
  const author_id = req.params.author_id;
  helper
    .findBy({ author_id }, "blogs")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/", restricted, (req, res) => {
  helper
    .add(req.body, "blogs")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.put("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .update(req.body, id, "blogs")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .remove(id, "blogs")
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
