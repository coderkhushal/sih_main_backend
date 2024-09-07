require("dotenv").config()
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
require("dotenv").config()
const client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string
    }

});
export async function GetUploadingUrl(filename: string) {
    const command = new PutObjectCommand(
        {
            Bucket: "bucket.khushalbhasin.live",
            Key: filename,
            //@ts-ignore
            expiresIn: 60
            
        }
    )//expiresin : 60 -> 1min
    const url = await getSignedUrl(client, command)
    return url;
}
