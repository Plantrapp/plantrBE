const router = require("express").Router();

const helper = require("./helper");
const restricted = require("../auth/restricted-middleware");

router.get("/dwellr/:id", async (req, res) => {
  const dwellr_id = req.params.id;
  let users;
  const sendBack = [];

  await helper
    .findBy({ dwellr_id }, "client_growr_connection")
    .then((rez) => {
      users = rez;
    })
    .catch((err) => res.status(500).json({ status: 500, err }));

  users.forEach((user) => {
    helper
      .findById(user.growr_id, "user")
      .then((response) => {
        sendBack.push(response);
        if (users.length === sendBack.length) {
          res.status(200).json(sendBack);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/growr/:id", async (req, res) => {
  const growr_id = req.params.id;
  let users;
  const sendBack = [];

  await helper
    .findBy({ growr_id }, "client_growr_connection")
    .then((rez) => {
      users = rez;
    })
    .catch((err) => res.status(500).json({ status: 500, err }));

  users.forEach((user) => {
    helper
      .findById(user.dwellr_id, "user")
      .then((response) => {
        sendBack.push(response);
        if (users.length === sendBack.length) {
          res.status(200).json(sendBack);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/", (req, res) => {
  helper
    .add(req.body, "client_growr_connection")
    .then((rez) => res.status(200).json(rez))
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/", async (req, res) => {
  const { dwellr_id, growr_id } = req.body;
  let id;
  await helper
    .findByAnd({ dwellr_id }, { growr_id }, "client_growr_connection")
    .then((res) => (id = res[0].id))
    .catch((err) => console.log(err));
  await helper
    .remove(id, "client_growr_connection")
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
