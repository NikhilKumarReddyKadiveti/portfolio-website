'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const project = {
    user_id: user.id,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    live_url: formData.get('live_url') as string,
    github_url: formData.get('github_url') as string,
    image_url: formData.get('image_url') as string,
  }

  const { error } = await supabase.from('projects').insert(project)

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().match({ id })

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function addSkill(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const skill = {
    user_id: user.id,
    name: formData.get('name') as string,
    category: formData.get('category') as string,
  }

  const { error } = await supabase.from('skills').insert(skill)

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').delete().match({ id })

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function updateProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const project = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    live_url: formData.get('live_url') as string,
    github_url: formData.get('github_url') as string,
    image_url: formData.get('image_url') as string,
  }

  const { error } = await supabase.from('projects').update(project).match({ id, user_id: user.id })

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function recordView(projectId: string, viewerData?: { name: string; company: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let viewer_name = viewerData?.name || null
  let viewer_company = viewerData?.company || null

  if (user && !viewer_name) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, company')
      .eq('id', user.id)
      .single()
    
    viewer_name = profile?.full_name
    viewer_company = profile?.company
  }

  await supabase.from('project_views').insert({
    project_id: projectId,
    viewer_id: user?.id || null,
    viewer_name,
    viewer_company
  })
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const profile = {
    full_name: formData.get('full_name') as string,
    bio: formData.get('bio') as string,
    website: formData.get('website') as string,
    company: formData.get('company') as string,
    avatar_url: formData.get('avatar_url') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('profiles').update(profile).match({ id: user.id })

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/')
  revalidatePath(`/profile/${formData.get('username')}`)
}

export async function sendJobOffer(formData: FormData) {
  const supabase = await createClient()
  
  const offer = {
    project_id: formData.get('project_id') as string || null,
    recipient_id: formData.get('recipient_id') as string,
    sender_name: formData.get('sender_name') as string,
    sender_email: formData.get('sender_email') as string,
    sender_company: formData.get('sender_company') as string,
    offer_details: formData.get('offer_details') as string,
  }

  const { error } = await supabase.from('job_offers').insert(offer)

  if (error) throw error
  
  revalidatePath('/dashboard')
}
