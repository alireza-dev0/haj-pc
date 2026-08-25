import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    readonly client: SupabaseClient;

    constructor(private readonly configService: ConfigService) {
        const url = this.configService.get<string>('SUPABASE_URL')?.trim();
        const secret =
            this.configService.get<string>('SUPABASE_SECRET')?.trim() ||
            this.configService.get<string>('SUPABASE_SECRET_KEY')?.trim();

        if (!url || !secret) {
            throw new Error(
                'Missing SUPABASE_URL or SUPABASE_SECRET. Set them in apps/api/.env (production) or apps/api/.env.development.',
            );
        }

        // Official server pattern (2026): createClient(projectUrl, sb_secret_…)
        // with session persistence off. Secret keys belong only on the backend.
        // https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys
        this.client = createClient(url, secret, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        });
    }
}
