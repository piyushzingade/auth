import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate";
import { mailtrapClient, sender } from "./mailtrap.config";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = email;  // Directly assign the email string

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
