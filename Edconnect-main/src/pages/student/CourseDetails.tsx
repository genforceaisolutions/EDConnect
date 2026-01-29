import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Book, Video } from "lucide-react";

export default function CourseDetails() {
  const { courseTitle } = useParams<{ courseTitle: string }>();
  const navigate = useNavigate();

  const handleOptionClick = (option: string) => {
    if (option === 'materials') {
      navigate(`/student/courses/study-materials?category=${courseTitle}`);
    } else {
      navigate(`/student/courses/${courseTitle}/video-lessons`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">{courseTitle.replace(/-/g, ' ')}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer" onClick={() => handleOptionClick('materials')}>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Course Materials</h3>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => handleOptionClick('video')}>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Video Lessons</h3>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 