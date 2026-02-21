import nodemailer from 'nodemailer';

export const sendClaimedItemRemovalNotification = async (
    guestEmail: string,
    itemName: string,
    listName: string,
    language: string = 'it'
): Promise<void> => {
    try {
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

        if (!SMTP_HOST || SMTP_HOST === 'localhost' || SMTP_HOST === 'mock') {
            console.log(`[Email Mock] Email skipped for ${guestEmail}. SMTP_HOST is not configured with a real server.`);
            console.log(`Testo previsto:\nIl regalo "${itemName}" che avevi prenotato sulla lista "${listName}" è stato rimosso dal festeggiato.`);
            return;
        }

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        const subject = language === 'en'
            ? `Update regarding the gift "${itemName}"`
            : `Aggiornamento riguardo al regalo "${itemName}"`;

        const text = language === 'en'
            ? `Hello,\n\nThe gift "${itemName}" that you had claimed on the list "${listName}" has been removed by the celebrant. You no longer need to buy it.\n\nThank you,\nGift List`
            : `Ciao,\n\nIl regalo "${itemName}" che avevi prenotato sulla lista "${listName}" è stato rimosso dal festeggiato. Non è più necessario acquistarlo.\n\nGrazie,\nGift List`;

        const html = language === 'en'
            ? `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #007AFF;">Gift List Update</h2>
                    <p>Hello,</p>
                    <p>The gift <b>"${itemName}"</b> that you had claimed on the list <b>"${listName}"</b> has been removed by the celebrant.</p>
                    <p>You no longer need to buy it. You can check the list again for other available items.</p>
                    <br/>
                    <p>Thank you,</p>
                    <p><strong>Gift List</strong></p>
                </div>
            `
            : `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #007AFF;">Aggiornamento Gift List</h2>
                    <p>Ciao,</p>
                    <p>Il regalo <b>"${itemName}"</b> che avevi prenotato sulla lista <b>"${listName}"</b> è stato rimosso dal festeggiato.</p>
                    <p>Non è più necessario acquistarlo. Puoi consultare nuovamente la lista per scoprire altri regali disponibili.</p>
                    <br/>
                    <p>Grazie,</p>
                    <p><strong>Gift List</strong></p>
                </div>
            `;

        await transporter.sendMail({
            from: `"Gift List" <${SMTP_USER}>`,
            to: guestEmail,
            subject,
            text,
            html,
        });

        console.log(`[Email Server] Notification sent successfully to: ${guestEmail}`);
    } catch (error) {
        console.error(`[Email Server] Failed to send email to ${guestEmail}:`, error);
    }
};
