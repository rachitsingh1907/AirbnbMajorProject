const Listing = require("../models/listing");
const User = require("../models/user.js");


// FOR THE SIGN UP FORM
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.signup = async (req, res) => {
    try {
        // extrcating the username emai and password  from the body
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

// FOR THE LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "listings";
    res.redirect(redirectUrl);
}

// FOR THE LOGOUT FORM
module.exports.logout = (req, res, mext) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}

