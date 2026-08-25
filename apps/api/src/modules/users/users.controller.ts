import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'app/prisma/generated/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UsersService } from './users.service';
import {
    CreateUserDto_Request,
    UpdateUserDto_Request,
    UserDto_Response,
    UserListDto_Response,
    UsersDto_Query,
} from './DTOs/user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt-access'), RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOkResponse({ type: UserListDto_Response })
    async handleGetUsers(
        @Query() query: UsersDto_Query,
    ): Promise<UserListDto_Response> {
        return this.usersService.getUsers({
            q: query.q,
            role: query.role,
            page: query.page,
            limit: query.limit,
        });
    }

    @Get(':id')
    @ApiOkResponse({ type: UserDto_Response })
    async handleGetUser(@Param('id') id: string): Promise<UserDto_Response> {
        return this.usersService.getUser(id);
    }

    @Post()
    @ApiCreatedResponse({ type: UserDto_Response })
    async handleCreateUser(
        @Body() body: CreateUserDto_Request,
    ): Promise<UserDto_Response> {
        return this.usersService.createUser({
            name: body.name,
            email: body.email,
            password: body.password,
            role: body.role,
        });
    }

    @Patch(':id')
    @ApiOkResponse({ type: UserDto_Response })
    async handleUpdateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDto_Request,
    ): Promise<UserDto_Response> {
        return this.usersService.updateUser(id, {
            name: body.name,
            email: body.email,
            password: body.password,
            role: body.role,
        });
    }

    @Delete(':id')
    @ApiOkResponse({ schema: { example: { ok: true } } })
    async handleDeleteUser(
        @Param('id') id: string,
        @Req() req: Request,
    ): Promise<{ ok: true }> {
        return this.usersService.deleteUser(id, req.user!.id);
    }
}
