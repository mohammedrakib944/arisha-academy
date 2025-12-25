"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeacher, updateTeacher } from "@/features/teachers/actions/teachers";
import { useRouter } from "next/navigation";
import { teacherInputSchema, type TeacherFormInput } from "@/features/teachers/validations/teacher";
import type { TeacherFormData } from "@/features/teachers/validations/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, X } from "lucide-react";

type Teacher = {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  subjects: string[];
};

export function TeacherForm({ teacher }: { teacher?: Teacher }) {
  const router = useRouter();
  const form = useForm<TeacherFormInput>({
    resolver: zodResolver(teacherInputSchema),
    defaultValues: {
      name: teacher?.name || "",
      bio: teacher?.bio || "",
      subjects: teacher?.subjects || [],
      image: undefined,
    },
  });

  const watchedSubjects = form.watch("subjects");

  async function onSubmit(data: TeacherFormInput) {
    try {
      const transformedData: TeacherFormData = {
        ...data,
        image: data.image && data.image.length > 0 ? data.image[0] : undefined,
      };
      
      const result = teacher
        ? await updateTeacher(teacher.id, transformedData)
        : await createTeacher(transformedData);

      if (result.success) {
        router.push("/admin/teachers");
      } else {
        throw new Error(result.error || "Failed to save teacher");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  function addSubject() {
    const currentSubjects = form.getValues("subjects");
    form.setValue("subjects", [...currentSubjects, ""], { shouldValidate: true });
  }

  function removeSubject(index: number) {
    const currentSubjects = form.getValues("subjects");
    form.setValue(
      "subjects",
      currentSubjects.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  function updateSubject(index: number, value: string) {
    const currentSubjects = form.getValues("subjects");
    const updated = [...currentSubjects];
    updated[index] = value;
    form.setValue("subjects", updated, { shouldValidate: true });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={(e) => onChange(e.target.files)}
                />
              </FormControl>
              {teacher?.image && (
                <FormDescription>
                  Current: {teacher.image}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Subjects Taught</FormLabel>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addSubject}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Subject
            </Button>
          </div>
          <div className="space-y-2">
            {watchedSubjects.map((subject, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Subject name (e.g., Biology)"
                  value={subject}
                  onChange={(e) => updateSubject(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSubject(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.subjects && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.subjects.message}
            </p>
          )}
        </div>

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Saving..."
              : teacher
                ? "Update Teacher"
                : "Create Teacher"}
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
