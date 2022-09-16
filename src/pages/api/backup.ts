import type { NextApiRequest, NextApiResponse } from 'next';
import { enqueue } from '@serverlessq/nextjs';
import { Message } from '../../types/message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const queueId = process.env.SERVERLESSQ_ID!;
  const target = process.env.NEXT_PUBLIC_TARGET_API_ENDPOINT!;
  const method = 'POST';
  const body = JSON.parse(req.body) as Message;

  console.log(body);

  let hasError = false;
  const errors: string[] = [];

  if (!body.repositoryName) {
    errors.push('Repository name is required, and has to be a string value.');
    hasError = true;
  }
  if (!body.username) {
    errors.push('User name is required, and has to be a string value.');
    hasError = true;
  }
  if (hasError) {
    return res.status(400).json({ message: errors.join(' \n') });
  }

  try {
    const result = await enqueue({ queueId, target, method, body });
    console.log(result);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}
