declare namespace Cloudflare {
  interface Env {
    QSE_TRUST_SITES_IDENTITY?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
