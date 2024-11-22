// 'use client'
import { profile } from 'console'
import { useEffect, useState, useRef } from 'react'
import supabase from '@/utils/supabase/supabase'

type Message = {
  id: string
  created_at: string
  content: string
  profile_id: string
  profile: {
    id: string
    username: string
  }
}
type MessagesProps = {
  roomId: string
}
let profileCache: any = {}
export default function Messages({ roomId }: MessagesProps) {

  
// const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const messagesRef = useRef<HTMLDivElement>(null)

  console.log({ messagesRef })

  const getData = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, profile: profiles(id, username)')
      .match({ room_id: roomId })
      .order('created_at')

    if (!data) {
      alert('no data')
      return
    }

    data
      .map((message) => message.profile)
      .forEach((profile) => {
        profileCache[profile.id] = profile
      })
    setMessages(data)

    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'room_id=eq.${roomId}'
        },
        (payload: { new: Message }) => {
          if (payload && payload.new) {
            const newMessage = {
              ...payload.new,
              profile: profileCache[payload.new.profile_id] || {
                id: payload.new.profile_id,
                username: 'Unknown',
              },
            }

            setMessages((current) => [...current, newMessage])

            if (messagesRef.current) {
              messagesRef.current.scrollTop = messagesRef.current.scrollHeight
            }
          } else {
            console.error('Unexpected payload structure:', payload)
          }
        }
      )
        
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])



  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
      } else {
        setUserId(data?.user?.id || null)
      }
    }

    getUser()
  }, [])

  console.log({ messages })

  return (
    <div className="flex-1 overflow-y-scroll bg-pink-200" ref={messagesRef}>
      <ul className="flex flex-col justify-end space-y-1 p-4">
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.profile_id === userId
                ? 'self-end rounded bg-blue-400 px-2'
                : 'self-start rounded bg-gray-100 px-2'
            }
          >
            <span className="block text-xs text-gray-500">
              {message.profile.username}
            </span>
            <span className="">{message.content}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}