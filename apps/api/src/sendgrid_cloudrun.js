import { GoogleAuth } from 'google-auth-library';

/**
 * @param {import('@repo/types').CorpForm} order
 */
export async function sendCorporateOrderEmail(order) {
    const functionUrl = process.env.CORPORATE_ORDERS_FUNCTION_URL;
    if (!functionUrl) {
        throw new Error('CORPORATE_ORDERS_FUNCTION_URL is not configured.');
    }

    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(functionUrl);
    await client.request({
        url: functionUrl,
        method: 'POST',
        data: order,
    });
}
