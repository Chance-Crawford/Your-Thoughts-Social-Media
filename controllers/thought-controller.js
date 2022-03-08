const req = require('express/lib/request');
const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res){
        Thought.find({})
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    getThoughtById({ params }, res){
        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createThought({ body }, res){
        Thought.create(body)
        // after new thought is created, capture 
        // its _id and userId values only
        .then(({ _id, userId }) => {
            // then add thought to the designated user
            return User.findOneAndUpdate(
                // find the user based on user id stored in thought
                { _id: userId },
                // push new thought id to user's array
                { $push: { thoughts: _id } },
                { new: true, runValidators: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    updateThought({ params, body }, res){
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    deleteThought({ params }, res){
        // deletes thought but also returns the deleted
        // thoughts data, which we use in the "then" function
        // below
        Thought.findOneAndDelete({ _id: params.id })
        // catch deleted thoughts data
        .then(deletedThought => {
            if (!deletedThought) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }

            // remove thought id from User as well
            return User.findOneAndUpdate(
                { _id: deletedThought.userId },
                { $pull: { thoughts: deletedThought._id } },
                { new: true }
            );
        })
        // then catch returned user data
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // reactions are stored directly in the thought as
    // a sub document. Reactions are created from the req.body.
    addReaction({ params, body }, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    removeReaction({ params }, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
}

module.exports = thoughtController;