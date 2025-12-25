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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
      const transformedData: BookFormData = {
        ...data,
        thumbnail:
          data.thumbnail && data.thumbnail.length > 0
            ? data.thumbnail[0]
            : undefined,
      };

      const result = book
        ? await updateBook(book.id, transformedData)
        : await createBook(transformedData);

      if (result.success) {
        router.push("/admin/books");
      } else {
        throw new Error(result.error || "Failed to save book");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
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
              <FormLabel>Description</FormLabel>
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
              <FormLabel>Price *</FormLabel>
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
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={(e) => onChange(e.target.files)}
                />
              </FormControl>
              {book?.thumbnail && (
                <FormDescription>Current: {book.thumbnail}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving..."
              : book
              ? "Update Book"
              : "Create Book"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
