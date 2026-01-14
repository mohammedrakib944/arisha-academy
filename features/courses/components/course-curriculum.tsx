'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Lesson = {
    id: string;
    title: string;
    description: string | null;
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
                                <ul className="list-disc list-inside space-y-1">
                                    {subject.lessons.map((lesson) => (
                                        <li key={lesson.id} className="text-sm">
                                            {hasAccess && lesson.description ? (
                                                <a
                                                    href={lesson.description}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline inline-flex items-center gap-1 text-primary"
                                                >
                                                    {lesson.title}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                <span>{lesson.title}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
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
        </div>
    );
}
