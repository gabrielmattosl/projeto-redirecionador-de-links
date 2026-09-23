import { eq, gt, asc, sql } from 'drizzle-orm';
import { db } from '../../../database/connection.js';
import { links } from '../../../database/schema.js';
import { CreateLinkInput, GetLinksQuery } from './links.schemas.js';

export class LinkAlreadyExistsError extends Error {
  constructor() {
    super('Este apelido já está em uso.');
    this.name = 'LinkAlreadyExistsError';
  }
}

export interface FormattedLink {
  id: string;
  original_url: string;
  short_url: string;
  clicks: number;
  created_at: string;
}

export async function createLink(input: CreateLinkInput): Promise<FormattedLink> {
  const existing = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.shortUrl, input.short_url))
    .limit(1);

  if (existing.length > 0) {
    throw new LinkAlreadyExistsError();
  }

  const [inserted] = await db
    .insert(links)
    .values({
      originalUrl: input.original_url,
      shortUrl: input.short_url,
    })
    .returning();

  return {
    id: inserted.id,
    original_url: inserted.originalUrl,
    short_url: inserted.shortUrl,
    clicks: inserted.clicks,
    created_at: inserted.createdAt.toISOString(),
  };
}

export async function getLinks(
  query: GetLinksQuery
): Promise<{ links: FormattedLink[]; next_cursor: string | null }> {
  const limit = query.limit ?? 20;
  const cursorDate = query.cursor ? new Date(query.cursor) : null;

  const items = await db
    .select()
    .from(links)
    .where(cursorDate ? gt(links.createdAt, cursorDate) : undefined)
    .orderBy(asc(links.createdAt))
    .limit(limit + 1);

  const hasMore = items.length > limit;
  const resultItems = hasMore ? items.slice(0, limit) : items;

  const formattedLinks: FormattedLink[] = resultItems.map((item) => ({
    id: item.id,
    original_url: item.originalUrl,
    short_url: item.shortUrl,
    clicks: item.clicks,
    created_at: item.createdAt.toISOString(),
  }));

  const next_cursor =
    hasMore && resultItems.length > 0
      ? resultItems[resultItems.length - 1].createdAt.toISOString()
      : null;

  return {
    links: formattedLinks,
    next_cursor,
  };
}

export async function deleteLink(shortUrl: string): Promise<boolean> {
  const [deleted] = await db
    .delete(links)
    .where(eq(links.shortUrl, shortUrl))
    .returning({ id: links.id });

  return Boolean(deleted);
}

export async function incrementLinkClicks(
  shortUrl: string
): Promise<{ original_url: string } | null> {
  const [updated] = await db
    .update(links)
    .set({ clicks: sql`${links.clicks} + 1` })
    .where(eq(links.shortUrl, shortUrl))
    .returning({ originalUrl: links.originalUrl });

  if (!updated) {
    return null;
  }

  return {
    original_url: updated.originalUrl,
  };
}
