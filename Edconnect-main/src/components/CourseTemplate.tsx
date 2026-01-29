
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";

interface CourseTemplateProps {
  courseName: string;
}

export default function CourseTemplate({ courseName }: CourseTemplateProps) {
  const [videos] = useState(Array(30).fill({
    title: "Coming Soon",
    description: "Video content will be added soon",
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{courseName} Course</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="h-5 w-5" />
                <span>Lesson {index + 1}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{video.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
