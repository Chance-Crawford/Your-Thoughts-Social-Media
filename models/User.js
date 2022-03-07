const { Schema, model } = require('mongoose');
const formatDate = require('../utils/formatDate');

// from validator, checks to see if string matches an email format
import { isEmail } from 'validator';

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            validate: [ isEmail, 'invalid email' ]
        },
        // Array of the users thoughts. _id values referencing the Thought model
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        // Array of user's friends. _id values referencing the User model (self-reference)
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
          virtuals: true
        },
        // set id to false because this is a virtual that Mongoose returns, 
        // and it is not needed.
        id: false
      }
);

// a virtual called friendCount that retrieves the length of the user's 
// friends array field on query.
UserSchema.virtual('friendCount').get(function(){
    return this.friends.length
});

// set model in database
const User = model('User', UserSchema);

module.exports = User;