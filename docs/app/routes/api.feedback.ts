import type { ActionFunctionArgs } from 'react-router';
import { onBlockFeedbackAction, onPageFeedbackAction } from '../lib/github';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const data = await request.json();

  if (data.type === 'page') {
    const result = await onPageFeedbackAction(data.feedback);
    return Response.json(result);
  }

  if (data.type === 'block') {
    const result = await onBlockFeedbackAction(data.feedback);
    return Response.json(result);
  }

  return Response.json({ error: 'Bad request' }, { status: 400 });
}
