const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Entry = require('../models/entry');
const Group = require('../models/group');

router.get('/', function(req, res, next) {
    Entry.find()
    .exec()
    .then(entries => {
        const response = {
            count: entries.length,
            entries
        };
        res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.post('/', function(req, res, next) {
    Group.findById(req.body.groupId)
    .then(group => {
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }
        const entry = new Entry({
            _id: new mongoose.Types.ObjectId(),
            groupId: req.body.groupId,
            quantity: Number(req.body.quantity),
            value: Number(req.body.value),
            // name: req.body.name,
            details: req.body.details,
            isPersonal: req.body.isPersonal,
            currency: req.body.currency,
        });
        return entry.save();
    })
    .then(entry => {
        res.status(201).json({
            message: "Entry successfully saved",
            entry 
        });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

router.get('/:entryId', function(req, res, next) {
    const id = req.params.entryId;
    Entry.findById(id)
    .exec()
    .then(entry => {
        if (entry) {
            res.status(200).json({ entry });
        } else {
            res.status(404).json({ message: "No valid entry found for provided ID" });
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});

router.patch("/:entryId", (req, res, next) => {
    const _id = req.params.entryId;
    Entry.findByIdAndUpdate(_id, req.body, { new: true })
    .exec()
    .then(entry => {
        res.status(200).json({
            message: 'Entry updated',
            entry
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });
});
  
router.delete("/:entryId", (req, res, next) => {
    const _id = req.params.entryId;
    Entry.deleteMany({ _id })
    .exec()
    .then(() => {
        res.status(200).json({ message: 'Entry removed' });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
});


module.exports = router;
