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
6. After Play App Signing is enabled, copy each app's **App signing key certificate SHA-256 fingerprint** from Play Console and add it to that package entry in `/.well-known/assetlinks.json` alongside the upload-key fingerprint, redeploy the web app, and verify the asset-links URL before relying on the Trusted Web Activity in a Play-installed build. The certificate used by Google Play to deliver the app is different from the upload key.

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
13. Copy the Play App Signing SHA-256 fingerprint into `assetlinks.json`, redeploy, then install the Play-delivered build and confirm it opens as a verified TWA without browser chrome.
14. Run the release smoke test in `GOOGLE_PLAY_TESTING_NOTES.md`.
15. Resolve every automated/pre-launch report issue that is reproducible.
16. Move to the testing track required by the developer account, then production when Google permits it.

## Do not upload
- Keystores or signing passwords.
- `.env` files.
- Database credentials.
- Test-only builds that point to localhost/staging.
