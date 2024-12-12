import { Resend } from 'resend';
import  Welcome  from '@/src/app/emails/Welcome';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    const{email,firstName} = await request.json();  

    try {
        const { data, error } = await resend.emails.send({
          from: 'onboarding@mothim.com',
          to: email,
          subject: 'Hello world',
          react: Welcome({firstName}),

        });
    
        if (error) {
          return Response.json({ error }, { status: 500 });
        }
    
        return Response.json(data);
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
    }
    // await resend.emails.send({
    //     from: 'onboarding@mothim.com',
    //     to: email,
    //     subject: 'Welcome to Vlinder',
    //     react: Welcome({firstName}),
    //   });

// }