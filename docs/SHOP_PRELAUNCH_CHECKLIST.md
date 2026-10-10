# NUMU shop pre-launch checklist

## Catalogue and imagery

- Replace the development-only Shop Review Object; it is automatically excluded from production.
- Add confirmed prices in AED fils, Stripe Price IDs, variants, stock/edition information, lead times, weights, dimensions, packaging, customs data, origin, and final photography.
- Confirm which items can ship within UAE and GCC, which require inquiry, and which support collection.

## Fulfilment, legal, and customer communication

- Enter courier-approved shipping rates by country and shipping class.
- Set the collection location or confirm post-order collection wording.
- Approve returns, cancellation, made-to-order, damage, delivery, VAT, duty/import-fee, payment-processing, and data-retention language before publishing it.
- Update Terms and Privacy only after the above language has legal/business approval.

## Payments and orders

- Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ORDER_NOTIFICATION_EMAIL`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` in the hosted environment.
- Configure Stripe Price IDs in catalogue records and use a test Price ID in `STRIPE_DEV_REVIEW_PRICE_ID` only for local review.
- Register `/api/shop/webhook` with Stripe and connect a durable OrderStore. Store the Checkout Session ID as an idempotency key alongside items, canonical AED prices, shipping, destination, status, email, and timestamps.
- Run Stripe test-mode checkout for UAE delivery, UAE pickup, and an allowed GCC country. Confirm success, cancellation, webhook receipt, and order notification.

## Final QA

- Remove local test cart data, review all public product routes, then verify small/large mobile, keyboard navigation, form errors, images, and social metadata.
- Confirm that production does not show any development fixture, incomplete product data, unconfigured booking link, or unapproved legal claim.
