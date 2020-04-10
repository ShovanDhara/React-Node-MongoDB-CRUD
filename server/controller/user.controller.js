const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../config/secret");

module.exports.register = (req, res, next) => {
  if (req.body.adminkey && req.body.adminkey !== keys.adminKey) {
    res
      .status(422)
      .send(
        "Admin key is incorrect. Please provide correct admin key to get admin access"
      );
  } else {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (user) {
        res.status(422).send("Email already exists.");
      } else {
        const user = new User();
        user.fullName = req.body.fullName;
        user.email = req.body.email;
        user.password = req.body.password;
        user.isAdmin =
          req.body.adminkey === keys.adminKey ? true : false;
        user.save((err, doc) => {
          if (!err) {
            res.send(doc);
          } else {
            return next(err);
          }
        });
      }
    });
  }
};

module.exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!user) {
      res.status(404).send("User not found.");
    } else {
      if (user) {
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            // Create JWT Payload
            const payload = {
              id: user.id,
              name: user.fullName,
              email: user.email,
              isAdmin: user.isAdmin,
              favoriteTeam: user.favoriteTeam
            };
            // Sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 86400 // 1 day in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            return res.status(400).send("Password incorrect");
          }
        });
      }
    }
  });
};

module.exports.setFavorite = (req, res, next) => {
  User.updateOne({ email: req.body.email }, req.body, (err, data) => {
    if (data) {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.fullName,
            email: user.email,
            isAdmin: user.isAdmin,
            favoriteTeam: user.favoriteTeam
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 86400 // 1 day in seconds
            },
            (err, token) => {
              res.json({
                favoriteTeam: req.body.favoriteTeam,
                success: true,
                token: "Bearer " + token
              });
            }
          );
        }
      });
    } else {
      return next(err);
    }
  });
}

module.exports.getAllUsers = (req, res, next) => {
  User.find({}, (err, users) => {
    if (!users) {
      res.status(404).send('No record found.');
    } else {
      if (users) {
        res.status(200).send(users);
      } else {
        return next(err);
      }
    }
  });
}
module.exports.deleteUserById = (req, res, next) => {
  User.deleteOne({ _id: req.params.id }, (err, data) => {
    if (data.deletedCount > 0) {
      User.find({}, (err, users) => {
        if (!users) {
          res.status(404).send('No record found.');
        } else {
          if (users) {
            res.status(200).send(users);
          } else {
            return next(err);
          }
        }
      });
    } else {
      return next(err);
    }
  });
}

module.exports.updateUserPermission = (req, res, next) => {
  User.updateOne({ email: req.body.email }, req.body, (err, data) => {
    if (data) {
      User.find({}, (err, users) => {
        if (!users) {
          res.status(404).send('No record found.');
        } else {
          if (users) {
            res.status(200).send(users);
          } else {
            return next(err);
          }
        }
      });
    } else {
      return next(err);
    }
  });
}