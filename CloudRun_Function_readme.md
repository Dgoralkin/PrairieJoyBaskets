# Prairie Joy Baskets (PJB_app) — Documentation

**Author:** Daniel Gorelkin - Dgoralkin@Github  
**Description:** Prairie Joy Baskets app is a cloud-based full-stack (Cloud SQL Postgres based) monorepo application for a web and mobile B2B/B2C platform.

## Corporate order email notifications

### Execution flow

1. The browser sends one `POST /api/v1/submit_corpform` request to the external Application Load Balancer. The `/api/*` route sends it to the `prairiejoy-api` Cloud Run service.
2. The API validates the form, assigns a unique `co`-prefixed UUID, and inserts one row into `corporate_orders` in Cloud SQL. A database error returns `500` and stops processing.
3. After the insert succeeds, the API calls `callCloudRunFunc_COM`. It obtains a Google-signed OIDC ID token using the API service's runtime service account, then posts the order through the load balancer.
4. The load balancer routes `POST /api/v1/submit_email` to the IAM-protected `corporate-orders-mail` Cloud Run function. That function validates the order and sends the email through SendGrid; it does not insert a database row.
5. The API responds with `201` and a `notificationSent` result. If email delivery fails, the saved order remains in the database and `notificationSent` is `false`.

The form path and email path must route to different backends. In particular, `CORPORATE_ORDERS_FUNCTION_URL` must never point to `/api/v1/submit_corpform`, or the email call will invoke the form handler again and attempt another database insert. Do not expose the function to the browser or allow unauthenticated invocation.

### Load balancer routes

Configure the external Application Load Balancer URL map with these routes:

| Path | Backend |
| --- | --- |
| `/api/v1/submit_email` | Serverless NEG for `corporate-orders-mail` |
| `/api/*` | `prairiejoy-api` |
| Unmatched paths | `prairiejoy-web-frontend` |

### Optional TLS hostname with sslip.io

`34.160.158.137.sslip.io` is a public dynamic-DNS hostname that resolves to `34.160.158.137`. You can try it for the load balancer's HTTPS hostname. Google-managed certificate issuance is not guaranteed for a shared dynamic-DNS domain; the certificate's reported status is the source of truth. For production, prefer a domain you control.

Create a global Google-managed certificate:

```powershell
gcloud compute ssl-certificates create pjb-sslip-cert `
  --domains=34.160.158.137.sslip.io `
  --global
```

Attach it to the global target HTTPS proxy. First inspect the certificates currently attached:

```powershell
gcloud compute target-https-proxies describe prairiejoy-url-map-target-proxy-2 `
  --global `
  --format="value(sslCertificates)"
```

The update replaces the proxy's attached certificate list. Include any existing certificate names as well as `pjb-sslip-cert`; if there are no existing certificates, use just `pjb-sslip-cert`:

```powershell
gcloud compute target-https-proxies update prairiejoy-url-map-target-proxy-2 `
  --ssl-certificates=EXISTING_CERT,pjb-sslip-cert `
  --global `
  --global-ssl-certificates
```

Check provisioning status and wait for `ACTIVE` before using the hostname:

```powershell
gcloud compute ssl-certificates describe pjb-sslip-cert `
  --global `
  --format="yaml(managed.status,managed.domainStatus)"
```

Once active, configure the API's load-balancer request URL with the email-function path, not the corporate-form path:

```text
CORPORATE_ORDERS_FUNCTION_URL=https://34.160.158.137.sslip.io/api/v1/submit_email
```

Keep `CORPORATE_ORDERS_FUNCTION_URL_DIRECT` set to the function's canonical `run.app` URL; it remains the OIDC token audience. Do not use the sslip.io URL as the audience, point the email URL at `/api/v1/submit_corpform`, or disable TLS certificate verification.

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

Get the function's canonical URL. This URL is the OIDC token audience, not the URL used for the HTTP request through the load balancer:

```powershell
gcloud run services describe corporate-orders-mail `
  --region=northamerica-northeast1 `
  --format="value(status.url)"
```

Configure the API service with two distinct URLs (the API runtime service account is set in `cloudbuild.yaml`):

```powershell
gcloud run services update prairiejoy-api `
  --region=northamerica-northeast1 `
  --update-env-vars="CORPORATE_ORDERS_FUNCTION_URL=https://<load-balancer-host>/api/v1/submit_email,CORPORATE_ORDERS_FUNCTION_URL_DIRECT=https://corporate-orders-mail-618983862687.northamerica-northeast1.run.app"
```

`CORPORATE_ORDERS_FUNCTION_URL` is the load-balancer URL routed to the email function. `CORPORATE_ORDERS_FUNCTION_URL_DIRECT` is the function's canonical `run.app` URL used as the ID token audience. Grant the API runtime service account `roles/run.invoker` on `corporate-orders-mail`.

After changing either environment variable, deploy a new API revision and verify that the API log shows its outbound POST to `/api/v1/submit_email`. If email delivery fails, the order remains saved; inspect the `notificationResponse` and API logs for the function error.
