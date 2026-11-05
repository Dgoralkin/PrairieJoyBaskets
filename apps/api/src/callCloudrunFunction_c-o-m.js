// This function sends a corporate order email by invoking a Google Cloud Run function. 
// It uses the Google Auth library to obtain an ID token for authentication and makes a 
// POST request to the specified Cloud Run function URL with the order details.
// The response from the Cloud Run function is returned, including the status code and any result or error message.

import { GoogleAuth } from 'google-auth-library';

export async function callCloudRunFunc_COM(order) {
    // 1. Point the destination request to your External Load Balancer
    // e.g. "https://34.160.158.137/api/v1/submit_corpform"
    // "I am Service Account X. Please give me a signed token showing I intend to talk to the audience https://corporate-orders-mail-xxxx.run.app."
    const lbUrl = process.env.CORPORATE_ORDERS_FUNCTION_URL;
    if (!lbUrl) {
        throw new Error('CORPORATE_ORDERS_FUNCTION_URL is not configured.');
    }

    // 2. Set the token audience to your underlying native Cloud Run/Function default URL
    // e.g., "https://corporate-orders-mail-618983862687.northamerica-northeast1.run.app"
    const backendAudience = process.env.CORPORATE_ORDERS_FUNCTION_URL_DIRECT;
    if (!backendAudience) {
        throw new Error('BACKEND_AUDIENCE_URL (default Cloud Run url) is not configured.');
    }

    const auth = new GoogleAuth();
    
    // Fetch the client with the audience claim matching the native backend
    const client = await auth.getIdTokenClient(backendAudience);
    
    // Fire the request to the Load Balancer, passing the correct ID token
    const response = await client.request({
        url: lbUrl,
        method: 'POST',
        data: order,
        validateStatus: () => true,
    });

    return {
        status: response.status,
        data: response.data,
    };
}

