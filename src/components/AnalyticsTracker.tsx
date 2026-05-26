'use client'

import { useEffect, useRef } from 'react'
import { recordView } from '@/app/dashboard/actions'

export default function AnalyticsTracker({ projectId }: { projectId: string }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!hasTracked.current) {
      // Try to get anonymous viewer info from localStorage
      const stored = localStorage.getItem('viewer_info')
      const viewerData = stored ? JSON.parse(stored) : undefined

      recordView(projectId, viewerData)
      hasTracked.current = true
    }
  }, [projectId])

  return null
}
