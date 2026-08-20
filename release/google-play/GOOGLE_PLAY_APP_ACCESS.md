# Google Play App Access — Dierb Online

## Customer app
Public browsing/search may be available without an account, but ordering, favorites, messages, notifications, support and account settings require authentication.

For Play review, create a dedicated non-admin review account in the production environment before submission. Enter the credentials only in Play Console App Access; do not commit them to GitHub or include them in screenshots/docs.

Suggested reviewer path:
1. Open ديرب أونلاين.
2. Sign in with the Play review customer account.
3. Open Search and a public store/product.
4. Add an item to cart and open checkout without placing an unwanted real order unless test data is intentionally configured for review.
5. Open Account, Notifications, Messages and Support.

## Business app
Business features require an authenticated merchant or service-provider role. Create a dedicated Play review business account with an already approved test store/provider profile so Google reviewers are not blocked by an admin-approval wait.

Suggested reviewer path:
1. Open ديرب بيزنس.
2. Sign in with the Play review business account.
3. Open dashboard.
4. View store/profile, products/inventory, orders, offers/coupons, analytics, notifications and messages.

## Restrictions
- Never give Google a Super Admin credential.
- Never store reviewer passwords in this repository.
- Keep review accounts isolated from real customer/business data.
- If any screen requires a special PIN, OTP, whitelisted phone or external approval, explain that exact step in Play Console before submission.
