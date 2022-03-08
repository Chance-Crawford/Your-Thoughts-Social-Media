const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

// from validator, checks to see if string matches an email format
const validator = require('validator');

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
            validate: [ validator.isEmail, 'invalid email' ]
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

UserSchema.pre('remove', function(next){
    for(var i = 0; i < this.thoughts.length; i++){
        var currThought = this.thoughts[i];

        Thought.findOneAndDelete({ _id: currThought._id });
    }
    next();
});

// a virtual called friendCount that retrieves the length of the user's 
// friends array field on query.
UserSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});

// set model in database
const User = model('User', UserSchema);

module.exports = User;