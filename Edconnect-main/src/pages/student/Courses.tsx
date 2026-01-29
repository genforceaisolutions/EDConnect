import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Book, FileText, Video } from "lucide-react";

export default function Courses() {
  const navigate = useNavigate();

  const courses = [
    { title: "Web Development", path: "/student/courses/web-development" },
    { title: "Mobile Development", path: "/student/courses/mobile-development" },
    { title: "Data Science", path: "/student/courses/data-science" },
    { title: "Machine Learning", path: "/student/courses/machine-learning" },
    { title: "Cloud Computing", path: "/student/courses/cloud-computing" },
    { title: "DevOps", path: "/student/courses/devops" },
    { title: "Cybersecurity", path: "/student/courses/cybersecurity" },
    { title: "Blockchain", path: "/student/courses/blockchain" },
    { title: "UI/UX Design", path: "/student/courses/uiux-design" },
    { title: "Digital Marketing", path: "/student/courses/digital-marketing" }
  ];

  const handleCourseClick = (course: { title: string; path: string }) => {
    const options = [
      {
        title: "Course Materials",
        icon: FileText,
        onClick: () => navigate(`/student/courses/study-materials?category=${course.title.toLowerCase().replace(/\s+/g, '-')}`)
      },
      {
        title: "Video Lessons",
        icon: Video,
        onClick: () => navigate(course.path)
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Card 
            key={index}
            className="glass-box hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={option.onClick}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <option.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{option.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen courses-background">
      <style>{`
        .courses-background {
          background: rgb(238,174,174);
          background: linear-gradient(90deg, rgba(238,174,174,1) 0%, rgba(143,112,190,1) 49%, rgba(52,40,185,1) 100%);
        }
        .glass-box {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.44);
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .glass-box:hover {
          background: rgba(255, 255, 255, 0.47);
          transform: scale(1.05);
        }
      `}</style>
      
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Available Courses</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div key={index} className="space-y-4">
              <Card 
                className="glass-box hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <Book className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                </CardContent>
              </Card>
              {handleCourseClick(course)}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}