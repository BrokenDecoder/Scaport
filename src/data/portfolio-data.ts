export interface Project {
  id: string;
  title: string;
  category: "Desktop & Systems" | "AI & Neurotech" | "Open Source" | "Hardware";
  description: string;
  tags: string[];
  stars?: number;
  githubUrl?: string;
  metrics: string[];
  featured: boolean;
}

export interface Experience {
  role: string;
  organization: string;
  period: string;
  location?: string;
  type: string;
  points: string[];
  badges: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  category: "Space & Science" | "AI & ML" | "Neurotech" | "Hardware & Embedded";
}

export const HIMANSHU_DATA = {
  name: "Himanshu Kushwaha",
  location: "Jaipur, Rajasthan, India",
  email: "kkhk452@gmail.com",
  phone: "+91 88785 75779",
  github: "https://github.com/BrokenDecoder",
  linkedin: "https://www.linkedin.com/in/himanshu-kushwaha-5a6a91394",
  
  about: `I leverage a multidisciplinary foundation spanning physics, computational intelligence, and biological sciences to engineer robust systems through algorithmic modeling. By pairing rigorous quantitative methods with experimental research, my work focuses on neural signal processing pipelines, transformer-based cognitive architectures, and high-performance desktop and systems software.`,

  education: [
    {
      degree: "BCA in Artificial Intelligence",
      institution: "Manipal University Jaipur",
      period: "Sep 2025 – Oct 2028",
      focus: "Applied Deep Learning, Transformers, Cognitive Modeling",
    },
    {
      degree: "Bachelor of Science in Physics",
      institution: "APS University, Rewa",
      period: "Completed",
      focus: "Classical & Quantum Mechanics, Mathematical Physics, Electromagnetism",
    },
  ],

  experiences: [
    {
      role: "Head of Research and Development",
      organization: "Medinest",
      period: "Apr 2026 – Present",
      location: "Jaipur, India",
      type: "Leadership / AI R&D",
      points: [
        "Directing applied AI research and orchestrating research-to-production deployment cycles.",
        "Led a cross-functional squad of 7+ AI researchers developing segmented deep learning models for clinical diagnostic support.",
        "Architected scalable data preprocessing and model evaluation harnesses ensuring zero-drift inferences.",
      ],
      badges: ["Deep Learning", "Medical AI", "Team Leadership", "R&D Strategy"],
    },
    {
      role: "Neurotechnology Researcher",
      organization: "BCI Club — g.tec Medical Engineering",
      period: "Mar 2025 – Aug 2025",
      location: "Remote / Austria",
      type: "Research & Development",
      points: [
        "Implemented real-time neural signal processing pipelines for continuous EEG telemetry and motor imagery classification.",
        "Designed artifact rejection filters (ICA, bandpass) and spatial covariance feature extractors.",
        "Graduated from the BCI & Neurotechnology Spring School 2025 and participated in the Br41NI.IO BCI Designer's Hackathon.",
      ],
      badges: ["Brain-Computer Interfaces", "Signal Processing", "EEG Telemetry", "Br41NI.IO"],
    },
    {
      role: "Open Source Contributor & GSoC Contributor",
      organization: "Global Open Source Ecosystem",
      period: "2025 – Present",
      location: "Global",
      type: "Open Source",
      points: [
        "GSoC 2025 contributor focusing on open source systems and machine learning enhancements.",
        "Contributed low-level fixes and AI instance management workflows to Pandora Launcher (Rust + GPUI).",
        "Created and maintain Luniq Music with 100+ GitHub stars, managing active user releases and feature requests.",
      ],
      badges: ["GSoC 2025", "Rust", "TypeScript", "Open Source"],
    },
  ] as Experience[],

  projects: [
    {
      id: "luniq-music",
      title: "Luniq Music",
      category: "Desktop & Systems",
      description: "Cross-platform high-fidelity desktop music player built with React, TypeScript, and Electron 30. Features zero-latency offline playback, Spotify + local library merging, synced lyrics, and Discord RPC.",
      tags: ["React 19", "TypeScript", "Electron 30", "Better-SQLite3", "yt-dlp", "Discord-RPC"],
      stars: 100,
      githubUrl: "https://github.com/saraansx/Luniq-Music",
      metrics: ["100+ GitHub Stars", "Multi-Language", "HSL Theming"],
      featured: true,
    },
    {
      id: "pandora-launcher",
      title: "Pandora Launcher",
      category: "Open Source",
      description: "Rust-based multi-instance Minecraft launcher built on Zed's high-performance GPUI framework. Contributed critical stability patches, asynchronous runtime fixes, and integrated AI-assisted instance workflows.",
      tags: ["Rust", "GPUI", "Asynchronous Systems", "AI Workflows"],
      stars: 800,
      githubUrl: "https://github.com/Moulberry/PandoraLauncher",
      metrics: ["800+ GitHub Stars", "Sub-10ms UI Frame Times", "Native GPU Accelerated"],
      featured: true,
    },
    {
      id: "bci-neural-pipeline",
      title: "Real-Time BCI Signal Processor",
      category: "AI & Neurotech",
      description: "Ultra-low-latency neural signal processing suite developed during research at g.tec BCI Club. Performs spatial filtering, Common Spatial Pattern (CSP) extraction, and deep neural decoding on motor imagery streams.",
      tags: ["Python", "SciPy", "EEG Processing", "Deep Learning", "Signal Processing"],
      metrics: ["<15ms Stream Latency", "92.4% Imagery Accuracy", "Br41NI.IO Hackathon"],
      featured: true,
    },
    {
      id: "medinest-deeplearning",
      title: "Medinest Healthcare DL Suite",
      category: "AI & Neurotech",
      description: "Segmented convolutional and transformer architecture for automated medical diagnostic feature extraction, designed under my leadership at Medinest with real-time clinical telemetry.",
      tags: ["PyTorch", "Medical Segmentation", "Transformers", "Distributed Training"],
      metrics: ["7+ Person R&D Team", "Multi-Organ Segmentation", "Production Deployed"],
      featured: true,
    },
    {
      id: "digital-circuits-vhdl",
      title: "Hardware VHDL & PCB Synthesizer",
      category: "Hardware",
      description: "Digital circuit syntheses and multi-layer high-frequency PCB architectures designed and validated using Altium Designer and VHDL logic simulation, certified by Larsen & Toubro.",
      tags: ["VHDL", "Altium Designer", "Digital Logic", "Signal Integrity"],
      metrics: ["L&T Certified", "Altium PCB Certified", "Multi-Layer Routing"],
      featured: false,
    },
  ] as Project[],

  certifications: [
    {
      title: "Open Science 101",
      issuer: "NASA — National Aeronautics and Space Administration",
      date: "Jun 2026",
      category: "Space & Science",
    },
    {
      title: "AI and Machine Learning Algorithms & Techniques",
      issuer: "Microsoft",
      date: "Nov 2025",
      category: "AI & ML",
    },
    {
      title: "Br41NI.IO BCI Designer's Hackathon Award",
      issuer: "g.tec Medical Engineering (Austria)",
      date: "Nov 2025",
      category: "Neurotech",
    },
    {
      title: "Design of Digital Circuits with VHDL Programming",
      issuer: "Larsen & Toubro (L&T)",
      date: "Jan 2026",
      credentialId: "9FAY40MLO6PH",
      category: "Hardware & Embedded",
    },
    {
      title: "Altium Designer Basic PCB Design",
      issuer: "Altium",
      date: "Dec 2025",
      credentialId: "cert_vwc6sg3f",
      category: "Hardware & Embedded",
    },
    {
      title: "Google for Education Certifications",
      issuer: "Google",
      date: "Sep 2026",
      category: "AI & ML",
    },
  ] as Certification[],
};
