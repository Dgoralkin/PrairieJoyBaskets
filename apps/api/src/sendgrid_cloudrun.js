import sgMail from '@sendgrid/mail';

/**
 * @param {import('@repo/types').CorpForm} order
 */
export async function sendCorporateOrderEmail(order) {
    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.SENDGRID_ACCOUNT;
    const to = process.env.SENDGRID_ACCOUNT;

    if (!apiKey || !from || !to) {
        throw new Error(
            'SendGrid is not configured. Set SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, and CORPORATE_ORDERS_EMAIL.'
        );
    }

    sgMail.setApiKey(apiKey);
    await sgMail.send({
        to,
        from,
        replyTo: order.contactEmail,
        subject: `Corporate order request from ${order.companyName}`,
        text: [
            'New corporate order request',
            `Company: ${order.companyName}`,
            `Contact email: ${order.contactEmail}`,
            `Quantity: ${order.quantity}`,
            `Target delivery date: ${order.deliveryDate}`,
            `Notes: ${order.notes || '(none)'}`,
        ].join('\n'),
    });
}
