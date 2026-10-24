const UserData = require("../../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.register = async (req , res) => {
    try{
        const {userName,fullName,email,phoneNo,password} = req.body;

        // Check required fields
        if (
        !userName ||
        !fullName ||
        !email ||
        !phoneNo ||
        !password
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        let user = await UserData.findOne({
            $or : [
                {email : email},
                {phoneNo : phoneNo}
            ]  
            });

        if(user){
            if(user.email === email){
                return res.status(400).json({
                    success : false,
                    message : "Email is already registered"
                });
            }
            if(user.phoneNo === phoneNo){
                return res.status(400).json({
                    success : false,
                    message : "Phone number is already registered"
                });
            }
        }

        user = new UserData({ userName , fullName , email , password , phoneNo });
        await user.save();

        const token = jwt.sign(
            {
                id : user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "1d"
            }
        )

        res.status(201).json({
            success : true,
            message : "User registered successfully",
            token,
            user :{
                id : user._id,
                userName : user.userName,
                fullName : user.fullName,
                email : user.email
            }
        });
    }catch(error){
        console.log("Error in registration");

        // if duplicate key
        if(error.code === 11000){
            if(error.keyPattern?.phoneNo){
                return res.status(400).json({
                    success: false,
                    message : "Phone number already exists"
                })
            }

            if(error.keyPattern?.email){
                return res.status(400).json({
                    success : false,
                    message : "Email already exists"
                })
            }
        }

        console.log(error.message);
        res.status(500).json({message : error.message || "Internal server error"})
    }
};

exports.login = async (req , res) => {
    try{
        const {email , password} = req.body;
        let user  = await UserData.findOne({email});

        if(!user){
            console.log("User not found")
            return res.status(400).json({message:"Invalid credentials"})
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            console.log("Invalid password");
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign(
            {
                id : user._id 
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        )

        return res.status(200).json({
            success: true,
            message : "Login successful",
            token,
            user : {
                id : user._id,
                userName: user.userName,
                fullName : user.fullName,
                email : user.email
            }
        })

    }catch(error){
        console.log("Error in login");
        console.log(error.message);
        res.status(500).json({message : error.message || "Server error"})
    }
};

const { sendOTPEmail } = require("../../config/mailer.js");

exports.sendResetOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await UserData.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email does not exist"
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP expires after 10 minutes
        const otpExpire = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.resetOTP = otp;
        user.resetOtpExpire = otpExpire;

        await user.save();

        let emailSent = false;
        try {
            await sendOTPEmail(email, otp);
            emailSent = true;
        } catch (mailError) {
            console.error("Failed to send OTP email via SMTP:", mailError.message);
            // Log OTP in console for developer/testing convenience
            console.log(`\n==========================================`);
            console.log(`[DEV OTP BACKUP] OTP for ${email} is: ${otp}`);
            console.log(`==========================================\n`);
        }

        return res.status(200).json({
            success: true,
            message: emailSent
                ? "OTP sent successfully to your email address"
                : "OTP generated! (Check server console if SMTP is not configured)",
            otpInConsole: !emailSent
        });

    } catch (error) {
        console.error("Error in sendResetOTP:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to send OTP"
        });
    }
};

exports.verifyOTPAndResetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            newPassword,
            confirmPassword
        } = req.body;

        // Check fields
        if (
            !email ||
            !otp ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check passwords
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Find user
        const user = await UserData.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check OTP
        if (user.resetOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check OTP expiry
        if (
            !user.resetOtpExpire ||
            user.resetOtpExpire < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        // Set raw password - pre('save') hook in UserData model will hash it once
        user.password = newPassword;

        // Remove OTP after successful reset
        user.resetOTP = null;
        user.resetOtpExpire = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Error in verifyOTPAndResetPassword:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to reset password"
        });
    }
};
exports.forgetPassword = async (req , res )=>{
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and new password are required"
            });
        }

        const user = await UserData.findOne({email});

        if(!user){
            console.log("User not found")
            return res.status(404).json({
                success: false,
                message : "User not found with this email"
            })
        }

        // Setting raw password triggers the pre('save') hook in User model to hash it cleanly
        user.password = password;
        await user.save();

        return res.status(200).json({
            success : true,
            message : "Password updated successfully"
        })

    }catch(error){
        console.log("Error formed during forget password", error);
        return res.status(500).json({
            message : error.message || "Server error"
        })
    }
}

exports.getUser = async (req , res) => {
    try{
        const user = await UserData
            .findById(req.user.id)
            .select("-password");

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        return res.status(200).json({
            success :true,
            user
        })

    }catch(error){
        console.log("Error in getting user data");
        console.log(error.message);
        res.status(500).json({message : error.message || "server error"})
    }
};