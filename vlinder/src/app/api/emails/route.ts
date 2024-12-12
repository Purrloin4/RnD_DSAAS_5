import { Resend } from 'resend';
import Welcome from '@/src/app/emails/Welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, firstName, accessTokenId } = await request.json(); // Ensure accessTokenId is included in the request

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@mothim.com',
      to: email,
      subject: 'Vlinder Invitation',
      react: Welcome({ firstName, accessTokenId }), // Pass both firstName and accessTokenId
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
