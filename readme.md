# Prairie Joy Baskets (PJB_app) — Documentation

**Author:** Daniel Gorelkin - Dgoralkin@Github  
**Description:** Prairie Joy Baskets app is a cloud-based full-stack (Cloud SQL Postgres based) monorepo application for a web and mobile B2B/B2C platform.

## Corporate order email notifications

The API sends corporate-order notifications through SendGrid after saving each request. Configure these variables in the API environment (never in the web app):

- `SENDGRID_API_KEY`: SendGrid API key.
- `SENDGRID_FROM_EMAIL`: verified SendGrid sender address.
- `CORPORATE_ORDERS_EMAIL`: inbox that receives corporate order requests.

If email delivery fails, the request remains saved and the API logs the notification error; the response and confirmation screen indicate that the team email was not sent.
