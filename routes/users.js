const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Group = require('../models/group');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) => {
  User.find()
  .exec()
  .then(users => {
      const response = {
          count: users.length,
          users
      };
      res.status(200).json(response);
  })
  .catch(error => {
    res.status(500).json({ error });
  });
});

router.get('/:userId/groups', (req, res, next) => {
  Group.find({ ownedBy: req.params.userId })
  .exec()
  .then(groups => {
      const response = {
          count: groups.length,
          groups
      };
      res.status(200).json(response);
  })
  .catch(error => {
    res.status(500).json({ error });
  });
});

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "E-mail already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (error, password) => {
          if (error) {
            return res.status(500).json({
              error
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password,
              displayCurrency: req.body.displayCurrency,
              rates: req.body.rates
            });
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(error => {
                res.status(500).json({
                  error
                });
              });
          }
        });
      }
    });
});

router.get('/:userId', function(req, res, next) {
    const id = req.params.userId;
    User.findById(id)
    .exec()
    .then(user => {
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: "No valid user found for provided ID" });
        }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.patch("/:userId", (req, res, next) => {
    const _id = req.params.userId;
    User.findByIdAndUpdate(_id, req.body, { new: true })
    .exec()
    .then(user => {
        res.status(200).json({
            message: 'User settings updated',
            user
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Authentication successful",
            token,
            userId: user._id
          });
        }
        res.status(401).json({
          message: "Authentication failed"
        });
      });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});
  
router.delete("/:userId", (req, res, next) => {
    const _id = req.params.userId;
    User.deleteMany({ _id })
    .exec()
    .then(() => {
        res.status(200).json({ message: 'User removed' });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});


module.exports = router;
