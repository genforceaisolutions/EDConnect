import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Video } from "lucide-react";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");

  // Query to fetch all students
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Query to fetch teacher's live sessions
  const { data: liveSessions } = useQuery({
    queryKey: ['live-sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('teacher_id', user?.id)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    try {
      if (!user?.id) {
        throw new Error("You must be logged in to upload files");
      }

      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const filePath = `${category}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Insert record with the teacher_id set to the current user's ID
      const { error: dbError } = await supabase
        .from('course_materials')
        .insert({
          title: file.name,
          category,
          file_path: filePath,
          teacher_id: user.id // Explicitly set the teacher_id to the current user's ID
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const createLiveSession = async () => {
    try {
      if (!user?.id) {
        throw new Error("You must be logged in to create a live session");
      }

      const response = await supabase.functions.invoke('create-daily-room', {
        body: { roomName, scheduledFor },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Success",
        description: "Live session created successfully",
      });

      setRoomName("");
      setScheduledFor("");
    } catch (error) {
      console.error('Error creating live session:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create live session",
        variant: "destructive",
      });
    }
  };

  const handleVideoLinkUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const videoLink = event.target.value;
    // Validate and process the video link as needed
    if (videoLink) {
      // Logic to save the video link to your database or perform any action
      console.log(`Video link for ${category}: ${videoLink}`);
      // Optionally clear the input after processing
      event.target.value = '';
    }
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'UI/UX Design',
    'Digital Marketing'
  ];

  return (
    // We add the "gradient-background" class here, while keeping bg-gray-50
    <div className="min-h-screen bg-gray-50 gradient-background">
      {/* Style block for the gradient and glass effect */}
      <style>{`
        .gradient-background {
          background: linear-gradient(300deg, #f97316, #10b981, #3b82f6, #ec4899);
          background-size: 400% 400%;
          animation: gradient-animation 30s ease infinite;
        }
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glass-box {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .glass-box:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.02);
        }
      `}</style>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="live">Live Sessions</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            {/* Add the glass-box class to each Card */}
            <Card className="glass-box">
              <CardHeader>
                <CardTitle>Upload Course Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category} className="glass-box">
                      <CardHeader>
                        <CardTitle className="text-lg">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                category.toLowerCase().replace(/\s+/g, '-')
                              )
                            }
                            disabled={uploading}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live">
            <Card className="glass-box">
              <CardHeader>
                <CardTitle>Create Live Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomName">Room Name</Label>
                    <Input
                      id="roomName"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledFor">Schedule For</Label>
                    <Input
                      id="scheduledFor"
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                    />
                  </div>
                  <Button onClick={createLiveSession}>Create Live Session</Button>
                </div>

                {/* Display teacher's live sessions */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Your Live Sessions</h3>
                  <div className="space-y-4">
                    {liveSessions?.map((session: any) => (
                      <Card key={session.id} className="glass-box">
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <h4 className="font-medium">{session.room_name}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(session.scheduled_for).toLocaleString()}
                            </p>
                          </div>
                          <Button asChild>
                            <a
                              href={session.room_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Video className="mr-2" />
                              Join Session
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="glass-box">
              <CardHeader>
                <CardTitle>Students List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students?.map((student: any) => (
                    <Card key={student.id} className="glass-box">
                      <CardContent className="p-4">
                        <h4 className="font-medium">
                          {student.full_name || 'No name provided'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Joined: {new Date(student.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;
