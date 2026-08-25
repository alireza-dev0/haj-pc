import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import {
    ALLOWED_IMAGE_MIME_TYPES,
    DEFAULT_STORAGE_BUCKET,
    DEFAULT_UPLOAD_FOLDER,
    MIME_TO_EXTENSION,
    type AllowedImageMimeType,
} from './storage.constants';
import { SupabaseService } from './supabase.service';

export type StorageUploadFile = {
    buffer: Buffer;
    mimetype: string;
    originalname?: string;
    size?: number;
};

export type StorageUploadOptions = {
    bucket?: string;
    folder?: string;
    contentType?: string;
};

export type StorageUploadResult = {
    path: string;
    publicUrl: string;
};

@Injectable()
export class StorageService {
    private readonly defaultBucket: string;
    private readonly bucketReady = new Map<string, Promise<void>>();

    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly configService: ConfigService,
    ) {
        this.defaultBucket =
            this.configService.get<string>('SUPABASE_STORAGE_BUCKET')?.trim() ||
            DEFAULT_STORAGE_BUCKET;
    }

    async upload(
        file: StorageUploadFile,
        options?: StorageUploadOptions,
    ): Promise<StorageUploadResult> {
        const bucket = options?.bucket || this.defaultBucket;
        const folder = normalizeFolder(options?.folder ?? DEFAULT_UPLOAD_FOLDER);
        const contentType = options?.contentType || file.mimetype;
        const path = `${folder}/${randomUUID()}.${extensionFor(contentType)}`;

        await this.ensureBucket(bucket);

        const { error } = await this.supabaseService.client.storage
            .from(bucket)
            .upload(path, file.buffer, {
                contentType,
                upsert: false,
            });

        if (error) {
            throw mapStorageError(error, bucket, 'بارگذاری فایل ناموفق بود');
        }

        return {
            path,
            publicUrl: this.getPublicUrl(path, bucket),
        };
    }

    async remove(path: string, bucket?: string): Promise<void> {
        const resolvedBucket = bucket || this.defaultBucket;
        const objectPath = normalizeObjectPath(path);

        await this.ensureBucket(resolvedBucket);

        const { error } = await this.supabaseService.client.storage
            .from(resolvedBucket)
            .remove([objectPath]);

        if (error) {
            throw mapStorageError(error, resolvedBucket, 'حذف فایل ناموفق بود');
        }
    }

    getPublicUrl(path: string, bucket?: string): string {
        const resolvedBucket = bucket || this.defaultBucket;
        const { data } = this.supabaseService.client.storage
            .from(resolvedBucket)
            .getPublicUrl(normalizeObjectPath(path));

        return data.publicUrl;
    }

    /**
     * Public bucket used for product (and reusable) images.
     * Default name: `products` — override with SUPABASE_STORAGE_BUCKET.
     * Created via the Storage API when missing; otherwise it must already exist.
     */
    getBucketName(): string {
        return this.defaultBucket;
    }

    private ensureBucket(bucket: string): Promise<void> {
        let pending = this.bucketReady.get(bucket);
        if (!pending) {
            pending = this.createBucketIfMissing(bucket).catch((error) => {
                this.bucketReady.delete(bucket);
                throw error;
            });
            this.bucketReady.set(bucket, pending);
        }
        return pending;
    }

    private async createBucketIfMissing(bucket: string): Promise<void> {
        const { error: getError } = await this.supabaseService.client.storage.getBucket(bucket);
        if (!getError) return;

        const { error: createError } = await this.supabaseService.client.storage.createBucket(
            bucket,
            {
                public: true,
                fileSizeLimit: '5MB',
                allowedMimeTypes: [...ALLOWED_IMAGE_MIME_TYPES],
            },
        );

        if (!createError) return;
        if (isAlreadyExistsError(createError)) return;

        throw new BadRequestException(
            `باکت «${bucket}» در پروژه Supabase یافت نشد. لطفاً آن را در داشبورد Storage بسازید.`,
        );
    }
}

function extensionFor(contentType: string): string {
    return MIME_TO_EXTENSION[contentType as AllowedImageMimeType] ?? 'bin';
}

function normalizeFolder(folder: string): string {
    const cleaned = folder.replace(/^\/+|\/+$/g, '');
    if (!cleaned || cleaned.includes('..')) {
        throw new BadRequestException('مسیر فایل نامعتبر است');
    }
    return cleaned;
}

function normalizeObjectPath(path: string): string {
    const cleaned = path.trim().replace(/^\/+/, '');
    if (!cleaned || cleaned.includes('..')) {
        throw new BadRequestException('مسیر فایل نامعتبر است');
    }
    return cleaned;
}

function isAlreadyExistsError(error: { message?: string; statusCode?: string }): boolean {
    const message = (error.message ?? '').toLowerCase();
    const status = String(error.statusCode ?? '');
    return status === '409' || message.includes('already exists') || message.includes('duplicate');
}

function isBucketMissingError(error: { message?: string; statusCode?: string }): boolean {
    const message = (error.message ?? '').toLowerCase();
    const status = String(error.statusCode ?? '');
    return status === '404' || message.includes('bucket not found') || message.includes('not found');
}

function mapStorageError(
    error: { message?: string; statusCode?: string },
    bucket: string,
    fallback: string,
): never {
    if (isBucketMissingError(error)) {
        throw new BadRequestException(
            `باکت «${bucket}» در پروژه Supabase یافت نشد. لطفاً آن را در داشبورد Storage بسازید.`,
        );
    }

    throw new InternalServerErrorException(fallback);
}
