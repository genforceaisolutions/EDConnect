import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";

export default function Blockchain() {
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      const url = `https://youtube138.p.rapidapi.com/search/?q=Blockchain&hl=en&gl=US&maxResults=30`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'd984697c89mshbe33dbe91ed22f1p149c7djsn93222271b3f9', // API key
          'x-rapidapi-host': 'youtube138.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (data.contents) {
          const filteredVideos = data.contents
            .filter(item => item.video)
            .slice(0, 30)
            .map(item => ({
              title: item.video.title,
              url: `https://www.youtube.com/embed/${item.video.videoId}`,
              thumbnail: item.video.thumbnails[0].url
            }));

          setVideos(filteredVideos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const openModal = (url) => {
    setCurrentVideo(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVideo("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blockchain Course</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openModal(video.url)}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="h-5 w-5" />
                <span>{video.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img src={video.thumbnail} alt={video.title} className="w-full h-auto rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg relative">
            <iframe 
              width="1000"
              height="600"
              src={currentVideo} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="aspect-video"
            ></iframe>
            <button onClick={closeModal} className="absolute top-2 right-2 text-red-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
