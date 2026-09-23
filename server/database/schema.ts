import { pgTable, uuid, text, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const links = pgTable(
  'links',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    originalUrl: text('original_url').notNull(),
    shortUrl: varchar('short_url', { length: 50 }).notNull().unique(),
    clicks: integer('clicks').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('links_created_at_idx').on(table.createdAt.asc()),
  ]
);
