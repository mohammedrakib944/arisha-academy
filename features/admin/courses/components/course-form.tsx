"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourse, updateCourse } from "@/features/courses/actions/courses";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  courseInputSchema,
  type CourseFormInput,
} from "@/features/courses/validations/course";
import type { CourseFormData } from "@/features/courses/validations/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

type Teacher = {
  id: string;
  name: string;
};

type Subject = {
  id: string;
  name: string;
  lessons: Array<{
    id: string;
    title: string;
    description: string | null;
  }>;
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  totalClasses: number;
  totalExams: number;
  overview: string | null;
  courseOutlineUrl: string | null;
  thumbnail: string | null;
  routineImage: string | null; // This will store YouTube URL
  teachers: Array<{ teacherId: string }>;
  subjects: Subject[];
};

export function CourseForm({
  course,
  teachers,
}: {
  course?: Course;
  teachers: Teacher[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormInput>({
    resolver: zodResolver(courseInputSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      price: course?.price || 0,
      totalClasses: course?.totalClasses || 0,
      totalExams: course?.totalExams || 0,
      overview: course?.overview || "",
      courseOutlineUrl: course?.courseOutlineUrl || "",
      teacherIds: course?.teachers.map((t) => t.teacherId) || [],
      subjects:
        course?.subjects.map((s) => ({
          name: s.name,
          lessons: s.lessons.map((l) => ({
            title: l.title,
            description: l.description || "",
          })),
        })) || [],
      youtubeUrl: course?.routineImage || "",
    },
  });

  const watchedSubjects = watch("subjects");
  const watchedTeacherIds = watch("teacherIds");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "কোর্সের সারসংক্ষেপ লিখুন...",
      }),
    ],
    content: course?.overview || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "ProseMirror focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      setValue("overview", editor.getHTML(), { shouldDirty: true });
    },
  });

  useEffect(() => {
    if (course?.overview && editor) {
      const currentContent = editor.getHTML();
      if (currentContent !== course.overview) {
        editor.commands.setContent(course.overview);
        setValue("overview", course.overview);
      }
    }
  }, [course?.overview, editor, setValue]);

  async function onSubmit(data: CourseFormInput) {
    try {
      // Check file sizes before submission
      const MAX_SIZE = 3 * 1024 * 1024; // 3MB

      if (data.thumbnail && data.thumbnail.length > 0) {
        const file = data.thumbnail[0];
        if (file.size > MAX_SIZE) {
          toast.error(
            `Thumbnail file size (${(file.size / (1024 * 1024)).toFixed(
              2
            )}MB) exceeds 3MB limit. Please compress the image and try again.`
          );
          return;
        }
      }

      // Transform FileList to File and ensure all required fields have defaults
      const transformedData: CourseFormData = {
        title: data.title,
        description: data.description || "",
        price: data.price,
        totalClasses: data.totalClasses ?? 0,
        totalExams: data.totalExams ?? 0,
        overview: data.overview || "",
        courseOutlineUrl: data.courseOutlineUrl || "",
        teacherIds: data.teacherIds || [],
        subjects: (data.subjects || []).map((subject) => ({
          name: subject.name,
          lessons: Array.isArray(subject.lessons) ? subject.lessons : [],
        })),
        thumbnail:
          data.thumbnail && data.thumbnail.length > 0
            ? data.thumbnail[0]
            : undefined,
        youtubeUrl: data.youtubeUrl || undefined,
      };

      const result = course
        ? await updateCourse(course.id, transformedData)
        : await createCourse(transformedData);

      if (result.success) {
        toast.success(
          course ? "কোর্স সফলভাবেহয়েছে!" : "কোর্স সফলভাবে তৈরি হয়েছে!"
        );
        router.push("/admin/courses");
      } else {
        toast.error(result.error || "Failed to save course");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  function addSubject() {
    const currentSubjects = watch("subjects") || [];
    setValue("subjects", [...currentSubjects, { name: "", lessons: [] }], {
      shouldValidate: true,
    });
  }

  function removeSubject(index: number) {
    const currentSubjects = watch("subjects") || [];
    setValue(
      "subjects",
      currentSubjects.filter((_: unknown, i: number) => i !== index),
      { shouldValidate: true }
    );
  }

  function updateSubject(index: number, name: string) {
    const currentSubjects = watch("subjects") || [];
    const updated: Array<{
      name: string;
      lessons: Array<{ title: string; description?: string }>;
    }> = currentSubjects.map((subject, i) => ({
      name: i === index ? name : subject.name,
      lessons: Array.isArray(subject.lessons) ? subject.lessons : [],
    }));
    setValue("subjects", updated, { shouldValidate: true });
  }

  function addLesson(subjectIndex: number) {
    const currentSubjects = watch("subjects") || [];
    const updated = [...currentSubjects];
    if (!updated[subjectIndex].lessons) {
      updated[subjectIndex].lessons = [];
    }
    updated[subjectIndex].lessons.push({ title: "", description: "" });
    setValue("subjects", updated, { shouldValidate: true });
  }

  function removeLesson(subjectIndex: number, lessonIndex: number) {
    const currentSubjects = watch("subjects") || [];
    const updated = [...currentSubjects];
    if (updated[subjectIndex].lessons) {
      updated[subjectIndex].lessons = updated[subjectIndex].lessons.filter(
        (_: unknown, i: number) => i !== lessonIndex
      );
    }
    setValue("subjects", updated, { shouldValidate: true });
  }

  function updateLesson(
    subjectIndex: number,
    lessonIndex: number,
    field: "title" | "description",
    value: string
  ) {
    const currentSubjects = watch("subjects") || [];
    const updated = [...currentSubjects];
    if (updated[subjectIndex].lessons) {
      updated[subjectIndex].lessons[lessonIndex][field] = value;
    }
    setValue("subjects", updated, { shouldValidate: true });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mx-auto max-w-4xl"
    >
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          শিরোনাম *
        </label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          বিবরণ
        </label>
        <Textarea id="description" {...register("description")} rows={4} />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block mb-2 font-medium">
            মূল্য *
          </label>
          <Input
            type="number"
            id="price"
            {...register("price", { valueAsNumber: true })}
            min="0"
            step="0.01"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-destructive">
              {errors.price.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="totalClasses" className="block mb-2 font-medium">
            মোট ক্লাস
          </label>
          <Input
            type="number"
            id="totalClasses"
            {...register("totalClasses", { valueAsNumber: true })}
            min="0"
          />
          {errors.totalClasses && (
            <p className="mt-1 text-sm text-destructive">
              {errors.totalClasses.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="totalExams" className="block mb-2 font-medium">
          মোট পরীক্ষা
        </label>
        <Input
          type="number"
          id="totalExams"
          {...register("totalExams", { valueAsNumber: true })}
          min="0"
        />
        {errors.totalExams && (
          <p className="mt-1 text-sm text-destructive">
            {errors.totalExams.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="overview" className="block mb-2 font-medium">
          সারসংক্ষেপ (রিচ টেক্সট)
        </label>
        <Controller
          name="overview"
          control={control}
          render={() => (
            <>
              {editor && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="border-b p-2 flex gap-2 flex-wrap bg-muted">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("bold")
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("italic")
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("strike")
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      <s>S</s>
                    </button>
                    <div className="w-px bg-border mx-1" />
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("heading", { level: 1 })
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("heading", { level: 2 })
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("heading", { level: 3 })
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      H3
                    </button>
                    <div className="w-px bg-border mx-1" />
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("bulletList")
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      •
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("orderedList")
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      1.
                    </button>
                    <div className="w-px bg-border mx-1" />
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive("blockquote")
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      "
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                      }
                      className="px-3 py-1 rounded text-sm bg-background hover:bg-secondary"
                    >
                      ─
                    </button>
                    <div className="w-px bg-border mx-1" />
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().undo().run()}
                      disabled={!editor.can().undo()}
                      className="px-3 py-1 rounded text-sm bg-background hover:bg-secondary disabled:opacity-50"
                    >
                      ↶
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().redo().run()}
                      disabled={!editor.can().redo()}
                      className="px-3 py-1 rounded text-sm bg-background hover:bg-secondary disabled:opacity-50"
                    >
                      ↷
                    </button>
                  </div>
                  <EditorContent editor={editor} />
                </div>
              )}
            </>
          )}
        />
        {errors.overview && (
          <p className="mt-1 text-sm text-destructive">
            {errors.overview.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="courseOutlineUrl" className="block mb-2 font-medium">
          ফেসবুক গ্রুপ লিংক
        </label>
        <Input
          type="url"
          required
          id="courseOutlineUrl"
          {...register("courseOutlineUrl")}
        />
        {errors.courseOutlineUrl && (
          <p className="mt-1 text-sm text-destructive">
            {errors.courseOutlineUrl.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">থাম্বনেইল</label>
        <Input
          type="file"
          id="thumbnail"
          accept="image/*"
          {...register("thumbnail")}
        />
        {course?.thumbnail && (
          <p className="mt-2 text-sm text-muted-foreground">
            বর্তমান: {course.thumbnail}
          </p>
        )}
        {errors.thumbnail && (
          <p className="mt-1 text-sm text-destructive">
            {errors.thumbnail.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="youtubeUrl" className="block mb-2 font-medium">
          YouTube URL
        </label>
        <Input
          type="url"
          id="youtubeUrl"
          placeholder="https://www.youtube.com/watch?v=..."
          {...register("youtubeUrl")}
        />
        {course?.routineImage && (
          <p className="mt-2 text-sm text-muted-foreground">
            বর্তমান: {course.routineImage}
          </p>
        )}
        {errors.youtubeUrl && (
          <p className="mt-1 text-sm text-destructive">
            {errors.youtubeUrl.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">শিক্ষক</label>
        <div className="space-y-2">
          {teachers.map((teacher) => (
            <label key={teacher.id} className="flex items-center gap-2">
              <Checkbox
                checked={(watchedTeacherIds || []).includes(teacher.id)}
                onCheckedChange={(checked) => {
                  const currentIds = watchedTeacherIds || [];
                  if (checked) {
                    setValue("teacherIds", [...currentIds, teacher.id], {
                      shouldValidate: true,
                    });
                  } else {
                    setValue(
                      "teacherIds",
                      currentIds.filter((id) => id !== teacher.id),
                      { shouldValidate: true }
                    );
                  }
                }}
              />
              <span>{teacher.name}</span>
            </label>
          ))}
        </div>
        {errors.teacherIds && (
          <p className="mt-1 text-sm text-destructive">
            {errors.teacherIds.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block font-medium">বিষয় ও পাঠ</label>
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
        <div className="space-y-4">
          {(watchedSubjects || []).map((subject, subjectIndex) => (
            <div key={subjectIndex} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Input
                  type="text"
                  placeholder="বিষয়ের নাম (যেমন: জীববিজ্ঞান)"
                  value={subject.name}
                  onChange={(e) => updateSubject(subjectIndex, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSubject(subjectIndex)}
                >
                  <X className="h-4 w-4 mr-1" />
                  সরান
                </Button>
              </div>
              <div className="space-y-2">
                {(subject.lessons || []).map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="পাঠের শিরোনাম"
                      value={lesson.title}
                      onChange={(e) =>
                        updateLesson(
                          subjectIndex,
                          lessonIndex,
                          "title",
                          e.target.value
                        )
                      }
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      placeholder="বিবরণ (ঐচ্ছিক)"
                      value={lesson.description}
                      onChange={(e) =>
                        updateLesson(
                          subjectIndex,
                          lessonIndex,
                          "description",
                          e.target.value
                        )
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeLesson(subjectIndex, lessonIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => addLesson(subjectIndex)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  পাঠ যোগ করুন
                </Button>
              </div>
            </div>
          ))}
        </div>
        {errors.subjects && (
          <p className="mt-1 text-sm text-destructive">
            {errors.subjects.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "সংরক্ষণ করা হচ্ছে..."
            : course
            ? "সেভ করুন"
            : "কোর্স তৈরি করুন"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          বাতিল
        </Button>
      </div>
    </form>
  );
}
