import * as Minio from "minio";

const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || "http://localhost:9000";
// Parse URL to get hostname and port
const url = new URL(minioEndpoint);
const useSSL = url.protocol === "https:";
const port = url.port ? parseInt(url.port) : useSSL ? 443 : 80;

export const minioClient = new Minio.Client({
    endPoint: url.hostname,
    port: port,
    useSSL: useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

export const MINIO_BUCKET = process.env.MINIO_BUCKET || "uploads";

// Helper to ensure bucket exists
export async function ensureBucketExists() {
    try {
        const exists = await minioClient.bucketExists(MINIO_BUCKET);
        if (!exists) {
            await minioClient.makeBucket(MINIO_BUCKET, "us-east-1");
            console.log(`Bucket ${MINIO_BUCKET} created.`);

            // Set policy to public read-only for uploads
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`],
                    },
                ],
            };
            await minioClient.setBucketPolicy(MINIO_BUCKET, JSON.stringify(policy));
            console.log(`Bucket ${MINIO_BUCKET} policy set to public read.`);
        }
    } catch (error) {
        console.error("Error creating bucket:", error);
    }
}
