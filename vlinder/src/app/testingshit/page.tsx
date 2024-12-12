"use client";
import { Button } from "@nextui-org/button";
export default function Page() {

return(
<main>
<Button onClick={async()=>{
try{
await fetch("/api/emails ", {method: "POST",body: JSON.stringify({email: "eltac2502@gmail.com",firstName: "John"})});
return new Response(JSON.stringify({ status: 201 }), { status: 201 });

}catch(e){

    return new Response(JSON.stringify({ status: 500 }), { status: 500 });

}
}}> Send Email</Button>

</main>

)

}