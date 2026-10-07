import { DeleteBucket$, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import crypto from "crypto";
import path from "path";

const s3 = new S3Client({ 
  endpoint: process.env.B2_ENDPOINT,
  region: 'us-east-005',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY
  },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  requestchecksumValidation: 'WHEN_REQUIRED',
});

export const uploadFileToB2 = async (file) => {
  const fileExtension = path.extname(file.originalname);
  const uniqueFilename = `${crypto.randomUUID()}-${new Date().toISOString().split('T')[0]}${fileExtension}`;
  const key = `songs/${uniqueFilename}`;

  const parallelUpload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  await parallelUpload.done();
  return key;
}

export const deleteFileFromB2 = async (key) => {
  s3.send(new DeleteObjectCommand({ Bucket: process.env.B2_BUCKET_NAME, key: key }));
}