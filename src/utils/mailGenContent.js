

export const emailVerificationContent = (username, verificationURL)=>{
    return{
        body: {
            name: username,
            intro: 'Welcome to the Project Management ! We\'re very excited to have you on board.',
            action: {
                instructions: 'To verif your email address, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Veriy your Email',
                    link: verificationURL
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
};