"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTeacher,
  updateTeacher,
} from "@/features/teachers/actions/teachers";
import { useRouter } from "next/navigation";
import {
  teacherInputSchema,
  type TeacherFormInput,
} from "@/features/teachers/validations/teacher";
import type { TeacherFormData } from "@/features/teachers/validations/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

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
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.bio) {
        formData.append("bio", data.bio);
      }
      formData.append("subjects", JSON.stringify(data.subjects || []));

      // Append file if exists
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const result = teacher
        ? await updateTeacher(teacher.id, formData as any)
        : await createTeacher(formData as any);

      if (result.success) {
        toast.success(
          teacher ? "শিক্ষক সফলভাবেহয়েছে!" : "শিক্ষক সফলভাবে তৈরি হয়েছে!"
        );
        router.push("/admin/teachers");
      } else {
        toast.error(result.error || "Failed to save teacher");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  function addSubject() {
    const currentSubjects = form.getValues("subjects") || [];
    form.setValue("subjects", [...currentSubjects, ""], {
      shouldValidate: true,
    });
  }

  function removeSubject(index: number) {
    const currentSubjects = form.getValues("subjects") || [];
    form.setValue(
      "subjects",
      currentSubjects.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  function updateSubject(index: number, value: string) {
    const currentSubjects = form.getValues("subjects") || [];
    const updated = [...currentSubjects];
    updated[index] = value;
    form.setValue("subjects", updated, { shouldValidate: true });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>নাম *</FormLabel>
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
              <FormLabel>জীবনী</FormLabel>
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
              <FormLabel>ছবি</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={(e) => onChange(e.target.files)}
                />
              </FormControl>
              {teacher?.image && (
                <FormDescription>বর্তমান: {teacher.image}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>শিক্ষাদান করা বিষয়</FormLabel>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addSubject}
            >
              <Plus className="h-4 w-4 mr-1" />
              বিষয় যোগ করুন
            </Button>
          </div>
          <div className="space-y-2">
            {(watchedSubjects || []).map((subject, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="বিষয়ের নাম (যেমন: জীববিজ্ঞান)"
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

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "সংরক্ষণ করা হচ্ছে..."
              : teacher
              ? "শিক্ষককরুন"
              : "শিক্ষক তৈরি করুন"}
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
