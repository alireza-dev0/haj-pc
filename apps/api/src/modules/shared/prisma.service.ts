import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'app/prisma/generated/client';
import { PrismaPg } from "@prisma/adapter-pg"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService
    ){
        const adapter = new PrismaPg({
            connectionString: configService.get<string>('DATABASE_URL')
        })

        super({
            adapter,
        })
    }

    async onModuleInit() {
        await this.$connect();
    }
}
