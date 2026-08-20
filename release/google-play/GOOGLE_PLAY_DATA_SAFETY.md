# Google Play Data Safety — Dierb Online

This file is a mapping from the current application features to the Play Console Data Safety form. Re-check it against the final production configuration immediately before submission.

## Data collected by current product flows

### Personal info
- Name: account/profile and business/provider profiles.
- Email address: account login/profile when supplied.
- Phone number: account/profile, stores, service providers, listings, delivery/support where required.

Purpose: account management, user-to-business contact, order/service fulfillment, fraud/security controls, support.

### Address and approximate/precise location
- Saved delivery addresses are collected when the user adds them.
- Latitude/longitude fields exist for addresses/stores when the user chooses location-enabled features.
- Device location should only be requested at point of use and with Android/browser permission.

Purpose: delivery, local search, store/service discovery.

### User content
- Community posts/comments.
- Questions/answers.
- Classified, car, real-estate and job listing content.
- Reviews.
- Messages and support ticket messages.
- Uploaded images/files when enabled by the relevant feature.

Purpose: core user-facing functionality, moderation, support and safety.

### Purchases/order activity
- Orders, order items, totals, discounts, status history and delivery state.
- Subscription/payment transaction metadata may be stored when a real payment provider is enabled.

Current rule: do not declare storage of card/bank credentials unless a future payment provider actually sends those details to Dierb. The current payment abstraction must not claim successful online payment without a configured provider.

### App activity and analytics
- Store/product/service views.
- Search queries and result clicks.
- Favorites.
- Add-to-cart and checkout started.
- Order created.
- Phone/WhatsApp clicks.
- Ad impressions/clicks.

Purpose: product functionality, analytics, merchant/admin reporting and abuse prevention.

### Device/technical data
- Session/user-agent and security-related request metadata may be processed by the backend/hosting platform.

Purpose: authentication, security, diagnostics and abuse prevention.

## Sharing
Dierb does not sell user data. Data necessary to complete a transaction/service may be visible to the parties involved, such as a customer and the relevant merchant/provider/driver. Hosting, database, storage, email/SMS or payment processors may process data strictly to provide their configured service.

## Security statements
- Production traffic must use HTTPS.
- Authentication uses server-side sessions and HttpOnly cookies for the web application.
- Authorization is checked server-side.
- Production secrets are not committed to the public repository.
- Account deletion is available in-app and documented publicly.

## Required final check before Play submission
1. Confirm whether email/SMS providers are enabled.
2. Confirm whether online payment is enabled and what data the provider processes.
3. Confirm whether native/browser location permission is used in the submitted build.
4. Confirm production object storage provider and retention policy.
5. Update Play answers if any production feature differs from this file.
