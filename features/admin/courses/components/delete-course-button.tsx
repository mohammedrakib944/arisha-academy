'use client'

import { deleteCourse } from '@/features/courses/actions/courses'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this course?')) {
      return
    }

    setLoading(true)
    await deleteCourse(courseId)
    router.refresh()
    setLoading(false)
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      variant="destructive"
      size="sm"
    >
      {loading ? '...' : 'Delete'}
    </Button>
  )
}

