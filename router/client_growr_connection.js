const router = require("express").Router();
const chalk = require("chalk");
const helper = require("./helper");
const restricted = require("../auth/restricted-middleware");

router.get("/dwellr/:id", (req, res) => {
  const dwellr_id = req.params.id;
  const sendBack = [];
  helper
    .findBy({ dwellr_id }, "client_growr_connection")
    .then((rez) => {
      rez.forEach((user) => {
        helper
          .findById(user.growr_id, "user")
          .then((response) => {
            sendBack.push(response);
            if (rez.length === sendBack.length) {
              res.status(200).json(sendBack);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.get("/growr/:id", (req, res) => {
  const growr_id = req.params.id;
  const sendBack = [];
  helper
    .findBy({ growr_id }, "client_growr_connection")
    .then((rez) => {
      rez.forEach((user) => {
        helper
          .findById(user.dwellr_id, "user")
          .then((response) => {
            sendBack.push(response);
            if (rez.length === sendBack.length) {
              res.status(200).json(sendBack);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.post("/", restricted, (req, res) => {
  helper
    .add(req.body, "client_growr_connection")
    .then((rez) => {
      res.status(200).json(rez);
    })
    .catch((err) => res.status(500).json({ status: 500, err }));
});

router.delete("/", restricted, (req, res) => {
  const { dwellr_id, growr_id } = req.body;
  helper
    .findByAnd({ dwellr_id }, { growr_id }, "client_growr_connection")
    .then((rez) => {
      const id = rez[0].id;
      helper
        .remove(id, "client_growr_connection")
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => res.status(500).json({ status: 500, err }));
    })
    .catch((err) => console.log(err));
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
