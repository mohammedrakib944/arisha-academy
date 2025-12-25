'use client'

import { deleteTeacher } from '@/features/teachers/actions/teachers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function DeleteTeacherButton({ teacherId }: { teacherId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this teacher?')) {
      return
    }

    setLoading(true)
    await deleteTeacher(teacherId)
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

