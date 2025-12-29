"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitTransaction } from "@/features/transactions/actions/transactions";
import { useRouter } from "next/navigation";
import {
  transactionSchema,
  type TransactionFormData,
} from "@/features/transactions/validations/transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function PurchaseForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      courseId,
      bookId: undefined,
      transactionId: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(data: TransactionFormData) {
    try {
      const result = await submitTransaction(data);
      if (result.success) {
        toast.success("লেনদেন সফলভাবে জমা দেওয়া হয়েছে!");
        router.push("/profile");
        router.refresh();
      } else {
        // Handle validation errors - set field-specific errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err: { field: string; message: string }) => {
            form.setError(err.field as any, {
              type: "manual",
              message: err.message,
            });
          });
          toast.error(result.message || "Please fix the errors in the form");
        } else {
          toast.error(result.error || "Failed to submit transaction");
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>এখনই নিবন্ধন করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ফোন নম্বর</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      {...field}
                      placeholder="+880 বা 01XXXXXXXXX"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>লেনদেন আইডি</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="আপনার পেমেন্ট লেনদেন আইডি লিখুন"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "জমা দেওয়া হচ্ছে..."
                : "লেনদেন জমা দিন"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
