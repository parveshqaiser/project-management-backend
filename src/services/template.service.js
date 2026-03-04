
import Mailgen from "mailgen";

let mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: process.env.PROJECT_NAME || "Project Management",
        link: process.env.BACKEND_URL || "http://localhost:6500",
    },
});

export let emailVerificationTemplate = ()=>{

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

// simillary reset passowrod template

