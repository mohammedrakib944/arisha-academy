'use client'

import { useState } from 'react'
import { submitTransaction } from '@/features/transactions/actions'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function BookPurchaseForm({ bookId }: { bookId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    formData.append('bookId', bookId)

    const result = await submitTransaction(formData)

    if (result.success) {
      router.push('/profile')
    } else {
      setError(result.error || 'Failed to submit transaction')
      setLoading(false)
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Buy Now</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              minLength={10}
              maxLength={15}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              type="text"
              id="transactionId"
              name="transactionId"
              required
              placeholder="Enter your payment transaction ID"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

