// This Cloud Function handles corporate order requests and sends an email notification using SendGrid.
// It is triggered by an HTTP POST request containing the order details in JSON format.

const sgMail = require("@sendgrid/mail");

function isValidOrder(order) {
    if (!order || typeof order !== "object" || Array.isArray(order)) {
        return false;
    }

    const { companyName, contactEmail, quantity, deliveryDate, notes } = order;
    const date = typeof deliveryDate === "string"
        ? Date.parse(`${deliveryDate}T00:00:00.000Z`)
        : NaN;

    return typeof companyName === "string"
        && Boolean(companyName.trim())
        && typeof contactEmail === "string"
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
        && typeof quantity === "number"
        && Number.isInteger(quantity)
        && quantity >= 5
        && Number.isFinite(date)
        && new Date(date).toISOString().slice(0, 10) === deliveryDate
        && (notes === undefined || typeof notes === "string");
}

exports.corporateOrdersMail = async (req, res) => {
    if (req.method !== "POST") {
        res.set("Allow", "POST");
        return res.status(405).json({ error: "Only POST is allowed." });
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.SENDGRID_FROM_EMAIL;
    const to = process.env.CORPORATE_ORDERS_EMAIL;

    if (!apiKey || !from || !to) {
        console.error("SendGrid configuration is incomplete.");
        return res.status(500).json({ error: "Email service is not configured." });
    }

    const order = req.body;
    if (!isValidOrder(order)) {
        return res.status(400).json({ error: "Invalid corporate order." });
    }

    try {
        sgMail.setApiKey(apiKey);
        await sgMail.send({
            to,
            from,
            replyTo: order.contactEmail,
            subject: `Corporate order request from ${order.companyName}`,
            text: [
                "New corporate order request",
                `Company: ${order.companyName}`,
                `Contact email: ${order.contactEmail}`,
                `Quantity: ${order.quantity}`,
                `Target delivery date: ${order.deliveryDate}`,
                `Notes: ${order.notes || "(none)"}`,
            ].join("\n"),
        });
        return res.status(200).json({ result: "Corporate order email sent." });
    } catch (error) {
        console.error("Failed to send corporate order email:", error);
        return res.status(500).json({ error: "Failed to send email." });
    }
};