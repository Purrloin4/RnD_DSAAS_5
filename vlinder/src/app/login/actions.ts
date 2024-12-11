'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    redirect('/login?message=Could not fetch user information')
    return
  }
  
  const userId = userData.user.id

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    redirect('/login?message=Error retrieving user profile')
    return
  }

  if (profile.role === 'admin') {
    redirect(`/admin/${userId}`)
  } else {
    revalidatePath('/', 'layout')
    redirect('/profile')
  }

  //revalidatePath('/', 'layout')
  //redirect('/profile')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?message=Error signing up')
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}