const express = require("express");
const UserController = require("../controller/UserController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// // Middleware applied to all routes except /signup
// router.use((req, res, next) => {
//     if (req.path === '/signup') {
//         next(); // Skip the middleware for /signup route
//     } else {
//         verifyToken(req, res, next); // Apply verifyToken middleware for all other routes
//     }
// });

router.use((req,res,next)=>{
    if(req.path === '/signup'){
        next();
    }else{
        verifyToken(req,res,next)
    }
})

// Routes for UserController
router.route("/signup").post(UserController.signup);
router.route("/login").post(UserController.login)
router.route("/get-profile").get(UserController.getProfile);

module.exports = router;
