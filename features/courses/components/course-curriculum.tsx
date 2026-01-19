'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ChevronDown, ChevronUp, Play, FileText, Eye } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Lesson = {
    id: string;
    title: string;
    description: string | null;
    pdfUrl: string | null;
};

type Subject = {
    id: string;
    name: string;
    lessons: Lesson[];
};

type CourseCurriculumProps = {
    subjects: Subject[];
    hasAccess: boolean;
};

export function CourseCurriculum({ subjects, hasAccess }: CourseCurriculumProps) {
    // Initialize with the first subject expanded if there are subjects
    const [openSubjectIds, setOpenSubjectIds] = useState<string[]>(
        subjects.length > 0 ? [subjects[0].id] : []
    );
    const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

    if (!subjects || subjects.length === 0) {
        return null;
    }

    const toggleSubject = (subjectId: string) => {
        setOpenSubjectIds((prev) =>
            prev.includes(subjectId)
                ? prev.filter((id) => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    return (
        <div className="space-y-4">
            {subjects.map((subject, index) => {
                const isPreview = index < 2;
                const showLessons = hasAccess || isPreview;
                const isOpen = openSubjectIds.includes(subject.id);

                return (
                    <Card key={subject.id}>
                        <CardHeader
                            className={cn(
                                "cursor-pointer hover:bg-muted/50 transition-colors",
                                isOpen ? "border-b" : ""
                            )}
                            onClick={() => toggleSubject(subject.id)}
                        >
                            <CardTitle className="text-lg flex items-center justify-between select-none">
                                <span className="flex items-center gap-2">
                                    {subject.name}
                                    {!showLessons && !hasAccess && (
                                        <span className="text-sm font-normal text-muted-foreground">
                                            (Locked)
                                        </span>
                                    )}
                                </span>
                                {isOpen ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </CardTitle>
                        </CardHeader>
                        {showLessons && isOpen && (
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {subject.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {lesson.description ? (
                                                        <Play className="h-4 w-4 text-primary fill-primary/10" />
                                                    ) : lesson.pdfUrl ? (
                                                        <FileText className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">
                                                        {lesson.title}
                                                    </p>
                                                    {lesson.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Video Lesson
                                                        </p>
                                                    )}
                                                    {lesson.pdfUrl && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            PDF / Slide Material
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {hasAccess && lesson.description && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 gap-1"
                                                    >
                                                        <a
                                                            href={lesson.description}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Play className="h-3 w-3 fill-current" />
                                                            <span>দেখুন</span>
                                                        </a>
                                                    </Button>
                                                )}
                                                {hasAccess && lesson.pdfUrl && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setPreviewLesson(lesson)}
                                                        className="h-8 gap-1"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        <span>প্রিভিউ</span>
                                                    </Button>
                                                )}
                                                {!hasAccess && !isPreview && (
                                                    <span className="text-xs text-muted-foreground italic px-2">
                                                        Locked
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        )}
                        {/* Show message for locked content if expanded */}
                        {!showLessons && !hasAccess && isOpen && (
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground italic">
                                    এই অধ্যায়ের পাঠগুলো দেখার জন্য কোর্সটি কিনুন।
                                </p>
                            </CardContent>
                        )}
                    </Card>
                );
            })}

            {/* PDF Preview Sheet */}
            <Sheet open={!!previewLesson} onOpenChange={(open) => !open && setPreviewLesson(null)}>
                <SheetContent side="right" className="w-[95%] sm:max-w-[80%] p-0 flex flex-col">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            {previewLesson?.title}
                        </SheetTitle>
                        <SheetDescription>
                            পিডিএফ/স্লাইড মেটেরিয়াল
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 w-full bg-muted overflow-hidden relative">
                        {previewLesson?.pdfUrl ? (
                            <iframe
                                src={previewLesson.pdfUrl}
                                title={previewLesson.title}
                                className="w-full h-full border-none"
                                allow="autoplay"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">লোড করা যাচ্ছে না...</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
