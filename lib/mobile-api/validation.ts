import { MobileApiError } from "./http";

export function optionalText(params: URLSearchParams, key: string, maximumLength = 120) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const value = raw.trim();
  if (value.length > maximumLength) {
    throw new MobileApiError(400, "VALIDATION_ERROR", `قيمة ${key} أطول من المسموح.`, { field: key, maximumLength });
  }
  return value;
}

export function positiveInteger(params: URLSearchParams, key: string, fallback: number, maximum: number) {
  const raw = params.get(key);
  if (raw === null || raw === "") return fallback;
  if (!/^\d+$/.test(raw)) {
    throw new MobileApiError(400, "VALIDATION_ERROR", `قيمة ${key} يجب أن تكون رقمًا صحيحًا موجبًا.`, { field: key });
  }
  const value = Number(raw);
  if (value < 1 || value > maximum) {
    throw new MobileApiError(400, "VALIDATION_ERROR", `قيمة ${key} خارج النطاق المسموح.`, { field: key, minimum: 1, maximum });
  }
  return value;
}
