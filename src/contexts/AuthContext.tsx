import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, signInWithGoogle as firebaseSignInWithGoogle } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any; success?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // DEVELOPMENT: force dev bypass on so the app auto-signs as Dev User
  // Set to `true` to auto-login every visitor as the Dev User (use only for demo/submission)
  const DISABLE_AUTH_BYPASS = true;

  useEffect(() => {
    if (DISABLE_AUTH_BYPASS) {
      // Provide a lightweight fake user object for local/dev testing.
      const fakeUser: any = {
        uid: 'dev-user-1',
        email: 'dev@internai.local',
        displayName: 'Dev User',
        // minimal token function in case code calls it
        getIdToken: async () => 'dev-token'
      };
      setUser(fakeUser as unknown as FirebaseUser);
      setLoading(false);
      return;
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Auth state updated
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to the platform!"
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with Firebase:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('Firebase sign in successful:', userCredential.user.email);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully"
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Firebase sign in error:', error);
      let errorMessage = "An unexpected error occurred";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user: firebaseUser, error } = await firebaseSignInWithGoogle();
      
      if (error) throw error;
      
      if (firebaseUser) {
        toast({
          title: "Welcome!",
          description: "You have been signed in with Google successfully"
        });
        
        return { error: null, success: true };
      }
      
      return { error: null, success: true };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      
      toast({
        title: "Check your email",
        description: "We sent you a password reset link"
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut: handleSignOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};