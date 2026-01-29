import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface LiveSession {
  id: string;
  room_name: string;
  scheduled_for: string;
  room_url: string;
  teacher_id: string;
}

export default function Meetings() {
  const { user } = useAuth();

  const { data: liveSessions, isLoading } = useQuery({
    queryKey: ["liveSessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_sessions")
        .select("*")
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      return data as LiveSession[];
    },
    enabled: !!user,
  });

  return (
    // Gradient background
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
      {/* Define the blurred glass effect */}
      <style>
        {`
          .glass {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
          }
        `}
      </style>

      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Scheduled Meetings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-white">Loading scheduled meetings...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveSessions &&
              liveSessions.map((session) => (
                <Card
                  key={session.id}
                  // Apply the glass class for the blurred glass effect
                  className="hover:shadow-lg transition-shadow duration-200 glass"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 bg-blue-50 rounded-full">
                        <Calendar className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {session.room_name}
                      </h3>
                      <p className="text-gray-600">
                        {format(
                          new Date(session.scheduled_for),
                          "MMMM dd, yyyy 'at' h:mm a"
                        )}
                      </p>
                      <a
                        href={session.room_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
