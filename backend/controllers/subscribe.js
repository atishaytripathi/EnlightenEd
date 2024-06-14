const nodemailer = require("nodemailer")


exports.subscribe=(req,res) => {
    const {email} = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        });

        const mailOptions = {
            from : process.env.EMAIL,
            to : email,
            subject : "Welcome to the Platform",
            html : `<h1>Congratulations, you have successfully subscribed to EnlightenEd.</h1><p>We'll keep you updated with the newsletter and latest updates here.</p>`
        }

        transporter.sendMail(mailOptions,(error, info) => {
            if(error){
                console.log(("Error",error))
            }
            else {
                console.log(("Email sent" + info.response));
                res.status(201).json({status:201,info})
            }
        })
    } catch (error) {
        res.status(201).json({status:401,error})
    }
}