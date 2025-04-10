
import React, { createContext, useContext, useState, useEffect } from 'react';
import dbService, { Thread, Post } from './db';
import { useToast } from '@/components/ui/use-toast';

interface DbContextType {
  loading: boolean;
  threads: Thread[];
  loadThreads: (board?: string) => Promise<Thread[]>;
  getThreadWithPosts: (threadId: string) => Promise<{thread: Thread, posts: Post[]} | null>;
  createThread: (title: string, name: string, content: string) => Promise<string | null>;
  createPost: (threadId: string, name: string, content: string) => Promise<string | null>;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const initDb = async () => {
      try {
        await dbService.init();
        const initialThreads = await dbService.getAllThreads();
        setThreads(initialThreads);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        toast({
          title: "Database Error",
          description: "Failed to initialize the database. Some features may not work properly.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initDb();

    // Set up auto-save
    const autoSaveInterval = setInterval(() => {
      dbService.saveToLocalStorage();
    }, 30000); // Save every 30 seconds

    return () => {
      clearInterval(autoSaveInterval);
      // Final save when component unmounts
      dbService.saveToLocalStorage();
    };
  }, []);

  const loadThreads = async (board?: string): Promise<Thread[]> => {
    try {
      const loadedThreads = await dbService.getAllThreads(board);
      setThreads(loadedThreads);
      return loadedThreads;
    } catch (error) {
      console.error('Error loading threads:', error);
      toast({
        title: "Error",
        description: "Failed to load threads",
        variant: "destructive",
      });
      return [];
    }
  };

  const value = {
    loading,
    threads,
    loadThreads,
    getThreadWithPosts: dbService.getThreadWithPosts.bind(dbService),
    createThread: dbService.createThread.bind(dbService),
    createPost: dbService.createPost.bind(dbService),
  };

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};

export const useDb = (): DbContextType => {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return context;
};
