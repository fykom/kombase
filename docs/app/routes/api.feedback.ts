import type { ActionFunctionArgs } from 'react-router';
import { onBlockFeedbackAction, onPageFeedbackAction } from '../lib/github';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
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
  } catch (error: any) {
    console.error('Feedback API error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unexpected Server Error' },
      { status: 500 },
    );
  }
}
