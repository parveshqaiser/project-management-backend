
import transporter from "../services/nodemailer.service";
import { emailVerificationTemplate } from "../services/template.service";

// use this function in user registration 

export let sendUserCredentials = async(email) => {
  
    try {

        let html = emailVerificationTemplate();

        const mailOptions = {
            from: "fayazdev@gmail.com",
            to: email,
            subject: "Verify Your Email",
            html : html,
        };

        await  transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        return { success: false, message: "Failed to send email" };
    }
}

