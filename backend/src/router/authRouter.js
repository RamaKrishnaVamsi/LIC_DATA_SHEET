const express = require("express");
const router = express.Router();
const authController = require("../controller/Auth/authController.js");

const {registerValidation , loginValidation ,validate} = require('../middleware/validation.js')
const auth = require("../middleware/auth.js")

router.post('/register' ,registerValidation , validate,  authController.register);
router.post('/login' , loginValidation, validate  , authController.login);
router.post('/send-otp', authController.sendResetOTP);
router.post('/verify-otp-reset-password', authController.verifyOTPAndResetPassword);
router.post('/forgetPassword', authController.forgetPassword);
router.get('/user', auth , authController.getUser);


module.exports= router;