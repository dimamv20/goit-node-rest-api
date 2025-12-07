import nodeemail from 'nodemailer';
const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} = process.env;

const transporter = nodeemail.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

export const sendEmail = async (to, subject, html) => {
    const email = {...data , from : SMTP_USER};
    await transporter.sendMail(email);
};