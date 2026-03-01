export const emailVerificationContent = (firstName, lastName, verificationURL)=>{
    return{
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
    }
};

export const passwordResetContent = (firstName, lastName, resetURL) => {
    return {
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
};