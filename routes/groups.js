const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Group = require('../models/group');

router.get('/', function(req, res, next) {
    Group.find()
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

router.post('/', function(req, res, next) {
    const group = new Group({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        displayCurrency: req.body.displayCurrency,
        splitQuantity: Number(req.body.splitQuantity),
    });
    group
    .save()
    .then(group => {
      res.status(201).json({
        message: "Group successfully created",
        group 
      });
    })
    .catch(error => {
      res.status(500).json({
        error
      });
    });
});

router.get('/:groupId', function(req, res, next) {
    const id = req.params.groupId;
    Group.findById(id)
    .exec()
    .then(group => {
        if (group) {
            res.status(200).json({ group });
        } else {
            res.status(404).json({ message: "No valid group found for provided ID" });
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

router.patch("/:groupId", (req, res, next) => {
    const _id = req.params.groupId;
    Group.findByIdAndUpdate(_id, req.body, { new: true })
    .exec()
    .then(group => {
        res.status(200).json({
            message: 'Group successfully updated',
            group
        });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});
  
router.delete("/:groupId", (req, res, next) => {
    const _id = req.params.groupId;
    Group.deleteMany({ _id })
    .exec()
    .then(() => {
        res.status(200).json({ message: 'Group successfully removed' });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});


module.exports = router;
