import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const url = 'https://internships-api.p.rapidapi.com/active-jb-7d';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'd984697c89mshbe33dbe91ed22f1p149c7djsn93222271b3f9',
    'x-rapidapi-host': 'internships-api.p.rapidapi.com'
  }
};

export default function Internships() {
  const [internships, setInternships] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        const formattedInternships = result.map(internship => ({
          ...internship,
          link: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(internship.title)}`
        }));
        
        setInternships(formattedInternships);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch internships.",
          variant: "destructive",
        });
      }
    };

    fetchInternships();
  }, []);

  return (
    <div className="min-h-screen internships-background">
      <style >{`
        .internships-background {
          background: rgb(238,174,174);
          background: linear-gradient(90deg, rgba(238,174,174,1) 0%, rgba(143,112,190,1) 49%, rgba(52,40,185,1) 100%);
        }
        .glass-box {
          background: rgba(255, 255, 255, 0.54);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .glass-box:hover {
          background: rgba(255, 255, 255, 0.46);
          transform: scale(1.05);
        }
      `}</style>
      
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Internships</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Available Internships
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship, index) => (
            <Card key={index} className="glass-box hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6 flex flex-col items-start text-left space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">{internship.title}</h3>
                <p className="text-gray-600">{internship.description}</p>
                <p className="text-gray-500">{internship.company}</p>
                <p className="text-gray-500">{internship.location}</p>
                <a 
                  href={internship.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  Apply Now
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}