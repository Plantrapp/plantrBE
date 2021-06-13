const router = require("express").Router();

const helper = require("./helper");
const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs");

router.get("/", restricted, (req, res) => {
  helper
    .find("reviews")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.get("/:reviewee_id", restricted, (req, res) => {
  const reviewee_id = req.params.reviewee_id;

  helper
    .findBy({ reviewee_id }, "reviews")
    .then((rez) => {
      const response = {
        array: rez,
        average: 0,
      };

      response.average =
        rez.reduce((acc, curr) => acc + curr.star_rating, 0) / rez.length;

      res.status(200).json(response);
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/", restricted, (req, res) => {
  helper
    .add(req.body, "reviews")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.put("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .update(req.body, id, "reviews")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/:id", restricted, (req, res) => {
  const id = req.params.id;
  helper
    .remove(id, "reviews")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

function checkRole(role) {
  return (req, res, next) => {
    if (req.jwt.role === role) {
      next();
    } else {
      res.status(403).json({ reviews: "You are not authorized" });
    }
  };
}

module.exports = router;
