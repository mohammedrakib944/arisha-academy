"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBook, updateBook } from "@/features/books/actions/books";
import { useRouter } from "next/navigation";
import {
  bookInputSchema,
  type BookFormInput,
} from "@/features/books/validations/book";
import type { BookFormData } from "@/features/books/validations/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

type Book = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail: string | null;
};

export function BookForm({ book }: { book?: Book }) {
  const router = useRouter();
  const form = useForm<BookFormInput>({
    resolver: zodResolver(bookInputSchema),
    defaultValues: {
      title: book?.title || "",
      description: book?.description || "",
      price: book?.price || 0,
    },
  });

  async function onSubmit(data: BookFormInput) {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("price", data.price.toString());

      // Append file if exists
      if (data.thumbnail && data.thumbnail.length > 0) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const result = book
        ? await updateBook(book.id, formData as any)
        : await createBook(formData as any);

      if (result.success) {
        toast.success(
          book ? "বই সফলভাবে আপডেট হয়েছে!" : "বই সফলভাবে তৈরি হয়েছে!"
        );
        router.push("/admin/books");
      } else {
        toast.error(result.error || "Failed to save book");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>শিরোনাম *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>বিবরণ</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>মূল্য *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>থাম্বনেইল</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={(e) => onChange(e.target.files)}
                />
              </FormControl>
              {book?.thumbnail && (
                <FormDescription>বর্তমান: {book.thumbnail}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "সংরক্ষণ করা হচ্ছে..."
              : book
              ? "বই আপডেট করুন"
              : "বই তৈরি করুন"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            বাতিল
          </Button>
        </div>
      </form>
    </Form>
  );
}
