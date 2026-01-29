
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from 'react-router-dom';

type StudyMaterial = {
  id: string;
  title: string;
  file_path: string;
  category: string;
};

export default function StudyMaterials() {
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category');

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

  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['studyMaterials', selectedCategory],
    queryFn: async () => {
      if (!user) {
        throw new Error('User must be authenticated to view materials');
      }

      const { data: materialsData, error: materialsError } = await supabase
        .from('course_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (materialsError) {
        console.error('Error fetching study materials:', materialsError);
        toast({
          title: "Error",
          description: "Failed to load study materials",
          variant: "destructive",
        });
        throw materialsError;
      }

      const materialsByCategory: Record<string, StudyMaterial[]> = {};

      // Process each category
      for (const category of categories) {
        const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
        
        const categoryMaterials = materialsData
          ?.filter(material => material.category === normalizedCategory)
          .map(material => {
            const { data } = supabase.storage
              .from('course-materials')
              .getPublicUrl(material.file_path);

            return {
              id: material.id,
              title: material.title,
              file_path: data.publicUrl,
              category: material.category
            };
          }) || [];

        materialsByCategory[category] = categoryMaterials;
      }

      return materialsByCategory;
    },
    enabled: !!user
  });

  // If a category is selected, only show materials for that category
  const displayCategories = selectedCategory 
    ? categories.filter(cat => cat.toLowerCase().replace(/\s+/g, '-') === selectedCategory)
    : categories;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {selectedCategory 
            ? `${selectedCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Materials`
            : 'Study Materials'}
        </h1>
      </div>

      {isLoading ? (
        <p>Loading study materials...</p>
      ) : error ? (
        <p className="text-red-500">Error loading materials. Please try again later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {materials && materials[category]?.length > 0 ? (
                    materials[category].map((material) => (
                      <div key={material.id} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <a
                          href={material.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {material.title}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No materials available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
