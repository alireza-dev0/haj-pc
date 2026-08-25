import {
    BadRequestException,
    Controller,
    Delete,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'app/prisma/generated/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
    StorageDeleteDto_Response,
    StorageDto_DeleteQuery,
    StorageUploadDto_Response,
} from './DTOs/storage.dto';
import {
    DEFAULT_UPLOAD_FOLDER,
    MAX_IMAGE_BYTES,
    isAllowedImageMime,
} from './storage.constants';
import { StorageService, type StorageUploadFile } from './storage.service';

// Frontend contract: POST multipart field `file` → { url, path }, then send
// `url` in product CRUD as images[].url. Do not send the file to product endpoints.
@ApiTags('storage')
@Controller('storage')
@UseGuards(AuthGuard('jwt-access'), RolesGuard)
@Roles(UserRole.ADMIN)
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            // Multer uses memory storage when `dest` is omitted — nothing is written to disk.
            limits: { fileSize: MAX_IMAGE_BYTES },
            fileFilter: (_req, file, callback) => {
                if (!isAllowedImageMime(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            'فقط تصاویر JPEG، PNG، WebP و GIF مجاز هستند',
                        ),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiOkResponse({ type: StorageUploadDto_Response })
    async handleUpload(
        @UploadedFile() file: StorageUploadFile | undefined,
    ): Promise<StorageUploadDto_Response> {
        if (!file?.buffer) {
            throw new BadRequestException('فایل تصویر الزامی است');
        }

        const uploaded = await this.storageService.upload(file, {
            folder: DEFAULT_UPLOAD_FOLDER,
            contentType: file.mimetype,
        });

        return {
            url: uploaded.publicUrl,
            path: uploaded.path,
        };
    }

    @Delete()
    @ApiOkResponse({ type: StorageDeleteDto_Response })
    async handleDelete(
        @Query() query: StorageDto_DeleteQuery,
    ): Promise<StorageDeleteDto_Response> {
        await this.storageService.remove(query.path);
        return { success: true };
    }
}
