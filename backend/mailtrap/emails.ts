import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate";
import { mailtrapClient, sender } from "./mailtrap.config";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = email;

    try {
        const response = await mailtrapClient.sendMail({
            from: sender,
            to: recipient,  // Now `recipient` is a string
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification"
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error('Error sending verification', error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipient = email;

    try {
        const response = await mailtrapClient.sendMail({
            from: sender,
            to: recipient,
            templateUuid:"3235d180-63ed-4bfc-9840-4453cf2543e9",
            templateVariables: {
                company_info_name: "Auth Company",
                name: name,
            },
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);

        throw new Error(`Error sending welcome email: ${error}`);
    }
};

export const sendPasswordResetEmail = async(email :string , resetURL :string)=>{
    const recipient = email;
    try {
        const response  = await mailtrapClient.sendMail({
            from:sender,
            to : recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetUrl}" , resetURL),
            category:"Password Reset "
        })
    } catch (error) {
        console.log("Error sending password reset email" , error);
        throw new Error(`Error sending password email ${error}`)
    }
}

export const sendResetSuccessEmail = async (email : string)=>{
    const recipient = email ;
    try {
        const response =  await mailtrapClient.sendMail({
            from :sender ,
            to :recipient , 
            subject : "Password Reset Successfully",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset"
        });
        console.log("Password reset email  sent successfully" , response)

    } catch (error) {
        console.error('Error  sending  password  reset  success email ' , error);
        throw new Error(`Error sending  password  reset success email: ${error}`)
    }
}