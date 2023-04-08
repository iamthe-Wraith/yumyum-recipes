import Aws from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

import { S3_ENDPOINT, S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY } from '$env/static/private'
import { log } from './log';
import { ApiError } from '$lib/error';

export const uploadImage = async (image: File, requestorId: number, name?: string) => {
  try {
    if (!requestorId) throw new ApiError('You must be signed in to upload an image.', 401);

    const s3Endpoint = new Aws.Endpoint(S3_ENDPOINT);
    const s3 = new S3({
      endpoint: s3Endpoint,
      region: S3_REGION,
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    });

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const regex = /[a-zA-Z0-9]/g;

    const id = requestorId || 'yum';
    const timestamp = new Date().getTime();

    let parsedName = ''
    
    if (name?.trim()) {
      parsedName = name.trim().toLowerCase();

      const parts = parsedName.match(regex);
      if (parts?.length) {
        parsedName = parts.join('');
      }

      parsedName = parsedName.split(' ').join('_');
    }

    const params = {
      Bucket: S3_BUCKET,
      Key: `${id}_${timestamp}_${parsedName}_${image.name}`,
      Body: buffer,
      ACL: 'public-read',
      ContentType: image.type,
    };

    const url = await new Promise<string>((resolve, reject) => {
      s3.upload(params, async (error: Error, data: Aws.S3.ManagedUpload.SendData) => {
        if (error) {
          log('Error uploading image to S3: ', error);
          reject(new ApiError('An error occurred while attempting to upload your image. Please try again later.', 500));
        }

        resolve(data.Location);
      });
    });

    return url;
  } catch (err: any) {
    throw err instanceof ApiError
      ? err
      : new ApiError('An error occurred while attempting to upload your image. Please try again later.', 500)
  } 
};