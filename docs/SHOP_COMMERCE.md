# NUMU shop commerce

The v1 catalogue is local and typed: edit `src/lib/commerce/catalogue.ts`. Only records that are not `draft` or `archived` render in the shop. AED values are integer fils (`125000` is AED 1,250); USD is only an indicative display conversion.

## Adding or updating a product

Add a `Product` record with a unique ID and slug, local images in `public/images`, descriptive alt text, a transaction mode, and status. Add final commercial data only when supplied: `priceAed`, `leadTime`, dimensions, packaging, variant availability, and shipping rules. `purchase` and `made_to_order` records need both `priceAed` and a Stripe `stripePriceId` before server checkout can begin. `inquiry` never enters the cart. `booking` uses `bookingUrl`; use `NEXT_PUBLIC_CAL_HOTLINE_URL` for the Hotline.

## Shipping and pickup

Enter courier-approved AED-fils rates in `MANUAL_SHIPPING_RATES` in `src/lib/commerce/shipping.ts`, by country and shipping class. An absent rate intentionally blocks checkout. UAE pickup is free and can be described after confirmation unless `NEXT_PUBLIC_NUMU_PICKUP_LOCATION` is supplied. Final packing weight, dimensions, customs description, HS code, origin, delivery terms, VAT, duties, returns, damage, and made-to-order cancellation terms still need business/legal approval before launch.

## Stripe and orders

Required when checkout is enabled: `STRIPE_SECRET_KEY`, `ORDER_NOTIFICATION_EMAIL`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`. `CONTACT_TO_EMAIL` remains a fallback. The checkout endpoint validates product, variant, price configuration, region, pickup, and shipping server-side and then creates an AED Stripe Checkout Session. It deliberately does not persist an order: this project has no database or existing durable store. Configure a Stripe webhook plus a chosen durable order store before public commerce launch; save the session ID, customer email, authoritative items/prices, shipping method/charge, destination, status, and timestamps there. `STRIPE_WEBHOOK_SECRET` will be required for that webhook.

## Future courier integration

`shippingRate` is the single manual-rate boundary. Replace or extend it with an Aramex/DHL provider only after credentials and confirmed commercial rules are available. Keep server-side quote validation; never accept a shipping amount from the browser.
