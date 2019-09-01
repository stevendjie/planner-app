const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

router.get('/', function(req, res, next) {
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

router.post('/', function(req, res, next) {
  const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      displayCurrency: req.body.displayCurrency,
      rates: req.body.rates   
  });
  user
  .save()
  .then(user => {
    res.status(201).json({
      message: "User successfully saved",
      user 
    });
  })
  .catch(error => {
    res.status(500).json({
      error
    });
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
    console.log(req.body);
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
