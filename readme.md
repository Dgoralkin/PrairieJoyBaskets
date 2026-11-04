# Prairie Joy Baskets (PJB_app) — Documentation

**Author:** Daniel Gorelkin - Dgoralkin@Github  
**Description:** Prairie Joy Baskets app is a cloud-based full-stack (Cloud SQL Postgres based) monorepo application for a web and mobile B2B/B2C platform.

## Corporate order email notifications

Corporate-order notifications are sent by the IAM-protected `corporate-orders-mail` Cloud Function after the API saves each request. The API obtains a Google-signed ID token from its runtime service account and calls the function with an HTTP POST. Do not expose the function URL to the browser or allow unauthenticated invocation.

Deploy the function from `cloud-functions/corporate-orders` with the `corporateOrdersMail` entry point, HTTP trigger, and unauthenticated invocation disabled:

```powershell
gcloud functions deploy corporate-orders-mail `
  --gen2 `
  --runtime=nodejs22 `
  --region=northamerica-northeast1 `
  --source=cloud-functions/corporate-orders `
  --entry-point=corporateOrdersMail `
  --trigger-http `
  --no-allow-unauthenticated `
  --set-secrets=SENDGRID_API_KEY=sendgrid-api-key:latest `
  --set-env-vars=SENDGRID_FROM_EMAIL=verified-sender@example.com,CORPORATE_ORDERS_EMAIL=orders@example.com
```

Replace the example sender, recipient, and Secret Manager secret name with the production values. Grant the function's runtime service account access to the SendGrid secret. Grant the API runtime service account invocation permission, then configure the API's `CORPORATE_ORDERS_FUNCTION_URL` environment variable with the function URI:

For this Gen 2 function, grant invocation on its underlying Cloud Run service to the API runtime service account:

```powershell
gcloud run services add-iam-policy-binding corporate-orders-mail `
  --region=northamerica-northeast1 `
  --member="serviceAccount:cloud-sql-sa@prairiejoybaskets.iam.gserviceaccount.com" `
  --role="roles/run.invoker"
```

Replace `FUNCTION_URI` below with the URI returned by `gcloud functions describe` (and keep the same runtime service account when deploying the API):

```powershell
gcloud functions describe corporate-orders-mail `
  --gen2 `
  --region=northamerica-northeast1 `
  --format="value(serviceConfig.uri)"
```

```powershell
gcloud run services update prairiejoy-api `
  --region=northamerica-northeast1 `
  --update-env-vars=CORPORATE_ORDERS_FUNCTION_URL=FUNCTION_URI
```

If email delivery fails, the request remains saved and the API logs the notification error; the response and confirmation screen indicate that the team email was not sent.
