import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import fs from "fs";

const __filenameVal = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
const __dirnameVal = typeof __dirname !== "undefined" ? __dirname : path.dirname(__filenameVal);

const app = express();
const PORT = 3000;

app.use(express.json());

// Determine safe database path (especially for serverless environments like Cloud Run)
let dbPath = "leetmaster.db";

function isWritable(dir: string): boolean {
  try {
    const testFile = path.resolve(dir, `.test_write_${Date.now()}`);
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    return true;
  } catch (e) {
    return false;
  }
}

if (!isWritable(process.cwd())) {
  dbPath = "/tmp/leetmaster.db";
  console.log(`Current directory is not writable. Initializing database at ${dbPath}`);
} else {
  dbPath = path.resolve(process.cwd(), "leetmaster.db");
  console.log(`Initializing database at ${dbPath}`);
}

let db: Database.Database;
try {
  db = new Database(dbPath);
} catch (err) {
  console.error(`Failed to initialize SQLite at ${dbPath}, falling back to in-memory database:`, err);
  db = new Database(":memory:");
}

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel TEXT NOT NULL,
    sender TEXT NOT NULL,
    avatar TEXT NOT NULL,
    isAdmin INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    content TEXT NOT NULL,
    reactions TEXT NOT NULL DEFAULT '[]',
    parentId TEXT DEFAULT NULL
  )
`);

// Safe migrations to ensure newly added columns exist in older/existing database instances
try {
  db.exec("ALTER TABLE messages ADD COLUMN avatar TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop'");
} catch (e) {}

try {
  db.exec("ALTER TABLE messages ADD COLUMN reactions TEXT NOT NULL DEFAULT '[]'");
} catch (e) {}

try {
  db.exec("ALTER TABLE messages ADD COLUMN parentId TEXT DEFAULT NULL");
} catch (e) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    fullName TEXT,
    username TEXT,
    bio TEXT,
    company TEXT,
    jobTitle TEXT,
    location TEXT,
    institution TEXT,
    website TEXT,
    github TEXT,
    linkedin TEXT,
    twitter TEXT,
    youtube TEXT,
    instagram TEXT,
    leetcode TEXT,
    medium TEXT,
    hashnode TEXT,
    peerlist TEXT,
    addressLine TEXT,
    city TEXT,
    state TEXT,
    pinCode TEXT,
    phone TEXT,
    tshirtSize TEXT,
    avatar TEXT,
    professional TEXT,
    experience TEXT,
    certifications TEXT,
    education TEXT,
    projects TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    avatar TEXT NOT NULL,
    category TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    isUserBlog INTEGER DEFAULT 0,
    status TEXT DEFAULT 'public'
  )
`);

try {
  db.exec("ALTER TABLE blogs ADD COLUMN status TEXT DEFAULT 'public'");
} catch (e) {
  // column already exists, safe to ignore
}

db.exec(`
  CREATE TABLE IF NOT EXISTS hackathons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT NOT NULL,
    prizes TEXT NOT NULL,
    deadline TEXT NOT NULL,
    author TEXT NOT NULL,
    avatar TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    isUserHackathon INTEGER DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    avatar TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    isUserEvent INTEGER DEFAULT 0
  )
`);

// Insert default seed events if table is empty
const eventsCheck = db.prepare("SELECT COUNT(*) as count FROM events");
const { count: eventsCount } = eventsCheck.get() as { count: number };
if (eventsCount === 0) {
  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, description, date, time, location, category, author, avatar, timestamp, isUserEvent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEvent.run(
    'seed-event-1',
    'Mastering Dynamic Programming Patterns',
    'Join our community experts in solving DP patterns like 0/1 Knapsack, LCS, and Interval DP. Walk away with clear intuition, logic-building strategies, and optimized code templates.',
    'July 12, 2026',
    '6:00 PM',
    'Discord Hall 1 (Virtual)',
    'DSA Study Session',
    'LeetMaster Mentor',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=128&auto=format&fit=crop',
    'July 08, 2026',
    0
  );

  insertEvent.run(
    'seed-event-2',
    'Generative AI Hackathon Prep Masterclass',
    'Ready for the Agentic AI Hackathon? Learn how to structure prompt logic, implement tools, and utilize the modern Google Gemini SDK to build full-stack responsive web applications.',
    'July 18, 2026',
    '5:00 PM',
    'Google Meet Link (Virtual)',
    'Webinar & Workshop',
    'Google GDG Mentor',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=128&auto=format&fit=crop',
    'July 07, 2026',
    0
  );

  insertEvent.run(
    'seed-event-3',
    'AMA Session: Career Guidance & System Design',
    'Curious about career progression, system architecture design, or tech interview processes? Bring your questions for an interactive and live Ask-Me-Anything session with principal tech experts.',
    'July 22, 2026',
    '7:00 PM',
    'YouTube Live Broadcast',
    'AMA Session',
    'Tech Architect',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop',
    'July 06, 2026',
    0
  );
}

// Insert default seed hackathons if table is empty
const hackathonsCheck = db.prepare("SELECT COUNT(*) as count FROM hackathons");
const { count: hackathonsCount } = hackathonsCheck.get() as { count: number };
if (hackathonsCount === 0) {
  const insertHackathon = db.prepare(`
    INSERT INTO hackathons (id, title, description, tags, prizes, deadline, author, avatar, timestamp, isUserHackathon)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertHackathon.run(
    'seed-hackathon-1',
    'LeetMaster Global Algorithmic Showdown',
    'Design optimized algorithmic modules and structural data parsing tools on the LeetMaster local workspace. Compete with global developers to resolve advanced tree-balancing, graph routing, and dynamic programming challenges with real-time feedback loops.',
    'Algorithms, Data Structures, Performance',
    '$5,000 Cash Prize + Premium Swag',
    'July 25, 2026',
    'LeetMaster Team',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=128&auto=format&fit=crop',
    'July 08, 2026',
    0
  );

  insertHackathon.run(
    'seed-hackathon-2',
    'Google Solution Challenge: Agentic AI Edition',
    'Build and deploy real-world agents using the Gemini API SDK, focused on solving local communities, educative challenges, or workspace automated assistants. Leverage structured tool calls, system instructions, and multi-agent systems to win.',
    'Generative AI, Agentic, Python, Node.js',
    'Google Pixel 9 Pro + $10,000 Cloud Credits',
    'August 15, 2026',
    'Google GDG Team',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=128&auto=format&fit=crop',
    'July 07, 2026',
    0
  );

  insertHackathon.run(
    'seed-hackathon-3',
    'Meta Llama 3 Hackathon',
    'Explore the limits of Llama 3 open models on complex reasoning datasets. Develop tools that evaluate code logic correctness, assist students in learning complex mathematics, or run local optimization solvers.',
    'LLMs, Python, System Design',
    'RTX 4090 GPU + Meta Mentorship',
    'July 30, 2026',
    'Meta AI Team',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop',
    'July 06, 2026',
    0
  );
}

// Create user_projects table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS user_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    codeLink TEXT NOT NULL,
    deployLink TEXT,
    startDate TEXT NOT NULL,
    endDate TEXT,
    status TEXT NOT NULL,
    author TEXT NOT NULL,
    avatar TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    isUserProject INTEGER DEFAULT 0
  )
`);

// Create dsa_submissions table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS dsa_submissions (
    id TEXT PRIMARY KEY,
    problemId TEXT NOT NULL,
    problemTitle TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    category TEXT NOT NULL,
    language TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL
  )
