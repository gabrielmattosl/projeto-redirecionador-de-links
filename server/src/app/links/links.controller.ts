import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createLinkSchema,
  getLinksQuerySchema,
  shortUrlParamSchema,
} from './links.schemas.js';
import {
  createLink,
  getLinks,
  deleteLink,
  incrementLinkClicks,
  LinkAlreadyExistsError,
} from './links.service.js';
import { exportLinksToCsv } from './export.service.js';

export async function createLinkHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parseResult = createLinkSchema.safeParse(request.body);
  if (!parseResult.success) {
    return reply.status(400).send({
      error: 'Dados inválidos.',
      details: parseResult.error.issues,
    });
  }

  try {
    const newLink = await createLink(parseResult.data);
    return reply.status(201).send(newLink);
  } catch (error) {
    if (error instanceof LinkAlreadyExistsError) {
      return reply.status(409).send({ error: error.message });
    }
    throw error;
  }
}

export async function getLinksHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parseResult = getLinksQuerySchema.safeParse(request.query);
  if (!parseResult.success) {
    return reply.status(400).send({
      error: 'Dados inválidos.',
      details: parseResult.error.issues,
    });
  }

  const result = await getLinks(parseResult.data);
  return reply.status(200).send(result);
}

export async function deleteLinkHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parseResult = shortUrlParamSchema.safeParse(request.params);
  if (!parseResult.success) {
    return reply.status(400).send({
      error: 'Dados inválidos.',
      details: parseResult.error.issues,
    });
  }

  const deleted = await deleteLink(parseResult.data.short_url);
  if (!deleted) {
    return reply.status(404).send({ error: 'Link não encontrado.' });
  }

  return reply.status(204).send();
}

export async function incrementLinkHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parseResult = shortUrlParamSchema.safeParse(request.params);
  if (!parseResult.success) {
    return reply.status(400).send({
      error: 'Dados inválidos.',
      details: parseResult.error.issues,
    });
  }

  const result = await incrementLinkClicks(parseResult.data.short_url);
  if (!result) {
    return reply.status(404).send({ error: 'Link não encontrado.' });
  }

  return reply.status(200).send(result);
}

export async function exportLinksHandler(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await exportLinksToCsv();
    return reply.status(200).send(result);
  } catch {
    return reply
      .status(500)
      .send({ error: 'Falha ao gerar e exportar relatório CSV.' });
  }
}
