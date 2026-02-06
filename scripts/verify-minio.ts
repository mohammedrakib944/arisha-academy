import "dotenv/config"; // Load environment variables
import { minioClient, MINIO_BUCKET, ensureBucketExists } from "@/lib/minio";

async function verifyMinio() {
    console.log("Starting MinIO verification...");
    console.log("Endpoint:", process.env.NEXT_PUBLIC_MINIO_ENDPOINT);

    try {
        console.log("Checking bucket existence...");
        await ensureBucketExists();
        console.log("Bucket check passed.");

        const testFile = "test-upload.txt";
        const content = "Hello MinIO";

        console.log(`Uploading ${testFile}...`);
        await minioClient.putObject(MINIO_BUCKET, testFile, content);
        console.log("Upload successful.");

        console.log(`Verifying file existence...`);
        const stat = await minioClient.statObject(MINIO_BUCKET, testFile);
        console.log("File found:", stat);

        console.log(`Deleting ${testFile}...`);
        await minioClient.removeObject(MINIO_BUCKET, testFile);
        console.log("Deletion successful.");

        console.log("MinIO verification COMPLETED SUCCESSFULLY.");
    } catch (error) {
        console.error("MinIO verification FAILED:", error);
        process.exit(1);
    }
}

verifyMinio();
