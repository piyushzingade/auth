import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

// Types
type Recipient = { email: string };

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
	const recipientEmail = email;

	try {
		const response = await mailtrapClient.sendMail({
			from: sender,
			to: recipientEmail, // send as string
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error: any) {
		console.error("Error sending verification email", error);
		throw new Error(`Error sending verification email: ${error.message}`);
	}
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
	const recipientEmail = email;

	try {
		const response = await mailtrapClient.sendMail({
			from: sender,
			to: recipientEmail, // send as string
			templateUuid: "3235d180-63ed-4bfc-9840-4453cf2543e9",
			templateVariables: {
				company_info_name: "Auth Company",
				name: name,
			},
		});

		console.log("Welcome email sent successfully", response);
	} catch (error: any) {
		console.error("Error sending welcome email", error);
		throw new Error(`Error sending welcome email: ${error.message}`);
	}
};

export const sendPasswordResetEmail = async (email: string, resetURL: string): Promise<void> => {
	const recipientEmail = email;

	try {
		const response = await mailtrapClient.sendMail({
			from: sender,
			to: recipientEmail, // send as string
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error: any) {
		console.error("Error sending password reset email", error);
		throw new Error(`Error sending password reset email: ${error.message}`);
	}
};

export const sendResetSuccessEmail = async (email: string): Promise<void> => {
	const recipientEmail = email;

	try {
		const response = await mailtrapClient.sendMail({
			from: sender,
			to: recipientEmail, // send as string
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset success email sent successfully", response);
	} catch (error: any) {
		console.error("Error sending password reset success email", error);
		throw new Error(`Error sending password reset success email: ${error.message}`);
	}
};
