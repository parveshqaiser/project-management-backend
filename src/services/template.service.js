
import Mailgen from "mailgen";

let mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: process.env.PROJECT_NAME || "Project Management",
        link: process.env.BACKEND_URL || "http://localhost:6500",
    },
});

export let emailVerificationTemplate = (firstName, lastName, verificationURL)=>{

    let emailContent = {
        body: {
            name: `${firstName} ${lastName}`,
            intro: 'Welcome to the Project Management ! We\'re very excited to have you on board.',
            action: {
                instructions: 'To verify your email address, please click here:',
                button: {
                    color: '#22BC66', 
                    text: 'Verify your Email',
                    link: verificationURL
                }
            },
            outro: 'This link will expire in a short time for security reasons.'
        }
    };

    return mailGenerator.generate(emailContent);
}


export let passwordResetContentTemplate = (firstName, lastName, resetURL)=>{

    let emailContent = {
        body: {
            name: `${firstName} ${lastName}`,
            intro:
                "You recently requested to reset your password. Click the button below to proceed.",
            action: {
                instructions: 'If you did not request a password reset, you can safely ignore this email.',
                button: {
                    color: '#FF4136',
                    text: 'Reset your password',
                    link: resetURL,
                },
            },
            outro: 'This link will expire in a short time for security reasons.',
        },
    };

    return mailGenerator.generate(emailContent);
}


