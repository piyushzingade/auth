import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate";
import { mailtrapClient } from "./mailtrap.config";

export const sendVerficationEmail = async (email :string , verficationToken :any) =>{
    const recipient  = [{ email }]

    try {
        const response =  await mailtrapClient.send({
            from :sender ,
            to: recipient,
            subject :"Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verficationCode}" ,verficationToken)
            category :"Email verfication"
        })

        console.log("Eamil sent successfully" , response)
    } catch (error) {
        console.error('Error sending verification' , error);

        throw new Error(`Error sending verfication email :${error}`)
        
    }
} 