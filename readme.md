# Prairie Joy Baskets (PJB_app) — Documentation

**Author:** Daniel Gorelkin - Dgoralkin@Github  
**Description:** Prairie Joy Baskets app is a cloud-based full-stack (Cloud SQL Postgres based) monorepo application for a web and mobile B2B/B2C platform.

## Corporate order email notifications

Corporate-order notifications are sent by the IAM-protected `corporate-orders-mail` Cloud Run function after the API saves each request. The API obtains a Google-signed ID token from its runtime service account and calls the function with an HTTP POST. Do not expose the function URL to the browser or allow unauthenticated invocation.

Create a dedicated runtime identity and grant it access to the SendGrid API key stored in Secret Manager:

```powershell
gcloud iam service-accounts create sendgrid-mailer `
  --project=prairiejoybaskets `
  --display-name="SendGrid mail service"

gcloud secrets add-iam-policy-binding sendgrid-api-key `
  --project=prairiejoybaskets `
  --member="serviceAccount:sendgrid-mailer@prairiejoybaskets.iam.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor"
```

Deploy the Functions Framework handler as a private Cloud Run function:

```powershell
gcloud run deploy corporate-orders-mail `
  --source=cloud-functions/corporate-orders `
  --function=corporateOrdersMail `
  --base-image=nodejs22 `
  --region=northamerica-northeast1 `
  --service-account=sendgrid-mailer@prairiejoybaskets.iam.gserviceaccount.com `
  --no-allow-unauthenticated `
  --set-secrets=SENDGRID_API_KEY=sendgrid-api-key:latest `
  --set-env-vars=SENDGRID_FROM_EMAIL=verified-sender@example.com,CORPORATE_ORDERS_EMAIL=orders@example.com
```

Replace the example sender, recipient, and Secret Manager secret name with the production values. The `cloud-sql-sa` identity used by the API Cloud Run service needs permission to invoke the function:

```powershell
gcloud run services add-iam-policy-binding corporate-orders-mail `
  --region=northamerica-northeast1 `
  --member="serviceAccount:cloud-sql-sa@prairiejoybaskets.iam.gserviceaccount.com" `
  --role="roles/run.invoker"
```

Get the function URL:

```powershell
gcloud run services describe corporate-orders-mail `
  --region=northamerica-northeast1 `
  --format="value(status.url)"
```

Configure the API service with that URL (the API runtime service account is set in `cloudbuild.yaml`):

```powershell
gcloud run services update prairiejoy-api `
  --region=northamerica-northeast1 `
  --update-env-vars=CORPORATE_ORDERS_FUNCTION_URL=FUNCTION_URL
```

If email delivery fails, the request remains saved and the API logs the notification error; the response and confirmation screen indicate that the team email was not sent.
