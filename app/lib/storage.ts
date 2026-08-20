import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 5 * 1024 * 1024;
export type UploadArea = "avatars" | "stores" | "products" | "community" | "classifieds" | "services" | "ads" | "reviews" | "messages";
export interface StorageAdapter { put(key: string, bytes: ArrayBuffer, type: string): Promise<void>; remove(key: string): Promise<void>; privateUrl(key: string, expiresInSeconds: number): Promise<string> }

export function validateImageUpload(file: File) {
  if (!allowed.has(file.type)) throw Response.json({ error: "نوع الملف غير مسموح" }, { status: 415 });
  if (file.size < 1 || file.size > maxBytes) throw Response.json({ error: "حجم الصورة يجب ألا يتجاوز 5MB" }, { status: 413 });
}

export function ownedObjectKey(area: UploadArea, userId: string, filename: string) {
  const ext = filename.toLowerCase().match(/\.(jpe?g|png|webp|avif)$/)?.[1];
  if (!ext) throw Response.json({ error: "امتداد الملف غير مسموح" }, { status: 415 });
  return `${area}/${userId}/${crypto.randomUUID()}.${ext.replace("jpeg", "jpg")}`;
}

function required(name: string) { const value = process.env[name]; if (!value) throw new Error(`${name} is required for S3 storage`); return value; }

export class S3StorageAdapter implements StorageAdapter {
  private readonly bucket = required("S3_BUCKET");
  private readonly client = new S3Client({
    endpoint: required("S3_ENDPOINT"),
    region: required("S3_REGION"),
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: { accessKeyId: required("S3_ACCESS_KEY_ID"), secretAccessKey: required("S3_SECRET_ACCESS_KEY") },
  });
  async put(key: string, bytes: ArrayBuffer, type: string) {
    if (!allowed.has(type) || bytes.byteLength < 1 || bytes.byteLength > maxBytes) throw new Error("Rejected unsafe storage upload");
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: new Uint8Array(bytes), ContentType: type, CacheControl: "private, max-age=0, no-store" }));
  }
  async remove(key: string) { await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key })); }
  privateUrl(key: string, expiresInSeconds: number) {
    return getSignedUrl(this.client, new GetObjectCommand({ Bucket: this.bucket, Key: key }), { expiresIn: Math.min(Math.max(expiresInSeconds, 30), 3600) });
  }
}

export function getStorage(): StorageAdapter {
  if ((process.env.STORAGE_DRIVER ?? "s3") !== "s3") throw new Error("Only the production-safe S3 storage driver is enabled");
  return new S3StorageAdapter();
}
