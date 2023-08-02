const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdDate: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getTime() + (3 * 60 * 60 * 1000));
        }
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
