const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
 
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return done(null, false, { message: "User not found." });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            return done(null, user, { message: "Successfully Logged In" });
        } else {
            return done(null, false, { message: "Incorrect password." });
        }
    } catch (err) {
        return done(err, false, { message: "Something went wrong." });
    }
}));


passport.serializeUser((user, done) => {
    done(null, user._id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return done(null, false, { message: "User not found." });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
});
