import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Courses = () => {
  const { data: videoMaterials } = useQuery({
    queryKey: ['video-materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold">Video Lessons</h2>
      {videoMaterials?.map((video) => (
        <div key={video.id} className="mb-4">
          <h3 className="font-semibold">{video.title}</h3>
          <iframe
            width="560"
            height="315"
            src={video.video_url.replace("watch?v=", "embed/")} // Convert to embed URL
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
};

export default Courses; 