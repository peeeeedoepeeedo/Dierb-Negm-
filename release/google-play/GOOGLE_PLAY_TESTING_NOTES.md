# Google Play Release Testing Notes

Run this checklist on the AAB installed from Play Internal Testing, not only on a sideloaded APK.

## Customer app
- Cold launch opens production HTTPS origin without browser chrome after Digital Asset Links verification.
- Register/login/logout.
- Session survives normal app restart.
- Search stores/products/services/listings.
- Product → cart → address → coupon → checkout → order.
- Account/profile/address edits save to backend.
- Messages and notifications load for the signed-in user only.
- Support ticket create/read/reply flow.
- Account deletion revokes sessions.
- External phone/WhatsApp links open safely.
- Offline/network failure shows a recoverable state instead of an unhandled error.

## Business app
- Login with approved business review account.
- Dashboard loads real data.
- Store/profile management.
- Product create/edit and inventory changes.
- Order status flow.
- Offers/coupons/ads/subscription screens.
- Analytics, notifications and messages.

## Device/layout
Test at least a small phone, common phone and tablet form factor. Confirm RTL layout, back navigation, no accidental horizontal overflow and usable forms/tables.

## Security smoke tests
- Customer cannot access admin APIs/pages.
- Merchant cannot modify another merchant's store/product.
- Conversation outsider cannot read/send.
- Driver cannot access unrelated delivery.
- Frontend price/discount tampering does not change server-calculated totals.
