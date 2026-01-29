'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Roadmap() {
  const navigate = useNavigate();

  const roadmapCategories = [
    { title: "Frontend", description: "Learn how to build user interfaces.", link: "https://roadmap.sh/frontend" },
    { title: "Backend", description: "Understand server-side development.", link: "https://roadmap.sh/backend" },
    { title: "Full Stack", description: "Master both frontend and backend development.", link: "https://roadmap.sh/full-stack"},
    { title: "AI Engineer", description: "Explore artificial intelligence concepts.", link: "https://roadmap.sh/ai-engineer" },
    { title: "Data Analyst", description: "Learn data analysis techniques.", link: "https://roadmap.sh/data-analyst" },
    { title: "AI and Data Scientist", description: "Explore data analysis and machine learning.", link: "https://roadmap.sh/ai-data-scientist" },
    { title: "Android", description: "Develop applications for Android devices.", link: "https://roadmap.sh/android" },
    { title: "iOS", description: "Create applications for iOS devices.", link: "https://roadmap.sh/ios" },
    { title: "PostgreSQL", description: "Learn about PostgreSQL database management.", link: "https://roadmap.sh/postgresql-dba" },
    { title: "Blockchain", description: "Discover the fundamentals of blockchain technology.", link: "https://roadmap.sh/blockchain" },
    { title: "QA", description: "Understand quality assurance processes.", link: "https://roadmap.sh/qa" },
    { title: "Software Architect", description: "Learn software architecture principles.", link: "https://roadmap.sh/software-architect" },
    { title: "Cyber Security", description: "Protect systems and networks from cyber threats.", link: "https://roadmap.sh/cyber-security" },
    { title: "UX Design", description: "Understand user experience design principles.", link: "https://roadmap.sh/ux-design" },
    { title: "Game Developer", description: "Create engaging games and interactive experiences.", link: "https://roadmap.sh/game-developer" },
    { title: "Technical Writer", description: "Learn how to write technical documentation.", link: "https://roadmap.sh/technical-writer" },
    { title: "MLOps", description: "Learn about machine learning operations.", link: "https://roadmap.sh/mlops" },
    { title: "Product Manager", description: "Learn how to manage product development.", link: "https://roadmap.sh/product-manager" },
    { title: "Engineering Manager", description: "Understand the role of an engineering manager.", link: "https://roadmap.sh/engineering-manager" },
  ];

  return (
    <div className="min-h-screen roadmap-background">
      <style >{`
        .roadmap-background {
          background: linear-gradient(90deg, rgba(173,216,230,1) 0%, rgba(100,149,237,1) 50%, rgba(70,130,180,1) 100%);
        }
        .glass-box {
          background: rgba(255, 255, 255, 0.52);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.53);
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .glass-box:hover {
          background: rgba(255, 255, 255, 0.52);
          transform: scale(1.05);
        }
      `}</style>
      
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Learning Roadmap</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Explore Your Learning Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapCategories.map((category, index) => (
            <Card 
              key={index} 
              className="glass-box hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => window.open(category.link, "_blank")} 
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <Map className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-gray-700">{category.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-800">Looking for more guidance?</p>
          <a 
            href="https://roadmap.sh" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-700 hover:text-blue-900 underline font-semibold"
          >
            Visit Roadmap.sh for more learning paths
          </a>
        </div>
      </main>
    </div>
  );
}