# Google Play Upload Checklist — Dierb Online 1.0.0

## Customer app
- App name: ديرب أونلاين
- Package: `com.dierbonline.app`
- Version name: `1.0.0`
- Version code: `1`

## Business app
- App name: ديرب بيزنس
- Package: `com.dierbonline.business`
- Version name: `1.0.0`
- Version code: `1`

## Before upload
1. Confirm production site/API is healthy over HTTPS.
2. Confirm `/.well-known/assetlinks.json` is publicly reachable on the production host.
3. Confirm Privacy Policy, Terms, Account Deletion, and Content Policy URLs are publicly reachable.
4. Confirm the uploaded AAB is signed with the preserved Dierb upload key and that the package/version values match this checklist.
5. Enroll each app in Play App Signing when prompted.

## Play Console sequence
1. Create the app with the exact package/app identity above.
2. Complete Store Listing using the prepared customer/business listing files.
3. Add app icon, feature graphic, and real screenshots from the final build.
4. App content → Privacy policy: use `/privacy` on the production domain.
5. App content → Ads: follow `GOOGLE_PLAY_ADS_DECLARATION.md`.
6. App content → App access: follow `GOOGLE_PLAY_APP_ACCESS.md`.
7. App content → Content rating: follow `GOOGLE_PLAY_CONTENT_RATING.md` and answer the live Play questionnaire truthfully.
8. App content → Target audience: choose the actual intended audience; do not claim a children-focused app unless the product is changed for that purpose.
9. Data safety: complete from `GOOGLE_PLAY_DATA_SAFETY.md` and re-check against the final production configuration.
10. Account deletion: use the public `/account-deletion` URL and verify in-app deletion works.
11. Permissions/declarations: follow `GOOGLE_PLAY_PERMISSIONS.md`.
12. Upload the signed `.aab` to Internal Testing first.
13. Install from Play Internal Testing and run the release smoke test in `GOOGLE_PLAY_TESTING_NOTES.md`.
14. Resolve every automated/pre-launch report issue that is reproducible.
15. Move to the testing track required by the developer account, then production when Google permits it.

## Do not upload
- Keystores or signing passwords.
- `.env` files.
- Database credentials.
- Test-only builds that point to localhost/staging.
