import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const { data: profiles } = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    category: string
  ) => {
    try {
      if (!user?.id) {
        throw new Error("You must be logged in to upload files");
      }

      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const filePath = `${category}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("course-materials")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { error: dbError } = await supabase.from("course_materials").insert({
        title: file.name,
        category,
        file_path: filePath,
        teacher_id: user.id,
      });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      event.target.value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Blockchain",
    "UI/UX Design",
    "Digital Marketing",
  ];

  const filterProfilesByRole = (role: string) => {
    return profiles?.filter((profile) => profile.role === role) || [];
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    // Add gradient-background here
    <div className="min-h-screen bg-gray-50 gradient-background">
      {/* Add the style block for gradient and glass effect */}
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Admins Column */}
              <Card className="glass-box">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Admins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filterProfilesByRole("admin").map((profile) => (
                      <Card key={profile.id} className="glass-box">
                        <CardContent className="p-4">
                          <h4 className="font-medium">
                            {profile.full_name || "No name provided"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Role: {profile.role}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Teachers Column */}
              <Card className="glass-box">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filterProfilesByRole("teacher").map((profile) => (
                      <Card key={profile.id} className="glass-box">
                        <CardContent className="p-4">
                          <h4 className="font-medium">
                            {profile.full_name || "No name provided"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Role: {profile.role}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Students Column */}
              <Card className="glass-box">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filterProfilesByRole("student").map((profile) => (
                      <Card key={profile.id} className="glass-box">
                        <CardContent className="p-4">
                          <h4 className="font-medium">
                            {profile.full_name || "No name provided"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Role: {profile.role}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
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
                                category.toLowerCase().replace(/\s+/g, "-")
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
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