`);

// Create card_comments and card_reactions tables
db.exec(`
  CREATE TABLE IF NOT EXISTS card_comments (
    id TEXT PRIMARY KEY,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    author TEXT NOT NULL,
    avatar TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS card_reactions (
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    emoji TEXT NOT NULL,
    users TEXT NOT NULL,
    PRIMARY KEY (item_type, item_id, emoji)
  )
`);

// Clear dsa_submissions table to ensure 0 progress initially
try {
  db.exec("DELETE FROM dsa_submissions");
} catch (err) {
  console.error("Failed to clear dsa_submissions table:", err);
}

// Migrate existing tables to support status column if missing
try {
  db.exec("ALTER TABLE blogs ADD COLUMN status TEXT DEFAULT 'public'");
} catch (e) {
  // Column already exists, safe to ignore
}
try {
  db.exec("ALTER TABLE events ADD COLUMN status TEXT DEFAULT 'public'");
} catch (e) {
  // Column already exists, safe to ignore
}
try {
  db.exec("ALTER TABLE hackathons ADD COLUMN status TEXT DEFAULT 'public'");
} catch (e) {
  // Column already exists, safe to ignore
}

// Insert default seed projects if table is empty
const projectsCheck = db.prepare("SELECT COUNT(*) as count FROM user_projects");
const { count: projectsCount } = projectsCheck.get() as { count: number };
if (projectsCount === 0) {
  const insertProject = db.prepare(`
    INSERT INTO user_projects (id, title, description, codeLink, deployLink, startDate, endDate, status, author, avatar, timestamp, isUserProject)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProject.run(
    'seed-project-1',
    'LeetMaster Algo-Visualizer',
    'An interactive whiteboard and live visualizer for complex graph traversals, recursion trees, and dynamic programming tables. Made to help developers build spatial intuition for hard DSA problems.',
    'https://github.com/dastgeer/algo-visualizer',
    'https://algo-visualizer.leetmaster.com',
    '2026-05-15',
    '2026-06-10',
    'public',
    'LeetMaster Lead',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=128&auto=format&fit=crop',
    'June 10, 2026',
    0
  );

  insertProject.run(
    'seed-project-2',
    'AI Interview Prep Co-Pilot',
    'A real-time audio and text assistant that conducts mock tech interviews based on specialized role guidelines, offering deep analytics on DSA complexity, communication clarity, and syntax correctness.',
    'https://github.com/dastgeer/ai-mock-copilot',
    'https://copilot.leetmaster.ai',
    '2026-06-01',
    '2026-06-25',
    'public',
    'Elite Scholar',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop',
    'June 25, 2026',
    0
  );
}

// Insert default seed blogs if table is empty
const blogsCheck = db.prepare("SELECT COUNT(*) as count FROM blogs");
const { count: blogsCount } = blogsCheck.get() as { count: number };
if (blogsCount === 0) {
  const insertBlog = db.prepare(`
    INSERT INTO blogs (id, title, content, author, avatar, category, timestamp, likes, isUserBlog)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBlog.run(
    'seed-blog-react-19',
    'Unlocking React 19: Action Hooks & Concurrent Mastery',
    'React 19 brings some of the most anticipated upgrades to full-stack and client-side applications. The star of the show is **Actions**—a new standard way to handle async mutations like form submissions. \n\n### 🔑 Action Hooks: `useActionState` and `useFormStatus`\nPreviously, managing loading states and error messages in forms required multiple `useState` properties. React 19 standardizes this with the custom `useActionState` hook:\n\n```tsx\nconst [state, formAction, isPending] = useActionState(\n  async (prevState, formData) => {\n    const response = await updateProfile(formData);\n    return response;\n  },\n  null\n);\n```\n\nAdditionally, the `useOptimistic` hook enables dynamic, fast-feeling updates by allowing developers to assume backend success and fallback seamlessly if a network error occurs.\n\n### 🚀 Seamless Server Components\nReact Server Components (RSC) are now fully integrated. This means components can run exclusively on the server, speeding up load times and reducing the client-side bundle significantly. \n\nBy leveraging these concepts, you can build extremely robust, snappy, and modern UI experiences that feel instant and handle errors gracefully.',
    'Dastgeer (Admin)',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop',
    'Web Development',
    'July 08, 2026',
    42,
    0
  );

  insertBlog.run(
    'seed-blog-ml-basics',
    'Demystifying Machine Learning: Gradient Descent and Loss Functions',
    'At the heart of almost every Machine Learning algorithm lies an optimization problem. How do we take a randomized set of weights and train them to predict house prices, translate languages, or recognize cats?\n\n### 📈 The Loss Function (Cost Function)\nTo improve, a model must first understand how wrong it is. We compute this error using a **Loss Function** (such as Mean Squared Error for regression):\n\n$$L(w, b) = \\frac{1}{N} \\sum_{i=1}^N (y_i - (w x_i + b))^2$$\n\nOur ultimate objective is to minimize this loss, shifting the weights to find the lowest possible value.\n\n### 🚀 Gradient Descent: Walking Down the Hill\nGradient Descent is an iterative optimization algorithm. It computes the derivative (the gradient) of the loss function with respect to each weight. By taking steps in the opposite direction of the gradient, we gradually walk down the "loss hill" toward the global minimum.\n\n```python\n# Basic gradient descent loop\nfor epoch in range(epochs):\n    y_pred = w * x + b\n    dw = -2 * mean(x * (y_true - y_pred))\n    db = -2 * mean(y_true - y_pred)\n    w -= learning_rate * dw\n    b -= learning_rate * db\n```\n\n### ⚠️ Learning Rates & Convergence\nChoosing the right **Learning Rate** (the step size) is critical. Too small, and the model trains too slowly. Too large, and it diverges, bouncing right out of the valley of minimal loss.',
    'ML Coach',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=128&auto=format&fit=crop',
    'Programming Languages',
    'July 07, 2026',
    28,
    0
  );

  insertBlog.run(
    'seed-blog-sys-design',
    'Mastering System Design: Caching Patterns and Strategies',
    'As system architectures scale from hundreds to millions of active users, databases inevitably become the bottleneck. The single most effective tool to mitigate database stress and reduce latency is a well-designed **Caching Strategy**.\n\n### 🧱 Cache-Aside (Lazy Loading)\nIn the cache-aside pattern, the application queries the cache first. If there is a "cache miss," it fetches the record from the database and asynchronously writes it to the cache for future reads.\n\n- **Pros**: Only requests actually read are cached. High memory efficiency.\n- **Cons**: First read always incurs a cache miss (higher latency).\n\n### 🔄 Write-Through & Write-Behind\n- **Write-Through**: The application writes to the cache and the database simultaneously. The cache is always up to date.\n- **Write-Behind (Write-Back)**: The application writes exclusively to the cache, which then batches updates to the database asynchronously. This provides blazing fast write speeds, but runs the risk of data loss if the cache server crashes before flushing to disk.\n\n### ⚠️ Cache Invalidation & Eviction\nWhen memory fills up, the cache must evict entries using algorithms like **LRU** (Least Recently Used) or **LFU** (Least Frequently Used). Setting proper TTLs (Time-To-Live) ensures the cache doesn\'t serve stale data, maintaining system consistency.',
    'System Architect',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop',
    'Database',
    'July 06, 2026',
    35,
    0
  );
}

