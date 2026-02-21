import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendClaimedItemRemovalNotification = async (
    email: string,
    itemName: string,
    listName: string,
    language: string = 'en'
) => {
    const isIt = language === 'it';

    const subject = isIt
        ? `Oggetto rimosso dalla lista: ${listName}`
        : `Item removed from list: ${listName}`;

    const text = isIt
        ? `Ciao,\n\nti informiamo che l'oggetto "${itemName}" che avevi prenotato nella lista "${listName}" è stato rimosso dal festeggiato.\n\nSaluti,\nIl team di Gift List`
        : `Hello,\n\nwe are informing you that the item "${itemName}" you claimed in the list "${listName}" has been removed by the celebrant.\n\nBest regards,\nThe Gift List team`;

    try {
        await transporter.sendMail({
            from: '"Gift List" <noreply@giftlist.com>',
            to: email,
            subject,
            text,
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
};
