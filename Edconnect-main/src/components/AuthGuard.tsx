
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthed = await checkAuth();
      
      if (!isAuthed) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    verifyAuth();
  }, [checkAuth, navigate, requiredRole, user?.role]);

  return <>{children}</>;
};

export default AuthGuard;
