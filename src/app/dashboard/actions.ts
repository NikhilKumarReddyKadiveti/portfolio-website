'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

const IMAGE_BUCKET = 'portfolio-images'

function getTextValue(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  formData: FormData,
  fileField: string,
  urlField: string,
  folder: string
) {
  const file = formData.get(fileField)
  const url = getTextValue(formData, urlField)

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file.')
    }

    const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg'
    const path = `${userId}/${folder}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  return url
}

export async function addProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  const imageUrl = await uploadImage(supabase, user.id, formData, 'image_file', 'image_url', 'projects')

  const project = {
    user_id: user.id,
    title: getTextValue(formData, 'title'),
    description: getTextValue(formData, 'description'),
    live_url: getTextValue(formData, 'live_url'),
    github_url: getTextValue(formData, 'github_url'),
    image_url: imageUrl,
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

  const id = getTextValue(formData, 'id')
  const imageUrl = await uploadImage(supabase, user.id, formData, 'image_file', 'image_url', 'projects')
  const project = {
    title: getTextValue(formData, 'title'),
    description: getTextValue(formData, 'description'),
    live_url: getTextValue(formData, 'live_url'),
    github_url: getTextValue(formData, 'github_url'),
    image_url: imageUrl,
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
  const avatarUrl = await uploadImage(supabase, user.id, formData, 'avatar_file', 'avatar_url', 'avatars')

  const profile = {
    full_name: getTextValue(formData, 'full_name'),
    bio: getTextValue(formData, 'bio'),
    website: getTextValue(formData, 'website'),
    company: getTextValue(formData, 'company'),
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('profiles').update(profile).match({ id: user.id })

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/')
  revalidatePath(`/profile/${getTextValue(formData, 'username')}`)
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
