export interface DsaProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved: boolean;
  category: string;
  description: string;
  solutionTemplate: string;
  testCases: { input: string; expected: string }[];
}

export interface DsaSheet {
  id: string;
  name: string;
  solvedCount: number;
  totalCount: number;
  problems: DsaProblem[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  text: string;
  isMe?: boolean;
}

export interface VoiceParticipant {
  id: string;
  name: string;
  avatar: string;
  role: 'host' | 'speaker' | 'listener';
  isSpeaking: boolean;
  hasHandRaised?: boolean;
}

export interface Cohort {
  id: string;
  name: string;
  channels: {
    text: string[];
    voice: { name: string; activeCount: number }[];
  };
  messages: ChatMessage[];
  participants: VoiceParticipant[];
}

export interface HackathonProject {
  name: string;
  repo: string;
  deployedUrl: string;
  track: string;
}

export interface EvaluationState {
  marks: number;
  writingRating: number;
  codeQuality: number;
  feedback: string;
  isSubmitted: boolean;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  category: string;
  timestamp: string;
  likes: number;
  isUserBlog: boolean;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  tags: string;
  prizes: string;
  deadline: string;
  author: string;
  avatar: string;
  timestamp: string;
  isUserHackathon: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  author: string;
  avatar: string;
  timestamp: string;
  isUserEvent: boolean;
}
