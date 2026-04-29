'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check user role to redirect appropriately
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      redirect('/admin/dashboard')
    } else {
      redirect('/applicant/jobs')
    }
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  
  const adminEmail = process.env.ADMIN_EMAIL || 'adminhr@gmail.com'
  const role = email === adminEmail ? 'admin' : 'applicant'

  const { error: authError, data } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  // Ensure user is created in public.users (usually done via trigger, but we can do it explicitly here or let trigger handle it. The prompt says "triggers a webhook to insert", we'll just insert directly to be safe if trigger isn't set up yet).
  if (data.user) {
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name,
        role,
      })
      
    if (dbError && dbError.code !== '23505') { // Ignore unique violation if trigger handled it
      return { error: "Failed to create user profile." }
    }
  }

  revalidatePath('/', 'layout')
  
  if (role === 'admin') {
    redirect('/admin/dashboard')
  } else {
    redirect('/applicant/profile') // New applicants should upload CV first
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
