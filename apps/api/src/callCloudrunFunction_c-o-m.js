// This function sends a corporate order email by invoking a Google Cloud Run function. 
// It uses the Google Auth library to obtain an ID token for authentication and makes a 
// POST request to the specified Cloud Run function URL with the order details.

// Called by the API after it saves a corporate order. This sends the order to the
// email function through the load balancer and returns that function's HTTP response.
// The browser's /api/v1/submit_corpform request is handled separately by the API.

import { GoogleAuth } from 'google-auth-library';

export async function callCloudRunFunc_COM(order) {
    // This is the URL the API calls. The load balancer must route this email path
    // to corporate-orders-mail, not back to the API's submit_corpform handler.
    // Example: https://<load-balancer-host>/api/v1/submit_email
    const lbUrl = process.env.CORPORATE_ORDERS_FUNCTION_URL;
    if (!lbUrl) {
        throw new Error('CORPORATE_ORDERS_FUNCTION_URL is not configured.');
    }

    // The ID token audience is the target Cloud Run service's canonical run.app URL.
    // It is intentionally different from lbUrl, which is the load-balancer request URL.
    const backendAudience = process.env.CORPORATE_ORDERS_FUNCTION_URL_DIRECT;
    if (!backendAudience) {
        throw new Error('BACKEND_AUDIENCE_URL (default Cloud Run url) is not configured.');
    }

    const auth = new GoogleAuth();
    
    // The client attaches an ID token whose audience identifies the target service.
    const client = await auth.getIdTokenClient(backendAudience);
    
    // Send the email request through the load balancer; the token audience remains
    // the Cloud Run service URL even though the request goes to the load balancer.
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

