# Dierb native applications

ثلاثة تطبيقات Expo/React Native مستقلة. التطبيقات لا تحتوي على بيانات تجريبية ولا تتصل بقاعدة البيانات مباشرة.

```bash
npm install
npm run typecheck
npm run start:customer
npm run prebuild:customer
```

اضبط `EXPO_PUBLIC_API_BASE_URL` في بيئة البناء على عنوان HTTPS للـAPI من دون `/api/v1`.
