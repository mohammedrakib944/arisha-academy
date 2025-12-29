'use client'

import { deleteBook } from '@/features/books/actions/books'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function DeleteBookButton({ bookId }: { bookId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('আপনি কি এই বইটি মুছে ফেলতে নিশ্চিত?')) {
      return
    }

    setLoading(true)
    await deleteBook(bookId)
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

