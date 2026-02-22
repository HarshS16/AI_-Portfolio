import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Zap } from "lucide-react";

const projects = [
  {
    title: "SocioX",
    description:
      "A LinkedIn-inspired full-stack professional networking platform with real-time messaging, post feeds, CRUD workflows, and user profiles. Features bi-directional real-time messaging using WebSockets and a scalable client-server architecture.",
    link: "https://sociox-connect.vercel.app/",
    github: "https://github.com/HarshS16/SocioX",
    tech: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "WebSockets"],
  },
  {
    title: "Rheo - Event Management",
    description:
      "A full-stack event orchestration platform supporting event creation, discovery, and QR-based ticketing. Features dynamic QR generation and validation for scan-based check-ins, plus email workflows via Nodemailer and SendGrid.",
    link: "https://rheo-sigma.vercel.app/",
    github: "https://github.com/HarshS16/Eventflow",
    tech: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Supabase"],
  },
  {
    title: "DevElevate - AI Resume Refiner",
    description:
      "An AI-driven career platform to refine resumes and generate developer portfolios. Integrates the Gemini API for semantic resume analysis, ATS scoring, and context-aware content enhancement with a portfolio generator that ingests GitHub repos.",
    link: "https://dev-elevate-ma91.vercel.app/",
    github: "https://github.com/HarshS16/DevElevate",
    tech: ["React", "Node.js", "MongoDB", "Clerk", "Gemini API"],
  },
  {
    title: "PostFlow - Content Management",
    description:
      "A comprehensive full-stack web application for content creators to draft, organize, and schedule social media posts across multiple platforms. Developed as part of a Frontend Developer Intern selection process.",
    link: "https://postflow-by-harsh.vercel.app/",
    github: "https://github.com/harshs16/PostFlow",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
  },
  {
    title: "Civix - Civic Issue Reporting",
    description:
      "A full-stack web application to streamline reporting, tracking, and resolving local civic issues. Bridges citizens and municipal authorities, bringing accountability and transparency to local issue resolution.",
    link: "https://civix-phi.vercel.app/",
    github: "https://github.com/harshs16/Civix",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  },
  {
    title: "Chai Culture",
    description:
      "A modern, aesthetic landing page celebrating Chai's cultural heritage. Features smooth, complex animations powered by GSAP and Framer Motion, with a responsive, accessible UI designed with shadcn/ui and Tailwind CSS.",
    link: "https://chai-culture-alpha.vercel.app/",
    github: "https://github.com/harshs16/ChaiCulture",
    tech: ["Vite", "React", "TypeScript", "Framer Motion", "GSAP"],
  },
  {
    title: "CodeInfo",
    description:
      "A command-line tool and web interface for analyzing codebases. Generates detailed statistics including language distribution, file complexity metrics, and structural anomalies.",
    link: "https://github.com/harshs16/CodeInfo",
    github: "https://github.com/harshs16/CodeInfo",
    tech: ["Python", "Flask", "JavaScript", "HTML/CSS"],
  },
  {
    title: "GiftHunt - AI Gift Discovery",
    description:
      "An AI-powered gift discovery platform that finds the perfect gift based on occasion, budget, relationship, and interests. Intelligently hunts down thoughtful gifts across the web with tailored suggestions.",
    link: "https://gifthunt-phi.vercel.app/",
    github: "https://github.com/harshs16/GiftHunt",
    tech: ["React", "Tailwind CSS", "Gemini API", "Node.js", "PostgreSQL"],
  },
  {
    title: "Dreamy Tales - AI Story Generator",
    description:
      "A magical web application that creates personalized bedtime stories for children using AI, with soothing audio narration via ElevenLabs. Features dynamic story generation based on child's interests and mood.",
    link: "https://dreamy-tales.vercel.app/",
    github: "https://github.com/harshs16/DreamyTales",
    tech: ["React", "Tailwind CSS", "Gemini API", "ElevenLabs", "Framer Motion"],
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-16 md:py-24 px-4 relative">
      <div className="absolute inset-0 neural-grid opacity-30" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-10 md:mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            My <span className="text-primary font-extrabold">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full pulse-glow" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group p-4 md:p-6 neural-border card-3d flex flex-col relative overflow-hidden"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/20 to-transparent" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />

              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-1">
                  {project.tech.slice(0, 2).map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-primary group-hover:neon-text transition-all duration-300">
                {project.title}
              </h3>

              <p className="text-muted-foreground flex-grow text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1 mt-4 mb-4">
                {project.tech.map((tech, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex gap-2">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full neural-border hover:neural-glow group-hover:scale-105 transition-all duration-300"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </Button>
                </a>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="neural-border hover:neural-glow group-hover:scale-105 transition-all duration-300"
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                </a>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;