import { createHmac } from 'crypto';
import { NextApiRequest } from 'next';

export const verifySignature = (req: NextApiRequest, payload: string) => {
  const signature = createHmac('sha256', process.env.SERVERLESSQ_API_TOKEN!).update(payload).digest('hex');
  return signature === req.headers['x-serverlessq-signature'];
};
