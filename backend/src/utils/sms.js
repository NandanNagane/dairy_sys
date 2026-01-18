// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio" // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendSmsNotificationToFarmer(milkCollection) {

    const phoneNumber = milkCollection.user.phoneNumber;
    if (!phoneNumber) {
        console.log("No phone number available for farmer:", milkCollection.user.id);
        return;
    }

    const messageBody = `Hello ${milkCollection.user.name}, your milk collection of ${milkCollection.quantity} liters has been recorded on ${milkCollection.date.toDateString()}. Thank you!`;

    try {
        const message = await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
    } catch (error) {
        console.error("Failed to send SMS to farmer:", error);
        return;
    }


}

