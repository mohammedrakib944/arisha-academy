"use client";

import { useState } from "react";
import { submitTransaction } from "@/features/transactions/actions/transactions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function BookPurchaseForm({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    formData.append("bookId", bookId);

    try {
      const result = await submitTransaction(formData);

      if (result.success) {
        toast.success("লেনদেন সফলভাবে জমা দেওয়া হয়েছে!");
        router.push("/profile");
      } else {
        // Handle validation errors
        if (result.errors && Array.isArray(result.errors)) {
          const phoneError = result.errors.find(
            (err: { field: string }) => err.field === "phoneNumber"
          );
          if (phoneError) {
            setError(phoneError.message);
          } else {
            toast.error(result.message || "Please fix the errors in the form");
          }
        } else {
          toast.error(result.error || "Failed to submit transaction");
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setLoading(false);
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>এখনই কিনুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">ফোন নম্বর</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              placeholder="+880 বা 01XXXXXXXXX"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction</Label>
            <Input
              type="text"
              id="transactionId"
              name="transactionId"
              required
              placeholder="আপনার পেমেন্ট Transaction লিখুন"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "জমা দেওয়া হচ্ছে..." : "লেনদেন জমা দিন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
