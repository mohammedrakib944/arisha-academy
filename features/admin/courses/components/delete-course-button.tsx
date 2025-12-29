'use client'

import { deleteCourse } from '@/features/courses/actions/courses'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('আপনি কি এই কোর্সটি মুছে ফেলতে নিশ্চিত?')) {
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
      {loading ? '...' : 'মুছুন'}
    </Button>
  )
}

