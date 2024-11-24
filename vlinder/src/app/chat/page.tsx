// 'use client'

// import type { NextPage } from 'next'
// import Head from 'next/head'
// // import supabase  from '@/utils/supabase/supabase'
// import {createClient}  from '@/utils/supabase/server'

// import { Input } from '@supabase/ui'
// import Messages from '@/src/components/messages'

// const Home: NextPage = () => {
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const form = e.currentTarget
//     const supabase = createClient()
//     const { data, error } = await supabase.auth.getUser()
//     console.log(data)
//     //
//     const { message } = Object.fromEntries(new FormData(form))
//     if (typeof message === 'string' && message.trim().length !== 0) {
//       form.reset()
//       const { error } = await supabase
//         .from('messages')
//         .insert({ content: message })
       
//       if (error) {
//         alert(error.message)
//       }
//     }
//   }
//   return (
//     <div className="flex h-screen flex-col items-center justify-center">
//       <Head> <title>Happy Chat</title>
//         <link rel="icon" href="/favicon.ico" />

// </Head>
// <main className="flex h-full w-full flex-1 flex-col items-stretch bg-blue-400 py-10 px-20 text-gray-800">
//         <h1 className="bg-green-200 px-4 py-2 text-4xl">Happy Chat</h1>
        
//         <Messages roomId='d' />
//         <form onSubmit={handleSubmit} className="bg-red-200 p-2">
//           <Input type="text" name="message" />
//         </form>
//       </main>
//       </div>
//   )
// }


// export default Home











import React from "react";
import ChatHeader from "@/src/components/ChatHeader";
import { createClient } from "@/utils/supabase/server";
import InitUser from "@/utils/store/InitUser";
import ChatInput from "@/src/components/ChatInput";
import ListMessages from "@/src/components/ListMessages";
import ChatMessages from "@/src/components/ChatMessages";
import ChatAbout from "@/src/components/ChatAbout";

export default async function Page() {
	const supabase = createClient();
	const { data } = await supabase.auth.getSession();

	return (
		<>
			<div className="max-w-3xl mx-auto md:py-10 h-screen">
				<div className=" h-full border rounded-md flex flex-col relative">
					<ChatHeader user={data.session?.user} />

					{data.session?.user ? (
						<>
							<ChatMessages />
							<ChatInput />
						</>
					) : (
						<ChatAbout />
					)}
				</div>
			</div>
			<InitUser user={data.session?.user} />
		</>
	);
}