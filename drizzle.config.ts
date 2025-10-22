import type { Config } from 'drizzle-kit';

export default {
  schema: './app/db/schema.tsx',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;