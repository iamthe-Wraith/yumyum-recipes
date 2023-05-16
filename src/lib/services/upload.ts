import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { S3_ENDPOINT, S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY } from '$env/static/private';
import { ApiError } from '$lib/error';

export const uploadImage = async (image: File, requestorId: number, name?: string, altEndpoint?: string): Promise<string> => {
  let endpoint = altEndpoint || S3_ENDPOINT;

  try {
    if (!requestorId) throw new ApiError('You must be signed in to upload an image.', 401);

    const s3Client = new S3Client({
      region: S3_REGION,
      endpoint,
      credentialDefaultProvider: () => async () => ({
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
      }),
    });

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const regex = /[a-zA-Z0-9]/g;

    const id = requestorId || 'yum';
    const timestamp = new Date().getTime();

    let parsedName = '';
    
    if (name?.trim()) {
      parsedName = name.trim().toLowerCase();

      const parts = parsedName.match(regex);
      if (parts?.length) {
        parsedName = parts.join('');
      }

      parsedName = parsedName.split(' ').join('_');
    }

    const key = `${id}_${timestamp}_${parsedName}_${image.name}`;

    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
      ContentType: image.type,
    };

    await s3Client.send(new PutObjectCommand(params));

    return `${endpoint}/${S3_BUCKET}/${key}`;
  } catch (err: any) {
    if (err.Code === 'TemporaryRedirect' && err.Endpoint) {
      endpoint = `https://${err.Endpoint.split('yumyum.').join('')}`;
    } else {
      throw err instanceof ApiError
        ? err
        : new ApiError('An error occurred while attempting to upload your image. Please try again later.', 500);
    }
  }
  
  try {
    return await uploadImage(image, requestorId, name, endpoint);
  } catch (err) {
    throw err instanceof ApiError
      ? err
      : new ApiError('An error occurred while attempting to upload your image. Please try again later.', 500);
  }
};