
import initSqlJs, { Database } from 'sql.js';

// Interface pour les threads
export interface Thread {
  id: string;
  title: string;
  created_at: string;
}

// Interface pour les posts
export interface Post {
  id: string;
  thread_id: string;
  name: string;
  content: string;
  timestamp: string;
  is_op: boolean;
}

class DatabaseService {
  private db: Database | null = null;
  private initialized: boolean = false;
  private initializing: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    if (this.initialized) return Promise.resolve();
    if (this.initializing) return this.initPromise as Promise<void>;
    
    this.initializing = true;
    this.initPromise = new Promise<void>(async (resolve, reject) => {
      try {
        console.log('Initializing SQLite database...');
        const SQL = await initSqlJs({
          // Specify the path to the wasm file
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        // Create a new database
        this.db = new SQL.Database();
        
        // Create tables if they don't exist
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS threads (
            id TEXT PRIMARY KEY,
            title TEXT,
            created_at TEXT
          );
          
          CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            thread_id TEXT,
            name TEXT,
            content TEXT,
            timestamp TEXT,
            is_op INTEGER,
            FOREIGN KEY(thread_id) REFERENCES threads(id)
          );
        `);
        
        // Insert initial data
        this.insertInitialData();
        
        this.initialized = true;
        this.initializing = false;
        console.log('SQLite database initialized successfully');
        resolve();
      } catch (error) {
        this.initializing = false;
        console.error('Failed to initialize SQLite database:', error);
        reject(error);
      }
    });
    
    return this.initPromise;
  }

  private insertInitialData() {
    if (!this.db) return;

    // Check if data already exists
    const result = this.db.exec("SELECT COUNT(*) FROM threads");
    if (result.length > 0 && result[0].values[0][0] > 0) {
      console.log("Initial data already exists, skipping insertion");
      return;
    }

    // Sample threads and posts
    const threads = [
      {
        id: "12345678",
        title: "Welcome to Anon Board",
        created_at: "04/10/25(Fri)12:34:56"
      },
      {
        id: "12345681",
        title: "Thread about cats",
        created_at: "04/10/25(Fri)14:22:31"
      },
      {
        id: "12345685",
        title: "Welcome to Anime",
        created_at: "04/10/25(Fri)13:30:00"
      },
      {
        id: "12345688",
        title: "Best manga of 2025?",
        created_at: "04/10/25(Fri)14:12:31"
      }
    ];

    const posts = [
      {
        id: "12345678",
        thread_id: "12345678",
        name: "Admin",
        content: "Welcome to Anon Board! This is a simple 4chan-like message board.\n\nRules:\n>Be respectful\n>No illegal content\n>Have fun!",
        timestamp: "04/10/25(Fri)12:34:56",
        is_op: 1
      },
      {
        id: "12345679",
        thread_id: "12345678",
        name: "",
        content: "First reply. How does this work?",
        timestamp: "04/10/25(Fri)12:35:23",
        is_op: 0
      },
      {
        id: "12345680",
        thread_id: "12345678",
        name: "Helper",
        content: ">>12345679\nJust like that! You can reply to posts using the format >>postID.",
        timestamp: "04/10/25(Fri)12:37:45",
        is_op: 0
      },
      {
        id: "12345681",
        thread_id: "12345681",
        name: "Cat Lover",
        content: "What's your favorite cat breed? Mine is Scottish Fold.",
        timestamp: "04/10/25(Fri)14:22:31",
        is_op: 1
      },
      {
        id: "12345682",
        thread_id: "12345681",
        name: "",
        content: ">not liking Maine Coons\nAnon, I...",
        timestamp: "04/10/25(Fri)14:25:12",
        is_op: 0
      },
      {
        id: "12345685",
        thread_id: "12345685",
        name: "Admin",
        content: "Welcome to the Anime board! Discuss anime, manga, and related Japanese culture.\n\nPlease be respectful of others' tastes.",
        timestamp: "04/10/25(Fri)13:30:00",
        is_op: 1
      },
      {
        id: "12345686",
        thread_id: "12345685",
        name: "",
        content: "What's everyone watching this season?",
        timestamp: "04/10/25(Fri)13:35:12",
        is_op: 0
      },
      {
        id: "12345687",
        thread_id: "12345685",
        name: "Weeb",
        content: ">>12345686\nThe new Chainsaw Man season is pretty good so far.",
        timestamp: "04/10/25(Fri)13:40:23",
        is_op: 0
      },
      {
        id: "12345688",
        thread_id: "12345688",
        name: "Manga Reader",
        content: "Now that we're a few months into 2025, what's your top manga pick so far?",
        timestamp: "04/10/25(Fri)14:12:31",
        is_op: 1
      },
      {
        id: "12345689",
        thread_id: "12345688",
        name: "",
        content: ">not reading One Piece\nIt's still the GOAT after all these years",
        timestamp: "04/10/25(Fri)14:25:12",
        is_op: 0
      }
    ];

    // Insert threads
    for (const thread of threads) {
      this.db.run(
        "INSERT INTO threads (id, title, created_at) VALUES (?, ?, ?)",
        [thread.id, thread.title, thread.created_at]
      );
    }

    // Insert posts
    for (const post of posts) {
      this.db.run(
        "INSERT INTO posts (id, thread_id, name, content, timestamp, is_op) VALUES (?, ?, ?, ?, ?, ?)",
        [post.id, post.thread_id, post.name, post.content, post.timestamp, post.is_op]
      );
    }

    console.log("Initial data inserted successfully");
  }

  async getAllThreads(board?: string): Promise<Thread[]> {
    await this.init();
    if (!this.db) return [];

    let query = "SELECT * FROM threads";
    
    // Filter threads by board
    if (board) {
      // For demonstration purposes, we'll use thread IDs to determine the board
      // In a real app, you'd have a board field in your threads table
      if (board === "anime") {
        query += " WHERE id IN ('12345685', '12345688')";
      } else if (board === "technology") {
        // Currently no technology threads in our sample, so return none
        query += " WHERE id = ''";
      } else if (board === "random") {
        query += " WHERE id IN ('12345678', '12345681')";
      }
    }
    
    query += " ORDER BY created_at DESC";
    
    try {
      const result = this.db.exec(query);
      if (result.length === 0) return [];
      
      const threads: Thread[] = [];
      const columns = result[0].columns;
      const values = result[0].values;
      
      for (const row of values) {
        const thread: any = {};
        columns.forEach((col, i) => {
          thread[col] = row[i];
        });
        threads.push(thread as Thread);
      }
      
      return threads;
    } catch (error) {
      console.error('Error fetching threads:', error);
      return [];
    }
  }

  async getThreadWithPosts(threadId: string): Promise<{thread: Thread, posts: Post[]} | null> {
    await this.init();
    if (!this.db) return null;
    
    try {
      // Get thread
      const threadResult = this.db.exec(`SELECT * FROM threads WHERE id = '${threadId}'`);
      if (threadResult.length === 0) return null;
      
      const threadColumns = threadResult[0].columns;
      const threadValues = threadResult[0].values[0];
      
      const thread: any = {};
      threadColumns.forEach((col, i) => {
        thread[col] = threadValues[i];
      });
      
      // Get posts
      const postsResult = this.db.exec(`SELECT * FROM posts WHERE thread_id = '${threadId}' ORDER BY timestamp ASC`);
      const posts: Post[] = [];
      
      if (postsResult.length > 0) {
        const postsColumns = postsResult[0].columns;
        const postsValues = postsResult[0].values;
        
        for (const row of postsValues) {
          const post: any = {};
          postsColumns.forEach((col, i) => {
            if (col === 'is_op') {
              post[col] = Boolean(row[i]);
            } else {
              post[col] = row[i];
            }
          });
          posts.push(post as Post);
        }
      }
      
      return {
        thread: thread as Thread,
        posts
      };
    } catch (error) {
      console.error('Error fetching thread with posts:', error);
      return null;
    }
  }

  async createThread(title: string, name: string, content: string): Promise<string | null> {
    await this.init();
    if (!this.db) return null;
    
    try {
      const timestamp = new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$1/$2/$3(Fri)$4:$5:$6');
      
      const threadId = Date.now().toString();
      const postId = (Date.now() + 1).toString();
      
      // Create thread
      this.db.run(
        "INSERT INTO threads (id, title, created_at) VALUES (?, ?, ?)",
        [threadId, title, timestamp]
      );
      
      // Create first post (OP)
      this.db.run(
        "INSERT INTO posts (id, thread_id, name, content, timestamp, is_op) VALUES (?, ?, ?, ?, ?, ?)",
        [postId, threadId, name, content, timestamp, 1]
      );
      
      return threadId;
    } catch (error) {
      console.error('Error creating thread:', error);
      return null;
    }
  }

  async createPost(threadId: string, name: string, content: string): Promise<string | null> {
    await this.init();
    if (!this.db) return null;
    
    try {
      const timestamp = new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$1/$2/$3(Fri)$4:$5:$6');
      
      const postId = Date.now().toString();
      
      // Create post
      this.db.run(
        "INSERT INTO posts (id, thread_id, name, content, timestamp, is_op) VALUES (?, ?, ?, ?, ?, ?)",
        [postId, threadId, name, content, timestamp, 0]
      );
      
      return postId;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  }

  // Save database to local storage
  saveToLocalStorage() {
    if (!this.db) return;
    
    const data = this.db.export();
    const buffer = new Uint8Array(data);
    const blob = new Blob([buffer]);
    
    const reader = new FileReader();
    reader.onload = function() {
      if (typeof reader.result === 'string') {
        localStorage.setItem('sqliteDatabase', reader.result);
        console.log('Database saved to local storage');
      }
    };
    reader.readAsDataURL(blob);
  }

  // Load database from local storage
  async loadFromLocalStorage(): Promise<boolean> {
    const data = localStorage.getItem('sqliteDatabase');
    if (!data) return false;
    
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });
      
      const binary = atob(data.split(',')[1]);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      
      this.db = new SQL.Database(array);
      this.initialized = true;
      console.log('Database loaded from local storage');
      return true;
    } catch (error) {
      console.error('Error loading database from local storage:', error);
      return false;
    }
  }
}

// Create singleton instance
const dbService = new DatabaseService();
export default dbService;
