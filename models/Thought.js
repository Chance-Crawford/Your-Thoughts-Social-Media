const { Schema, Types, model } = require('mongoose');
const formatDate = require('../utils/formatDate');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            trim: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // getter method to format the timestamp on query
            get: createdAtVal => formatDate(createdAtVal)
        },
    },
    {
        toJSON: {
          getters: true
        }
    }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            trim: true,
            // must be between 1-280 characters
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => formatDate(createdAtVal)
        },
        // user that creates the thought
        username: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        // Array of nested documents created with the reactionSchema
        // reactions exist within an array inside the thought document and 
        // adhere to the Reaction schema defined above.
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
          virtuals: true,
          getters: true
        },
        // set id to false because this is a virtual that Mongoose returns, 
        // and it is not needed.
        id: false
    }
);

// returns reactions length for the thought
ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;