const { body , validationResult } = require("express-validator");

exports.registerValidation = [
    body("userName")
        .notEmpty()
        .withMessage("Name is required"),
    
    body("fullName")
        .notEmpty()
        .withMessage("Fullname is required"),

    body("email")
        .notEmpty()
        .withMessage("Emter vaild Email"),

    body("phoneNo")
        .notEmpty()
        .withMessage("Phone numder is required"),
    
    body("password")
        .isLength({ min : 6})
        .withMessage("Password should contains minimum 6 characters")
];

exports.loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Enter vaild Email"),

    body("password")
        .notEmpty()
        .withMessage("password is required")
];

exports.validate = (req , res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        // console.log("hello");
        return res.status(400).json({
            success : false,
            errors : errors.array()
        });
    }
    next();
};