// Insert default seed profile if not exists
const profileCheck = db.prepare("SELECT COUNT(*) as count FROM profiles WHERE id = 'default'");
const { count: profileCount } = profileCheck.get() as { count: number };
if (profileCount === 0) {
  const insertProfile = db.prepare(`
    INSERT INTO profiles (
      id, fullName, username, bio, company, jobTitle, location, institution,
      website, github, linkedin, twitter, youtube, instagram, leetcode, medium, hashnode, peerlist,
      addressLine, city, state, pinCode, phone, tshirtSize, avatar, professional, experience, certifications, education, projects
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertProfile.run(
    'default',
    'Dastgeer',
    'dastgeerjutt8888_d2a00f46',
    'Learning AI/ML, Deep Learning, NLP, Computer Vision & Generative AI | Python Enthusiast |',
    '',
    '',
    '',
    '',
    'https://example.com',
    'https://github.com/username',
    'https://www.linkedin.com/in/muhammad-dastgeer/',
    'https://twitter.com/username',
    'https://youtube.com/channel/username',
    'https://instagram.com/username',
    'https://leetcode.com/username',
    'https://medium.com/@username',
    'https://username.hashnode.dev',
    'https://peerlist.io/username',
    '',
    '',
    '',
    '',
    '',
    'L',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop',
    JSON.stringify({
      skills: ['ML', 'DL', 'CV', 'Agentic AI', 'Gen AI', 'Python', 'DSA'],
      yearsOfExperience: '0',
      targetRole: 'AI Developer',
      workMode: 'Remote',
      ctc: ''
    }),
    JSON.stringify([]),
    JSON.stringify([]),
    JSON.stringify([]),
    JSON.stringify([])
  );
}

// Insert default seed messages if table is empty
db.exec("DELETE FROM messages WHERE id IN ('rules-1', 'seed-books-1', 'seed-roadmap-1', 'seed-blog-1', 'seed-ml-1', 'seed-dl-1', 'seed-cv-1', 'seed-agentic-ai-1', 'seed-gen-ai-1', 'seed-python-1', 'seed-dsa-1', 'seed-nlp-1', 'seed-system-design-1')");

const countStmt = db.prepare("SELECT COUNT(*) as count FROM messages WHERE id = 'rules-1'");
const { count } = countStmt.get() as { count: number };

if (count === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO messages (id, channel, sender, avatar, isAdmin, timestamp, content, reactions, parentId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(
    'rules-1',
    'rules',
    '', // No name given
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=128&auto=format&fit=crop',
    1,
    'Official Space Announcement',
    `🚨 **Welcome to the LeetMaster Community Guidelines**

To make sure that our Space remains a productive, friendly, and helpful learning environment for every student, please strictly adhere to the following rules:

1. **Be Respectful & Professional**: Speak politely with your peers. Personal attacks, rude language, harassment, or offensive comments will result in an immediate permanent ban.

2. **No Spamming or Advertisements**: Posting promotional links, discount or referral codes, or external product advertisements in any chat is strictly forbidden. Let's keep our focus completely on DSA sheets and coding.

3. **Stay Topic-Relevant**: Post queries, explanations, and shared resources in their relevant channels. For general discussion, please use the #general channel.

4. **Honest Collaboration**: Share doubts, pair program responsibly, and help each other learn. Complete and submit peer evaluation forms accurately and consistently.

Thank you for being an active, key member of our community! Let's crush our coding goals together! 🚀`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-books-1',
    'books',
    'AI Librarian',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 09:00 AM',
    `📚 **Must-Read Books for Software Engineers and AI Enthusiasts**

Here is a curated collection of some of the most highly recommended books across key domains:

### 🧩 Data Structures & Algorithms
- **Introduction to Algorithms (CLRS)**: The ultimate bible for DSA concepts and rigorous math.
- **Grokking Algorithms** by Aditya Bhargava: An absolute masterpiece for visual learners who want intuitive explanations.

### 🤖 Machine Learning & Deep Learning
- **Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow** by Aurélien Géron: The most practical and comprehensive book to start implementing ML algorithms.
- **Deep Learning** by Ian Goodfellow, Yoshua Bengio, and Aaron Courville: The definitive academic reference for deep networks.

### 🏗️ Systems & Architecture
- **Designing Data-Intensive Applications** by Martin Kleppmann: Essential for learning storage engines, distributed systems, and real-world system design.

Feel free to share your favorites and ask for specific recommendations here! 📖`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-roadmap-1',
    'roadmap',
    'Space Guide',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 09:15 AM',
    `🗺️ **Mastery Roadmaps: From Zero to AI/DSA Expert**

Planning your learning journey is crucial. Here are proven roadmaps to structure your progress:

### 🐍 Python & Coding Foundation
1. **Syntax & Logic**: Loops, functions, and standard libraries.
2. **Object-Oriented Programming (OOP)**: Classes, inheritance, polymorphism.
3. **Advanced Features**: Decorators, generators, context managers.
4. **Data Handling**: Pandas, NumPy, and file serialization.

### 🧩 DSA Roadmap (Cracking Coding Interviews)
1. **Basics**: Arrays, Strings, Hash Tables (complexity analysis).
2. **Intermediate**: Linked Lists, Stacks, Queues, Recursion.
3. **Advanced**: Binary Trees, BSTs, Graphs, Heaps.
4. **Top-Tier**: Dynamic Programming, Backtracking, Segment Trees.

### 🤖 Generative AI & Agentic AI Specialist
1. **Foundations**: Deep Learning, Backprop, CNN/RNN.
2. **Transformer Era**: Attention Mechanisms, BERT, GPT architectures.
3. **LLM Apps**: Prompt Engineering, Embeddings, Vector Databases, RAG (Retrieval-Augmented Generation).
4. **Agentic Frameworks**: Multi-agent systems, Tool Integration, Planning (CrewAI, LangGraph, AutoGen).

Which roadmap are you currently pursuing? Discuss your timeline here! 🚀`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-blog-1',
    'blog',
    'Tech Editor',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 09:30 AM',
    `✍️ **Top Tech Blogs & Publications to Follow**

Staying updated is the superpower of any tech enthusiast. Bookmark these excellent publications:

### 🔬 Research & Breakthroughs
- **Google Research Blog**: Deep dives into Google Gemini developments, state-of-the-art vision models, and computer science breakthroughs.
- **OpenAI Blog**: Updates on ChatGPT, Sora, GPT o1, and alignment methodologies.

### 📊 Applied ML & Engineering
- **Towards Data Science (Medium)**: Highly practical community articles covering ML workflows, visualization, and Python tricks.
- **The Pragmatic Engineer** by Gergely Orosz: The #1 newsletter for software engineers, detailing real industry trends and system architecture.

### 🧩 Interview Prep & Solutions
- **LeetCode Discuss & GeeksforGeeks**: Practical discussion boards with detailed solutions for tough programming challenges.

What are your favorite blogs? Link them below! 🔗`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-ml-1',
    'ml',
    'ML Lead',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 10:00 AM',
    `📈 **Welcome to #ml - Machine Learning Hub**

This channel is dedicated to the foundations of Machine Learning!

### 🎯 Key Areas
- **Supervised Learning**: Linear/Logistic Regression, Decision Trees, Random Forests, XGBoost, SVMs.
- **Unsupervised Learning**: K-Means clustering, PCA (Dimensionality Reduction), Anomaly Detection.
- **Evaluation Metrics**: Precision, Recall, F1-Score, ROC-AUC, Mean Squared Error (MSE).

### 🛠️ Core Toolkit
- \`scikit-learn\` for quick classical algorithms.
- \`pandas\` & \`numpy\` for data manipulation.
- \`matplotlib\` & \`seaborn\` for gorgeous plots.

Let's share our notebooks, dataset cleaning tips, and math concepts here! 📊`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-dl-1',
    'dl',
    'DL Researcher',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 10:15 AM',
    `⚡ **Welcome to #dl - Deep Learning**

Let's dive deep into neural networks!

### 🧬 Core Concepts
- **Feedforward Networks (MLPs)**: Backpropagation, activation functions (ReLU, GELU, Sigmoid), and gradient descent.
- **Convolutional Networks (CNNs)**: Pooling layers, stride, padding, kernel filters.
- **Sequence Models (RNNs/LSTMs)**: Handling time series and text processing.
- **Transformers**: Multi-Head Attention, self-attention mechanisms, and positional encoding.

### 🛠️ Frameworks
- **PyTorch**: Dynamic computational graphs (industry & research favorite).
- **TensorFlow / Keras**: Production-focused, great ecosystem.

What are you currently training? Share your learning rate, batch size, and model convergence curves! 📉`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-cv-1',
    'cv',
    'Vision Expert',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 10:30 AM',
    `👁️ **Welcome to #cv - Computer Vision**

Teaching computers to see and understand the visual world!

### 🔭 Key Tasks
- **Image Classification**: ResNet, EfficientNet, Vision Transformers (ViT).
- **Object Detection**: YOLO (You Only Look Once), Faster R-CNN.
- **Segmentation**: U-Net, Mask R-CNN, Segment Anything Model (SAM).
- **Generative Vision**: Diffusion Models, GANs, Neural Radiance Fields (NeRFs).

### 🛠️ Key Libraries
- \`opencv-python\` for image manipulation and classical filtering.
- \`torchvision\` and \`HuggingFace timm\` for pre-trained state-of-the-art vision backbones.

Share your camera feed processing scripts, bounding boxes, or creative AI-generated artwork here! 🎨`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-agentic-ai-1',
    'agentic-ai',
    'Agent Developer',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 10:45 AM',
    `🧠 **Welcome to #agentic-ai - Autonomous AI Agents**

AI is shifting from static chat prompts to active, autonomous agents that can plan, use tools, and execute workflows!

### 🧱 Architectural Pillars
1. **Planning**: ReAct (Reason + Act) loop, Reflection, Self-Correction, Tree of Thoughts.
2. **Memory**: Short-term (in-context), Long-term (Vector database search/RAG).
3. **Tools**: Database querying, Web search, API execution, Code execution environment.
4. **Action**: Performing steps autonomously to achieve user objectives.

### 🛠️ Modern Frameworks
- **CrewAI**: Highly declarative, great for task-oriented multi-agent teams.
- **LangGraph**: Cyclical graph-based agent design, perfect for fine-grained control.
- **AutoGen**: Multi-agent conversation framework by Microsoft.

What agents have you built? Let's discuss system prompts, loop limits, and cost optimization! 🤖`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-gen-ai-1',
    'gen-ai',
    'GenAI Engineer',
    'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 11:00 AM',
    `🎨 **Welcome to #gen-ai - Generative AI Hub**

Discuss LLMs, text generation, prompting strategies, and LLM-powered applications.

### 🌟 Key Technologies
- **Large Language Models (LLMs)**: Google Gemini, GPT-4o, Claude 3.5 Sonnet, Llama-3.
- **RAG (Retrieval-Augmented Generation)**: Connecting LLMs to private documents using Vector Embeddings (Chroma, Pinecone).
- **Prompt Engineering**: Few-shot prompting, Chain of Thought (CoT), System instructions.

Let's discuss Gemini API integrations, token limits, system instructions, and how to reduce hallucinations! 💬`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-python-1',
    'python',
    'Python Guru',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 11:15 AM',
    `🐍 **Welcome to #python - Core Python Programming**

The beloved, universal programming language of AI and Software Development.

### 🚀 Advanced Concepts to Master
- **Decorators**: Modifying behavior of functions or classes without changing their code.
- **Generators & Iterators**: Saving memory using \`yield\` and lazy evaluation.
- **Context Managers**: Managing resources cleanly using \`with\` blocks (e.g., database & file handles).
- **Asynchronous Python**: Concurrent tasks using \`asyncio\` and \`await\`.

### ⚡ Recommended Frameworks
- **APIs**: FastAPI (fastest, automatic documentation), Flask (lightweight).
- **Data Science**: NumPy, Pandas, Polars.

Post your Python questions, code snippets, or performance challenges here! 🐍`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-dsa-1',
    'dsa',
    'DSA Coach',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 11:30 AM',
    `🧩 **Welcome to #dsa - Data Structures & Algorithms**

Let's master algorithmic thinking and crack coding rounds!

### 📈 Core DSA Topics
- **Linear**: Arrays, Strings, Linked Lists, Stacks, Queues.
- **Non-Linear**: Trees, Heaps, Hash Tables, Graphs.
- **Techniques**: Two Pointers, Sliding Window, Prefix Sum, BFS/DFS.
- **Advanced**: Dynamic Programming, Segment Trees, Trie, Union-Find.

### 📝 Daily Goal
Try to solve at least 1-2 LeetCode problems daily, analyzing the time and space complexity ($O(N)$, $O(\log N)$, etc.).

Share your optimized approaches, clean code snippets, and time-space analysis here! 🧠`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-nlp-1',
    'nlp',
    'NLP Scientist',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 11:45 AM',
    `💬 **Welcome to #nlp - Natural Language Processing**

Translating human language into formats computers can compute!

### 🌟 Core Concepts
- **Tokenization & Preprocessing**: Stop-words removal, lemmatization, subword tokenization (BPE, WordPiece).
- **Traditional NLP**: TF-IDF, Word2Vec, GloVe embeddings.
- **Modern NLP**: BERT (Bidirectional Encoder), GPT (Autoregressive Decoder), Sequence-to-Sequence models.
- **Tasks**: Sentiment analysis, Named Entity Recognition (NER), Machine Translation, Text Summarization.

Let's discuss tokenizers, embeddings, semantic search, and HuggingFace Transformers! 📝`,
    JSON.stringify([]),
    null
  );

  insertStmt.run(
    'seed-system-design-1',
    'system-design',
    'Principal Architect',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop',
    1,
    'Today, 12:00 PM',
    `🏗️ **Welcome to #system-design - High-Level Architecture**

How to design highly scalable, fault-tolerant, and reliable systems.

### ⚡ Architectural Pillars
- **Scaling**: Horizontal scaling vs. Vertical scaling, load balancers (Nginx, HAProxy).
- **Caching**: Reducing database load using Redis or Memcached at multiple layers.
- **Databases**: Relational (PostgreSQL) vs. NoSQL (MongoDB, Cassandra) based on CAP Theorem.
- **Asynchronous Workers**: Decoupling workflows using message queues (RabbitMQ, Kafka).
- **CDNs**: Delivering static content with low latency globally.

What architectural patterns are you currently using or learning? Let's sketch some diagrams and review system trade-offs! 🗺️`,
    JSON.stringify([]),
    null
  );
}

