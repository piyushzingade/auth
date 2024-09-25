import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = "6708758534c572fad570408172d377cf";

export const mailtrapClient = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

export const sender = {
  address: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};


