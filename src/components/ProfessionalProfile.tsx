import React, { useState, useEffect } from 'react';
import { 
  User, Briefcase, Award, GraduationCap, Code, FolderGit, 
  Globe, Github, Linkedin, Twitter, Youtube, Instagram, BookOpen, FileText,
  MapPin, Trash2, Plus, Save, Sparkles, AlertCircle, CheckCircle2, ChevronRight, X, Camera,
  Trophy, Lock, Unlock, Flame, Target
} from 'lucide-react';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface CertificationItem {
  id: string;
  name: string;
  organization: string;
  date: string;
  credentialId: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  gpa: string;
}

interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  link: string;
  description: string;
}

interface ProfessionalData {
  skills: string[];
  yearsOfExperience: string;
  targetRole: string;
  workMode: string;
  ctc: string;
}

export default function ProfessionalProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Personal' | 'Professional' | 'Experience' | 'Certifications' | 'Education' | 'Projects'>('Personal');

  // Personal Fields
  const [fullName, setFullName] = useState('Dastgeer');
  const [username, setUsername] = useState('dastgeerjutt8888_d2a00f46');
  const [bio, setBio] = useState('Learning AI/ML, Deep Learning, NLP, Computer Vision & Generative AI | Python Enthusiast |');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [institution, setInstitution] = useState('');

  // Social Links
  const [website, setWebsite] = useState('https://example.com');
  const [github, setGithub] = useState('https://github.com/username');
  const [linkedin, setLinkedin] = useState('https://www.linkedin.com/in/muhammad-dastgeer/');
  const [twitter, setTwitter] = useState('https://twitter.com/username');
  const [youtube, setYoutube] = useState('https://youtube.com/channel/username');
  const [instagram, setInstagram] = useState('https://instagram.com/username');
  const [leetcode, setLeetcode] = useState('https://leetcode.com/username');
  const [medium, setMedium] = useState('https://medium.com/@username');
  const [hashnode, setHashnode] = useState('https://username.hashnode.dev');
  const [peerlist, setPeerlist] = useState('https://peerlist.io/username');

  // Shipping details
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('');
  const [tshirtSize, setTshirtSize] = useState('L');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop');

  // Lists and Advanced States
  const [professional, setProfessional] = useState<ProfessionalData>({
    skills: ['ML', 'DL', 'CV', 'Agentic AI', 'Gen AI', 'Python', 'DSA'],
    yearsOfExperience: '1',
    targetRole: 'Machine Learning Engineer',
    workMode: 'Remote',
    ctc: ''
  });
  const [newSkill, setNewSkill] = useState('');

  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [achievementsSubTab, setAchievementsSubTab] = useState<'Unlocked' | 'Locked'>('Unlocked');

  // Fetch Profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success && data.profile) {
        const p = data.profile;
        setFullName(p.fullName || '');
        setUsername(p.username || '');
        setBio(p.bio || '');
        setCompany(p.company || '');
        setJobTitle(p.jobTitle || '');
        setLocation(p.location || '');
        setInstitution(p.institution || '');
        setWebsite(p.website || '');
        setGithub(p.github || '');
        setLinkedin(p.linkedin || '');
        setTwitter(p.twitter || '');
        setYoutube(p.youtube || '');
        setInstagram(p.instagram || '');
        setLeetcode(p.leetcode || '');
        setMedium(p.medium || '');
        setHashnode(p.hashnode || '');
        setPeerlist(p.peerlist || '');
        setAddressLine(p.addressLine || '');
        setCity(p.city || '');
        setState(p.state || '');
        setPinCode(p.pinCode || '');
        setPhone(p.phone || '');
        setTshirtSize(p.tshirtSize || 'L');
        if (p.avatar) setAvatar(p.avatar);
        
        if (p.professional && typeof p.professional === 'object') {
          setProfessional({
            skills: p.professional.skills || [],
            yearsOfExperience: p.professional.yearsOfExperience || '0',
            targetRole: p.professional.targetRole || '',
            workMode: p.professional.workMode || 'Remote',
            ctc: p.professional.ctc || ''
          });
        }
        if (Array.isArray(p.experience)) setExperience(p.experience);
        if (Array.isArray(p.certifications)) setCertifications(p.certifications);
        if (Array.isArray(p.education)) setEducation(p.education);
        if (Array.isArray(p.projects)) setProjects(p.projects);
      }
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setErrorMsg("Failed to load profile from database. Using local state.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, username, bio, company, jobTitle, location, institution,
          website, github, linkedin, twitter, youtube, instagram, leetcode, medium, hashnode, peerlist,
          addressLine, city, state, pinCode, phone, tshirtSize, avatar,
          professional, experience, certifications, education, projects
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setSuccessMsg("Professional Profile saved successfully to database!");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg("Error: " + (resData.error || "Could not save profile."));
      }
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setErrorMsg("Failed to reach server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Avatar changer helper
  const handleRandomizeAvatar = () => {
    const ids = [1507003211169, 1539571696357, 1500648767791, 1519345182560, 1620712943543, 1506794778202];
    const randId = ids[Math.floor(Math.random() * ids.length)];
    setAvatar(`https://images.unsplash.com/photo-${randId}?q=80&w=128&auto=format&fit=crop`);
  };

  // Helper lists CRUD
  const handleAddSkill = () => {
    if (newSkill.trim() && !professional.skills.includes(newSkill.trim())) {
      setProfessional(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfessional(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Experience List CRUD
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expDesc, setExpDesc] = useState('');

  const handleAddExperience = () => {
    if (!expTitle || !expCompany) return;
    const item: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: expTitle,
      company: expCompany,
      duration: expDuration || 'Present',
      description: expDesc
    };
    setExperience(prev => [...prev, item]);
    setExpTitle('');
    setExpCompany('');
    setExpDuration('');
    setExpDesc('');
  };

  const handleRemoveExperience = (id: string) => {
    setExperience(prev => prev.filter(item => item.id !== id));
  };

  // Certifications List CRUD
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certId, setCertId] = useState('');

  const handleAddCertification = () => {
    if (!certName || !certOrg) return;
    const item: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: certName,
      organization: certOrg,
      date: certDate,
      credentialId: certId
    };
    setCertifications(prev => [...prev, item]);
    setCertName('');
    setCertOrg('');
    setCertDate('');
    setCertId('');
  };

  const handleRemoveCertification = (id: string) => {
    setCertifications(prev => prev.filter(item => item.id !== id));
  };

  // Education List CRUD
  const [eduDegree, setEduDegree] = useState('');
  const [eduInst, setEduInst] = useState('');
  const [eduYear, setEduYear] = useState('');
  const [eduGpa, setEduGpa] = useState('');

  const handleAddEducation = () => {
    if (!eduDegree || !eduInst) return;
    const item: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: eduDegree,
      institution: eduInst,
      year: eduYear,
      gpa: eduGpa
    };
    setEducation(prev => [...prev, item]);
    setEduDegree('');
    setEduInst('');
    setEduYear('');
    setEduGpa('');
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(prev => prev.filter(item => item.id !== id));
  };

  // Projects List CRUD
  const [projTitle, setProjTitle] = useState('');
  const [projStack, setProjStack] = useState('');
  const [projLink, setProjLink] = useState('');
  const [projDesc, setProjDesc] = useState('');

  const handleAddProject = () => {
    if (!projTitle) return;
    const item: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: projTitle,
      techStack: projStack,
      link: projLink,
      description: projDesc
    };
    setProjects(prev => [...prev, item]);
    setProjTitle('');
    setProjStack('');
    setProjLink('');
    setProjDesc('');
  };

  const handleRemoveProject = (id: string) => {
    setProjects(prev => prev.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-500 dark:text-stone-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b2b] mb-4"></div>
        <p className="font-mono text-sm">Loading Professional Profile...</p>
      </div>
    );
  }

  const tabs: Array<'Personal' | 'Professional' | 'Experience' | 'Certifications' | 'Education' | 'Projects'> = [
    'Personal', 'Professional', 'Experience', 'Certifications', 'Education', 'Projects'
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 font-sans">
      
      {/* Alert Notices */}
      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-400 rounded-2xl p-4 flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-sm font-semibold">{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-800 dark:text-rose-400 rounded-2xl p-4 flex items-center gap-3 animate-fade-in shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div className="text-sm font-semibold">{errorMsg}</div>
        </div>
      )}

      {/* Top Professional Header Info Card */}
      <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        
        {/* Subtle orange accent gradient blur */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#ff6b2b]/10 blur-3xl rounded-full -z-10" />

        {/* Avatar container with dynamic name-based avatar icon */}
        <div className="relative group flex-shrink-0 select-none">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#ffefe7] to-[#ffe0d0] dark:from-orange-950/40 dark:to-orange-900/10 border-4 border-[#fff1e6] dark:border-stone-800 shadow-md flex flex-col items-center justify-center font-black text-5xl text-[#ff6b2b] dark:text-[#ff804a] transition-transform duration-300 group-hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#ff6b2b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span>{fullName ? fullName.trim().charAt(0).toUpperCase() : 'D'}</span>
            <span className="text-[9px] font-bold tracking-wider text-[#ff6b2b]/60 dark:text-[#ff804a]/60 uppercase mt-1">MEMBER</span>
          </div>
        </div>

        {/* Identity Details */}
        <div className="flex-1 text-center md:text-left space-y-2.5 min-w-0">
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
              {fullName || 'Your Name'}
            </h2>
            <p className="text-sm font-semibold text-stone-400 dark:text-stone-500 font-mono mt-0.5">
              @{username || 'username'}
            </p>
          </div>

          <p className="text-sm text-stone-600 dark:text-stone-300 font-medium leading-relaxed max-w-2xl break-words">
            {bio || 'Enter your bio below to describe your learning path or field of expertise.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1.5">
            {linkedin && (
              <a 
                href={linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff1e6] hover:bg-[#ffe2cc] dark:bg-stone-800 dark:hover:bg-stone-700 text-[#ff6b2b] text-xs font-bold transition-all"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {github && (
              <a 
                href={github} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {website && (
              <a 
                href={website} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Tabs List matching style of screenshot exactly */}
      <div className="border-b border-[#e7e5e4] dark:border-stone-800 flex overflow-x-auto scrollbar-none gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-semibold text-sm transition-all whitespace-nowrap border-b-2 -mb-px focus:outline-none cursor-pointer ${
                isActive 
                  ? 'border-[#ff6b2b] text-[#ff6b2b] dark:text-[#ff804a]' 
                  : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Tabbed Form Body */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ==================== TAB 1: PERSONAL ==================== */}
        {activeTab === 'Personal' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Bio
                  </label>
                  <input 
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your learning goals"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Company
                  </label>
                  <input 
                    type="text" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter your company"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Job Title
                  </label>
                  <input 
                    type="text" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter your job title"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Location
                  </label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country (e.g., Lahore, Pakistan)"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Institution */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Institution
                  </label>
                  <input 
                    type="text" 
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Enter your college/university"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

              </div>

              {/* Social and Professional Links Header */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800/50">
                <h3 className="text-base font-black text-stone-800 dark:text-white tracking-tight">
                  Social & Professional Links
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Website */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Website</label>
                  <input 
                    type="text" 
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* GitHub */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">GitHub</label>
                  <input 
                    type="text" 
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">LinkedIn</label>
                  <input 
                    type="text" 
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Twitter / X */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Twitter / X</label>
                  <input 
                    type="text" 
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">YouTube</label>
                  <input 
                    type="text" 
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/channel/username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Instagram</label>
                  <input 
                    type="text" 
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* LeetCode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">LeetCode</label>
                  <input 
                    type="text" 
                    value={leetcode}
                    onChange={(e) => setLeetcode(e.target.value)}
                    placeholder="https://leetcode.com/username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Medium */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Medium</label>
                  <input 
                    type="text" 
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    placeholder="https://medium.com/@username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Hashnode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Hashnode</label>
                  <input 
                    type="text" 
                    value={hashnode}
                    onChange={(e) => setHashnode(e.target.value)}
                    placeholder="https://username.hashnode.dev"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Peerlist */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Peerlist</label>
                  <input 
                    type="text" 
                    value={peerlist}
                    onChange={(e) => setPeerlist(e.target.value)}
                    placeholder="https://peerlist.io/username"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

              </div>

              {/* Shipping Details Header */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800/50 space-y-4">
                <h3 className="text-base font-black text-stone-800 dark:text-white tracking-tight">
                  Shipping Details
                </h3>

                {/* We only ship in India notice - Yellow alert box */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 text-amber-900 dark:text-amber-400 p-4 rounded-r-2xl flex items-center gap-3 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>We only ship in India for now.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Address Line */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Address Line</label>
                  <input 
                    type="text" 
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Enter your address"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">City</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">State</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter your state"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Pin Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pin Code</label>
                  <input 
                    type="text" 
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Enter your pin code"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Phone</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
                  />
                </div>

                {/* T-Shirt Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">T-Shirt Size</label>
                  <select 
                    value={tshirtSize}
                    onChange={(e) => setTshirtSize(e.target.value)}
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b] cursor-pointer"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

              </div>

              {/* Account Controls Section */}
              <div className="pt-6 border-t border-stone-100 dark:border-stone-800/50 space-y-4">
                <div>
                  <h3 className="text-base font-black text-rose-600 dark:text-rose-500 tracking-tight">
                    Account Controls
                  </h3>
                  <p className="text-xs font-semibold text-stone-400 mt-1 leading-relaxed">
                    You can request account deletion at any time. We will immediately disable access and your learning history will be anonymized. Contact support if you need manual assistance.
                  </p>
                </div>

                <button 
                  type="button"
                  onClick={() => alert("To delete your account, please email support@leetmaster.co with your username details.")}
                  className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-900/20 text-xs font-black px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-850 transition-all cursor-pointer"
                >
                  Delete my account
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB 2: PROFESSIONAL ==================== */}
        {activeTab === 'Professional' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-black text-stone-900 dark:text-white">Professional Interests & Skills</h3>

              <div className="space-y-4">
                {/* Skills tags list */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Expertise & Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {professional.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center gap-1 bg-[#fff1e6] dark:bg-[#3d2417] text-[#ff6b2b] dark:text-[#ff804a] text-xs font-bold px-3 py-1.5 rounded-full"
                      >
                        <span>{skill}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-orange-200 dark:hover:bg-stone-800 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {professional.skills.length === 0 && (
                      <p className="text-xs font-semibold text-stone-400 italic">No skills added yet.</p>
                    )}
                  </div>
                </div>

                {/* Add new skill */}
                <div className="flex gap-2 max-w-md">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. PyTorch, Kubernetes"
                    className="flex-grow bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-stone-900 dark:text-white focus:outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  />
                  <button 
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-black hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white font-bold text-xs px-4 rounded-xl transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                
                {/* Years of experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Years of Experience</label>
                  <input 
                    type="number" 
                    min="0"
                    value={professional.yearsOfExperience}
                    onChange={(e) => setProfessional(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Target Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Target / Goal Role</label>
                  <input 
                    type="text" 
                    value={professional.targetRole}
                    onChange={(e) => setProfessional(prev => ({ ...prev, targetRole: e.target.value }))}
                    placeholder="e.g. Senior ML Architect"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Work Mode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Preferred Work Mode</label>
                  <select 
                    value={professional.workMode}
                    onChange={(e) => setProfessional(prev => ({ ...prev, workMode: e.target.value }))}
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white cursor-pointer"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite / Office</option>
                  </select>
                </div>

                {/* Expected CTC */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Expected Annual Compensation (CTC)</label>
                  <input 
                    type="text" 
                    value={professional.ctc}
                    onChange={(e) => setProfessional(prev => ({ ...prev, ctc: e.target.value }))}
                    placeholder="e.g. $120,000 / yr"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: EXPERIENCE ==================== */}
        {activeTab === 'Experience' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Added list */}
            {experience.length > 0 && (
              <div className="space-y-4">
                {experience.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-2xl p-5 flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-stone-900 dark:text-white">{item.title}</h4>
                        <span className="text-xs text-stone-400 font-mono">@ {item.company}</span>
                      </div>
                      <p className="text-xs text-[#ff6b2b] font-bold font-mono">{item.duration}</p>
                      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">{item.description}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExperience(item.id)}
                      className="p-2 bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-stone-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Experience addition Form */}
            <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-black text-stone-900 dark:text-white">Add Professional Experience</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Job Title</label>
                  <input 
                    type="text" 
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder="e.g. ML Researcher"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Company / Org</label>
                  <input 
                    type="text" 
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="e.g. Google Research"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Duration (Start - End Dates)</label>
                  <input 
                    type="text" 
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    placeholder="e.g. Jan 2024 - Present"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Description / Primary Impact</label>
                  <textarea 
                    rows={3}
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    placeholder="Describe core tools used, neural nets trained, model sizes, etc."
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

              </div>

              <button 
                type="button" 
                onClick={handleAddExperience}
                className="inline-flex items-center gap-2 bg-[#fff1e6] hover:bg-[#ffe2cc] text-[#ff6b2b] text-xs font-black px-4 py-3 rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience Entry</span>
              </button>
            </div>

          </div>
        )}

        {/* ==================== TAB 4: CERTIFICATIONS ==================== */}
        {activeTab === 'Certifications' && (
          <div className="space-y-6 animate-fade-in">
            
            {certifications.length > 0 && (
              <div className="space-y-4">
                {certifications.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-2xl p-5 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-stone-900 dark:text-white">{item.name}</h4>
                        <span className="text-xs bg-orange-50 dark:bg-[#3d2417] text-[#ff6b2b] px-2.5 py-1 rounded-full font-mono font-bold text-[10px]">
                          {item.organization}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 font-mono mt-1">Issued: {item.date}</p>
                      {item.credentialId && (
                        <p className="text-xs text-stone-500 font-mono font-bold">Credential ID: {item.credentialId}</p>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCertification(item.id)}
                      className="p-2 bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-stone-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-black text-stone-900 dark:text-white">Add Professional Certifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Certification Name</label>
                  <input 
                    type="text" 
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="e.g. Deep Learning Specialization"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Issuing Organization</label>
                  <input 
                    type="text" 
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                    placeholder="e.g. Coursera / DeepLearning.AI"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Issue Date</label>
                  <input 
                    type="text" 
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    placeholder="e.g. March 2024"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Credential ID / Link</label>
                  <input 
                    type="text" 
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="e.g. DL-COURSERA-881"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

              </div>

              <button 
                type="button" 
                onClick={handleAddCertification}
                className="inline-flex items-center gap-2 bg-[#fff1e6] hover:bg-[#ffe2cc] text-[#ff6b2b] text-xs font-black px-4 py-3 rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certification</span>
              </button>
            </div>

          </div>
        )}

        {/* ==================== TAB 5: EDUCATION ==================== */}
        {activeTab === 'Education' && (
          <div className="space-y-6 animate-fade-in">
            
            {education.length > 0 && (
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-2xl p-5 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-stone-900 dark:text-white">{item.degree}</h4>
                        <span className="text-xs text-stone-400 font-mono">@ {item.institution}</span>
                      </div>
                      <p className="text-xs text-[#ff6b2b] font-bold font-mono">Class of {item.year}</p>
                      {item.gpa && (
                        <p className="text-xs text-stone-500 font-mono font-bold">GPA / Percentage: {item.gpa}</p>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveEducation(item.id)}
                      className="p-2 bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-stone-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-black text-stone-900 dark:text-white">Add Education History</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Degree / Field of Study</label>
                  <input 
                    type="text" 
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    placeholder="e.g. BS Computer Science"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Institution Name</label>
                  <input 
                    type="text" 
                    value={eduInst}
                    onChange={(e) => setEduInst(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Graduation Year</label>
                  <input 
                    type="text" 
                    value={eduYear}
                    onChange={(e) => setEduYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">GPA / Score (Optional)</label>
                  <input 
                    type="text" 
                    value={eduGpa}
                    onChange={(e) => setEduGpa(e.target.value)}
                    placeholder="e.g. 3.92 / 4.0"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

              </div>

              <button 
                type="button" 
                onClick={handleAddEducation}
                className="inline-flex items-center gap-2 bg-[#fff1e6] hover:bg-[#ffe2cc] text-[#ff6b2b] text-xs font-black px-4 py-3 rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education Entry</span>
              </button>
            </div>

          </div>
        )}

        {/* ==================== TAB 6: PROJECTS ==================== */}
        {activeTab === 'Projects' && (
          <div className="space-y-6 animate-fade-in">
            
            {projects.length > 0 && (
              <div className="space-y-4">
                {projects.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-2xl p-5 flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-stone-900 dark:text-white">{item.title}</h4>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-[#ff6b2b] hover:underline font-bold">
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 font-mono">Tech Stack: {item.techStack}</p>
                      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">{item.description}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveProject(item.id)}
                      className="p-2 bg-stone-50 dark:bg-[#1c1917] hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-stone-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-black text-stone-900 dark:text-white">Add Professional Projects</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Project Title</label>
                  <input 
                    type="text" 
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g. Dynamic Text Summarizer with Gemini"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Tech Stack Used</label>
                  <input 
                    type="text" 
                    value={projStack}
                    onChange={(e) => setProjStack(e.target.value)}
                    placeholder="e.g. React, Express, SQLite, GoogleGenAI"
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Project URL / GitHub Link</label>
                  <input 
                    type="text" 
                    value={projLink}
                    onChange={(e) => setProjLink(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Detailed Description</label>
                  <textarea 
                    rows={3}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Explain what problem this project solved and your core contributions..."
                    className="w-full bg-[#faf9f6] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

              </div>

              <button 
                type="button" 
                onClick={handleAddProject}
                className="inline-flex items-center gap-2 bg-[#fff1e6] hover:bg-[#ffe2cc] text-[#ff6b2b] text-xs font-black px-4 py-3 rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

          </div>
        )}


        {/* Global Save and Next Actions */}
        <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-4">
          
          <button
            type="button"
            onClick={() => {
              const curIdx = tabs.indexOf(activeTab);
              const nextIdx = (curIdx + 1) % tabs.length;
              setActiveTab(tabs[nextIdx]);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-bold px-6 py-3.5 rounded-full transition-all cursor-pointer"
          >
            <span>Next Tab</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#ff6b2b] hover:bg-[#e05316] text-white text-sm font-extrabold px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Submit Profile'}</span>
          </button>

        </div>

      </form>
    </div>
  );
}