// API Routes
app.get("/api/profile", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM profiles WHERE id = 'default'");
    const profile = stmt.get() as any;
    if (profile) {
      res.json({
        success: true,
        profile: {
          ...profile,
          professional: JSON.parse(profile.professional || "{}"),
          experience: JSON.parse(profile.experience || "[]"),
          certifications: JSON.parse(profile.certifications || "[]"),
          education: JSON.parse(profile.education || "[]"),
          projects: JSON.parse(profile.projects || "[]")
        }
      });
    } else {
      res.status(404).json({ success: false, error: "Profile not found" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/profile", (req, res) => {
  try {
    const {
      fullName, username, bio, company, jobTitle, location, institution,
      website, github, linkedin, twitter, youtube, instagram, leetcode, medium, hashnode, peerlist,
      addressLine, city, state, pinCode, phone, tshirtSize, avatar,
      professional, experience, certifications, education, projects
    } = req.body;

    const stmt = db.prepare(`
      UPDATE profiles
      SET fullName = ?, username = ?, bio = ?, company = ?, jobTitle = ?, location = ?, institution = ?,
          website = ?, github = ?, linkedin = ?, twitter = ?, youtube = ?, instagram = ?, leetcode = ?, medium = ?, hashnode = ?, peerlist = ?,
          addressLine = ?, city = ?, state = ?, pinCode = ?, phone = ?, tshirtSize = ?, avatar = ?,
          professional = ?, experience = ?, certifications = ?, education = ?, projects = ?
      WHERE id = 'default'
    `);

    stmt.run(
      fullName || '',
      username || '',
      bio || '',
      company || '',
      jobTitle || '',
      location || '',
      institution || '',
      website || '',
      github || '',
      linkedin || '',
      twitter || '',
      youtube || '',
      instagram || '',
      leetcode || '',
      medium || '',
      hashnode || '',
      peerlist || '',
      addressLine || '',
      city || '',
      state || '',
      pinCode || '',
      phone || '',
      tshirtSize || 'L',
      avatar || '',
      JSON.stringify(professional || {}),
      JSON.stringify(experience || []),
      JSON.stringify(certifications || []),
      JSON.stringify(education || []),
      JSON.stringify(projects || [])
    );

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/messages", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM messages ORDER BY id ASC");
    const rows = stmt.all() as any[];
    
    // Parse JSON reactions
    const parsedRows = rows.map(row => ({
      ...row,
      isAdmin: row.isAdmin === 1,
      reactions: JSON.parse(row.reactions || "[]")
    }));

    res.json({ success: true, messages: parsedRows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/messages", (req, res) => {
  try {
    const { id, channel, sender, avatar, isAdmin, timestamp, content, parentId } = req.body;
    
    if (!channel || !sender || !content) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const insertStmt = db.prepare(`
      INSERT INTO messages (id, channel, sender, avatar, isAdmin, timestamp, content, reactions, parentId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const msgId = id || `msg-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const msgTimestamp = timestamp || 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop";

    insertStmt.run(
      msgId,
      channel,
      sender,
      avatar || defaultAvatar,
      isAdmin ? 1 : 0,
      msgTimestamp,
      content,
      JSON.stringify([]),
      parentId || null
    );

    // Fetch the newly created message to return
    const getStmt = db.prepare("SELECT * FROM messages WHERE id = ?");
    const newRow = getStmt.get(msgId) as any;
    
    if (!newRow) {
      return res.status(500).json({ success: false, error: "Message was not inserted correctly." });
    }

    res.json({ 
      success: true, 
      message: {
        ...newRow,
        isAdmin: newRow.isAdmin === 1,
        reactions: JSON.parse(newRow.reactions || "[]")
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// React to a message
app.post("/api/messages/:id/react", (req, res) => {
  try {
    const { id } = req.params;
    const { emoji, user } = req.body;

    if (!emoji || !user) {
      return res.status(400).json({ success: false, error: "Missing emoji or user" });
    }

    const getStmt = db.prepare("SELECT reactions FROM messages WHERE id = ?");
    const row = getStmt.get(id) as any;

    if (!row) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    let reactions = JSON.parse(row.reactions || "[]") as Array<{ emoji: string; users: string[] }>;
    
    const reactionIdx = reactions.findIndex(r => r.emoji === emoji);
    if (reactionIdx > -1) {
      const userIdx = reactions[reactionIdx].users.indexOf(user);
      if (userIdx > -1) {
        // User already reacted, so remove reaction
        reactions[reactionIdx].users.splice(userIdx, 1);
        // If no users left for this emoji, remove the emoji entry
        if (reactions[reactionIdx].users.length === 0) {
          reactions.splice(reactionIdx, 1);
        }
      } else {
        // User hasn't reacted yet, add them
        reactions[reactionIdx].users.push(user);
      }
    } else {
      // New emoji reaction
      reactions.push({ emoji, users: [user] });
    }

    const updateStmt = db.prepare("UPDATE messages SET reactions = ? WHERE id = ?");
    updateStmt.run(JSON.stringify(reactions), id);

    res.json({ success: true, reactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all DSA submissions
app.get("/api/dsa/submissions", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM dsa_submissions ORDER BY timestamp DESC");
    const rows = stmt.all() as any[];
    res.json({ success: true, submissions: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST a new DSA submission
app.post("/api/dsa/submissions", (req, res) => {
  try {
    const { problemId, problemTitle, difficulty, category, language, status } = req.body;
    if (!problemId || !problemTitle || !difficulty || !category || !language) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const id = `sub-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const insertStmt = db.prepare(`
      INSERT INTO dsa_submissions (id, problemId, problemTitle, difficulty, category, language, timestamp, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertStmt.run(id, problemId, problemTitle, difficulty, category, language, timestamp, status || "Accepted");
    
    const getStmt = db.prepare("SELECT * FROM dsa_submissions WHERE id = ?");
    const newSub = getStmt.get(id) as any;
    res.json({ success: true, submission: newSub });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all blogs
app.get("/api/blogs", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM blogs WHERE status = 'public' OR isUserBlog = 1 ORDER BY timestamp DESC");
    const rows = stmt.all() as any[];
    const parsedRows = rows.map(row => ({
      ...row,
      isUserBlog: row.isUserBlog === 1,
      likes: Number(row.likes || 0)
    }));
    res.json({ success: true, blogs: parsedRows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST a new blog
app.post("/api/blogs", (req, res) => {
  try {
    const { title, content, category, author, avatar, status } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const blogId = `blog-${Date.now()}`;
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const insertStmt = db.prepare(`
      INSERT INTO blogs (id, title, content, author, avatar, category, timestamp, likes, isUserBlog, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(
      blogId,
      title,
      content,
      author || "Dastgeer",
      avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop",
      category,
      timestamp,
      0,
      1, // Created by current user, so isUserBlog = 1
      status || "public"
    );
    
    const getStmt = db.prepare("SELECT * FROM blogs WHERE id = ?");
    const newBlog = getStmt.get(blogId) as any;
    res.json({
      success: true,
      blog: {
        ...newBlog,
        isUserBlog: newBlog.isUserBlog === 1,
        likes: Number(newBlog.likes || 0)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a blog
app.put("/api/blogs/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, status } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const checkStmt = db.prepare("SELECT isUserBlog FROM blogs WHERE id = ?");
    const existing = checkStmt.get(id) as any;
    if (!existing) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }
    if (existing.isUserBlog !== 1) {
      return res.status(403).json({ success: false, error: "You can only edit blogs created by you" });
    }
    const updateStmt = db.prepare(`
      UPDATE blogs
      SET title = ?, content = ?, category = ?, status = ?
      WHERE id = ?
    `);
    updateStmt.run(title, content, category, status || "public", id);
    
    const getStmt = db.prepare("SELECT * FROM blogs WHERE id = ?");
    const updated = getStmt.get(id) as any;
    res.json({
      success: true,
      blog: {
        ...updated,
        isUserBlog: updated.isUserBlog === 1,
        likes: Number(updated.likes || 0)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a blog
app.delete("/api/blogs/:id", (req, res) => {
  try {
    const { id } = req.params;
    const checkStmt = db.prepare("SELECT isUserBlog FROM blogs WHERE id = ?");
    const existing = checkStmt.get(id) as any;
    if (!existing) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }
    if (existing.isUserBlog !== 1) {
      return res.status(403).json({ success: false, error: "You can only delete blogs created by you" });
    }
    const deleteStmt = db.prepare("DELETE FROM blogs WHERE id = ?");
    deleteStmt.run(id);
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST like a blog
app.post("/api/blogs/:id/like", (req, res) => {
  try {
    const { id } = req.params;
    const getStmt = db.prepare("SELECT likes FROM blogs WHERE id = ?");
    const row = getStmt.get(id) as any;
    if (!row) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }
    const newLikes = (row.likes || 0) + 1;
    const updateStmt = db.prepare("UPDATE blogs SET likes = ? WHERE id = ?");
    updateStmt.run(newLikes, id);
    res.json({ success: true, likes: newLikes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all projects
app.get("/api/projects", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM user_projects WHERE status = 'public' OR isUserProject = 1 ORDER BY id DESC");
    const rows = stmt.all() as any[];
    const parsedRows = rows.map(row => ({
      ...row,
      isUserProject: row.isUserProject === 1
    }));
    res.json({ success: true, projects: parsedRows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST a new project
app.post("/api/projects", (req, res) => {
  try {
    const { title, description, codeLink, deployLink, startDate, endDate, status } = req.body;
    if (!title || !description || !codeLink || !startDate || !status) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const projectId = `project-${Date.now()}`;
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const insertStmt = db.prepare(`
      INSERT INTO user_projects (id, title, description, codeLink, deployLink, startDate, endDate, status, author, avatar, timestamp, isUserProject)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    
    insertStmt.run(
      projectId,
      title,
      description,
      codeLink,
      deployLink || "",
      startDate,
      endDate || "",
      status,
      "Dastgeer", // Default author
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop", // Default avatar
      timestamp
    );
    
    const getStmt = db.prepare("SELECT * FROM user_projects WHERE id = ?");
    const newProject = getStmt.get(projectId) as any;
    res.json({
      success: true,
      project: {
        ...newProject,
        isUserProject: newProject.isUserProject === 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a project
app.put("/api/projects/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, codeLink, deployLink, startDate, endDate, status } = req.body;
    if (!title || !description || !codeLink || !startDate || !status) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const checkStmt = db.prepare("SELECT isUserProject FROM user_projects WHERE id = ?");
    const existing = checkStmt.get(id) as any;
    if (!existing) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    if (existing.isUserProject !== 1) {
      return res.status(403).json({ success: false, error: "You can only edit projects created by you" });
    }
    const updateStmt = db.prepare(`
      UPDATE user_projects
      SET title = ?, description = ?, codeLink = ?, deployLink = ?, startDate = ?, endDate = ?, status = ?
      WHERE id = ?
    `);
    updateStmt.run(title, description, codeLink, deployLink || "", startDate, endDate || "", status, id);
    
    const getStmt = db.prepare("SELECT * FROM user_projects WHERE id = ?");
    const updated = getStmt.get(id) as any;
    res.json({
      success: true,
      project: {
        ...updated,
        isUserProject: updated.isUserProject === 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a project
app.delete("/api/projects/:id", (req, res) => {
  try {
    const { id } = req.params;
    const checkStmt = db.prepare("SELECT isUserProject FROM user_projects WHERE id = ?");
    const existing = checkStmt.get(id) as any;
    if (!existing) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    if (existing.isUserProject !== 1) {
      return res.status(403).json({ success: false, error: "You can only delete projects created by you" });
    }
    const deleteStmt = db.prepare("DELETE FROM user_projects WHERE id = ?");
    deleteStmt.run(id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all hackathons
app.get("/api/hackathons", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM hackathons WHERE status = 'public' OR isUserHackathon = 1 ORDER BY timestamp DESC, id DESC");
    const rows = stmt.all() as any[];
    const parsedRows = rows.map(row => ({
      ...row,
      isUserHackathon: row.isUserHackathon === 1
    }));
    res.json({ success: true, hackathons: parsedRows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST a new hackathon
app.post("/api/hackathons", (req, res) => {
  try {
    const { title, description, tags, prizes, deadline, author, avatar, status } = req.body;
    if (!title || !description || !tags || !prizes || !deadline) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const hackathonId = `hackathon-${Date.now()}`;
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const insertStmt = db.prepare(`
      INSERT INTO hackathons (id, title, description, tags, prizes, deadline, author, avatar, timestamp, isUserHackathon, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertStmt.run(
      hackathonId,
      title,
      description,
      tags,
      prizes,
      deadline,
      author || "Dastgeer",
      avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop",
      timestamp,
      1, // User hackathon
      status || "public"
    );

    const getStmt = db.prepare("SELECT * FROM hackathons WHERE id = ?");
    const newHack = getStmt.get(hackathonId) as any;
    res.json({
      success: true,
      hackathon: {
        ...newHack,
        isUserHackathon: newHack.isUserHackathon === 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a hackathon
app.put("/api/hackathons/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, prizes, deadline, status } = req.body;
    if (!title || !description || !tags || !prizes || !deadline) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    
    const checkStmt = db.prepare("SELECT isUserHackathon FROM hackathons WHERE id = ?");
    const existing = checkStmt.get(id) as any;
    
    if (!existing) {
      return res.status(404).json({ success: false, error: "Hackathon not found" });
    }
    
    if (existing.isUserHackathon !== 1) {
      return res.status(403).json({ success: false, error: "You can only edit hackathons created by you" });
    }

    const updateStmt = db.prepare(`
      UPDATE hackathons
      SET title = ?, description = ?, tags = ?, prizes = ?, deadline = ?, status = ?
      WHERE id = ?
    `);
    
    updateStmt.run(title, description, tags, prizes, deadline, status || "public", id);
    
    const getStmt = db.prepare("SELECT * FROM hackathons WHERE id = ?");
    const updated = getStmt.get(id) as any;
    res.json({
      success: true,
      hackathon: {
        ...updated,
        isUserHackathon: updated.isUserHackathon === 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a hackathon
app.delete("/api/hackathons/:id", (req, res) => {
  try {
    const { id } = req.params;
    
    const checkStmt = db.prepare("SELECT isUserHackathon FROM hackathons WHERE id = ?");
    const existing = checkStmt.get(id) as any;
    
    if (!existing) {
      return res.status(404).json({ success: false, error: "Hackathon not found" });
    }
    
    if (existing.isUserHackathon !== 1) {
      return res.status(403).json({ success: false, error: "You can only delete hackathons created by you" });
    }

    const deleteStmt = db.prepare("DELETE FROM hackathons WHERE id = ?");
    deleteStmt.run(id);
    
    res.json({ success: true, message: "Hackathon deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all events
app.get("/api/events", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM events WHERE status = 'public' OR isUserEvent = 1 ORDER BY date ASC, time ASC, id DESC");
    const rows = stmt.all() as any[];
    const parsedRows = rows.map(row => ({
      ...row,
      isUserEvent: row.isUserEvent === 1
    }));
    res.json({ success: true, events: parsedRows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST a new event
app.post("/api/events", (req, res) => {
  try {
    const { title, description, date, time, location, category, author, avatar, status } = req.body;
    if (!title || !description || !date || !time || !location || !category) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const eventId = `event-${Date.now()}`;
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const insertStmt = db.prepare(`
      INSERT INTO events (id, title, description, date, time, location, category, author, avatar, timestamp, isUserEvent, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      eventId,
      title,
      description,
      date,
      time,
      location,
      category,
      author || "Dastgeer",
      avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop",
      timestamp,
      1, // User Event
      status || "public"
    );

    const getStmt = db.prepare("SELECT * FROM events WHERE id = ?");
    const newEv = getStmt.get(eventId) as any;
    res.json({
      success: true,
      event: {
        ...newEv,
        isUserEvent: newEv.isUserEvent === 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update an event
app.put("/api/events/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, category, status } = req.body;
    if (!title || !description || !date || !time || !location || !category) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const checkStmt = db.prepare("SELECT isUserEvent FROM events WHERE id = ?");
    const existing = checkStmt.get(id) as any;

    if (!existing) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    if (existing.isUserEvent !== 1) {
      return res.status(403).json({ success: false, error: "You can only edit events created by you" });
    }

    const updateStmt = db.prepare(`
      UPDATE events
      SET title = ?, description = ?, date = ?, time = ?, location = ?, category = ?, status = ?
      WHERE id = ?
    `);

    updateStmt.run(title, description, date, time, location, category, status || "public", id);

    const getStmt = db.prepare("SELECT * FROM events WHERE id = ?");
    const updated = getStmt.get(id) as any;
    res.json({
      success: true,
      event: {
        ...updated,
        isUserEvent: updated.isUserEvent === 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE an event
app.delete("/api/events/:id", (req, res) => {
  try {
    const { id } = req.params;

    const checkStmt = db.prepare("SELECT isUserEvent FROM events WHERE id = ?");
    const existing = checkStmt.get(id) as any;

    if (!existing) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    if (existing.isUserEvent !== 1) {
      return res.status(403).json({ success: false, error: "You can only delete events created by you" });
    }

    const deleteStmt = db.prepare("DELETE FROM events WHERE id = ?");
    deleteStmt.run(id);

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Card Comments & Reactions API ---

// GET interactions (comments and reactions) for a card
app.get("/api/interactions/:item_type/:item_id", (req, res) => {
  try {
    const { item_type, item_id } = req.params;

    // Get comments
    const commentsStmt = db.prepare("SELECT * FROM card_comments WHERE item_type = ? AND item_id = ? ORDER BY timestamp ASC");
    const comments = commentsStmt.all(item_type, item_id) || [];

    // Get reactions
    const reactionsStmt = db.prepare("SELECT * FROM card_reactions WHERE item_type = ? AND item_id = ?");
    const reactionsRaw = reactionsStmt.all(item_type, item_id) || [];
    
    const reactions = reactionsRaw.map((r: any) => ({
      emoji: r.emoji,
      users: JSON.parse(r.users || "[]")
    }));

    res.json({ success: true, comments, reactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST comment to a card
app.post("/api/interactions/:item_type/:item_id/comment", (req, res) => {
  try {
    const { item_type, item_id } = req.params;
    const { author, avatar, content } = req.body;

    if (!author || !content) {
      return res.status(400).json({ success: false, error: "Author and content are required." });
    }

    const commentId = `comment-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const timestamp = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO card_comments (id, item_type, item_id, author, avatar, content, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(commentId, item_type, item_id, author, avatar || "", content, timestamp);

    const getStmt = db.prepare("SELECT * FROM card_comments WHERE id = ?");
    const newComment = getStmt.get(commentId);

    res.json({ success: true, comment: newComment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST reaction to a card (toggle)
app.post("/api/interactions/:item_type/:item_id/react", (req, res) => {
  try {
    const { item_type, item_id } = req.params;
    const { emoji, user } = req.body;

    if (!emoji || !user) {
      return res.status(400).json({ success: false, error: "Emoji and user are required." });
    }

    // Check if entry already exists
    const getStmt = db.prepare("SELECT users FROM card_reactions WHERE item_type = ? AND item_id = ? AND emoji = ?");
    const row = getStmt.get(item_type, item_id, emoji) as any;

    let usersList: string[] = [];
    if (row) {
      usersList = JSON.parse(row.users || "[]");
    }

    const userIdx = usersList.indexOf(user);
    if (userIdx > -1) {
      // Remove reaction
      usersList.splice(userIdx, 1);
    } else {
      // Add reaction
      usersList.push(user);
    }

    if (usersList.length === 0) {
      // Delete record if no users left
      const deleteStmt = db.prepare("DELETE FROM card_reactions WHERE item_type = ? AND item_id = ? AND emoji = ?");
      deleteStmt.run(item_type, item_id, emoji);
    } else {
      if (row) {
        const updateStmt = db.prepare("UPDATE card_reactions SET users = ? WHERE item_type = ? AND item_id = ? AND emoji = ?");
        updateStmt.run(JSON.stringify(usersList), item_type, item_id, emoji);
      } else {
        const insertStmt = db.prepare("INSERT INTO card_reactions (item_type, item_id, emoji, users) VALUES (?, ?, ?, ?)");
        insertStmt.run(item_type, item_id, emoji, JSON.stringify(usersList));
      }
    }

    // Return the updated list of reactions for this card
    const allReactionsStmt = db.prepare("SELECT * FROM card_reactions WHERE item_type = ? AND item_id = ?");
    const reactionsRaw = allReactionsStmt.all(item_type, item_id) || [];
    const reactions = reactionsRaw.map((r: any) => ({
      emoji: r.emoji,
      users: JSON.parse(r.users || "[]")
    }));

    res.json({ success: true, reactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start dev server with Vite middleware or production mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
