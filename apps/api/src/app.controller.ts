import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
    @Get('health')
    @ApiOkResponse({
        schema: {
            type: 'object',
            properties: { ok: { type: 'boolean', example: true } },
        },
    })
    handleHealth() {
        return { ok: true };
    }
}
