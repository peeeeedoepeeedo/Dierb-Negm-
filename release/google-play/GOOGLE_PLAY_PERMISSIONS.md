# Google Play Permissions — Android 1.0.0

## Current native Android manifest
The TWA shell requests only:
- `android.permission.INTERNET`

No native contacts, phone state, SMS, storage, camera, microphone, background location or precise location permission is requested by the Android shell in version 1.0.0.

Web features may ask the browser for a permission at point of use (for example location or file selection) only when the user invokes that feature. Those browser prompts must remain optional unless the feature inherently needs them.

## Submission check
Before every Play release, inspect the merged release manifest from the final AAB and update this document/Play declarations if a new native permission is introduced.
