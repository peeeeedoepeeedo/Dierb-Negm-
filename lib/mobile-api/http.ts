export class MobileApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "MobileApiError";
  }
}

function meta(request: Request) {
  const supplied = request.headers.get("x-request-id")?.trim();
  return {
    requestId: supplied && supplied.length <= 128 ? supplied : crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}

const baseHeaders = { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" };

export function apiSuccess<T>(request: Request, data: T, status = 200) {
  const responseMeta = meta(request);
  return Response.json({ success: true, data, meta: responseMeta }, {
    status,
    headers: { ...baseHeaders, "x-request-id": responseMeta.requestId },
  });
}

export function apiFailure(request: Request, error: unknown) {
  const responseMeta = meta(request);
  const known = error instanceof MobileApiError;
  return Response.json({
    success: false,
    error: {
      code: known ? error.code : "INTERNAL_ERROR",
      message: known ? error.message : "حدث خطأ غير متوقع. حاول مرة أخرى.",
      ...(known && error.details ? { details: error.details } : {}),
    },
    meta: responseMeta,
  }, {
    status: known ? error.status : 500,
    headers: { ...baseHeaders, "x-request-id": responseMeta.requestId },
  });
}

export async function withMobileApi(request: Request, handler: () => Promise<Response>) {
  try { return await handler(); } catch (error) { return apiFailure(request, error); }
}
