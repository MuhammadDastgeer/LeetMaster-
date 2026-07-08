import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite Database
const db = new Database("leetmaster.db");

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

    const msgId = id || `msg-${Date.now()}`;
    const msgTimestamp = timestamp || 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    insertStmt.run(
      msgId,
      channel,
      sender,
      avatar,
      isAdmin ? 1 : 0,
      msgTimestamp,
      content,
      JSON.stringify([]),
      parentId || null
    );

    // Fetch the newly created message to return
    const getStmt = db.prepare("SELECT * FROM messages WHERE id = ?");
    const newRow = getStmt.get(msgId) as any;
    
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
