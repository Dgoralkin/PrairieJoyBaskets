// This function sends a corporate order email by invoking a Google Cloud Run function. 
// It uses the Google Auth library to obtain an ID token for authentication and makes a 
// POST request to the specified Cloud Run function URL with the order details.
// The response from the Cloud Run function is returned, including the status code and any result or error message.

import { GoogleAuth } from 'google-auth-library';

export async function callCloudRunFunc_COM(order) {
    const functionUrl = process.env.CORPORATE_ORDERS_FUNCTION_URL;
    if (!functionUrl) {
        throw new Error('CORPORATE_ORDERS_FUNCTION_URL is not configured.');
    }

    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(functionUrl);
    const response = await client.request({
        url: functionUrl,
        method: 'POST',
        data: order,
        validateStatus: () => true,
    });

    return {
        status: response.status,
        data: response.data,
    };
}
