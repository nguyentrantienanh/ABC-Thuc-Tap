import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

import { IConfigs } from '@/common/interfaces/configs.interface';

import { PutObjectRequest } from './interfaces/aws.interface';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get<IConfigs['aws']>('aws');

    if (!awsConfig) {
      throw new Error('AWS configuration is not available');
    }

    const { region, endPoint, credentials, s3 } = awsConfig;

    if (!s3 || !s3.bucketName) {
      throw new Error('S3 configuration is missing');
    }

    this.bucketName = s3.bucketName;

    const s3ClientConfig: S3ClientConfig = {
      region,
      endpoint: endPoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    };

    this.s3Client = new S3Client(s3ClientConfig);
  }

  async putObject({ key, body }: PutObjectRequest): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
    });

    try {
      await this.s3Client.send(command);
    } catch (err) {
      throw new Error(`Failed to put object: ${err.message}`);
    }
  }

  async removeObject(objectKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (err) {
      throw new Error(`Failed to remove object: ${err.message}`);
    }
  }
}
