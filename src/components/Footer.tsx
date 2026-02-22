import { Mail, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-6 md:py-8 px-4 border-t border-border/50">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
          © {new Date().getFullYear()} Harsh Srivastava. All rights reserved.
        </p>
        <div className="flex gap-3 md:gap-4">
          <a
            href="mailto:harshme08@gmail.com"
            className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
            aria-label="Email"
          >
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </a>
          <a
            href="https://www.linkedin.com/in/harsh-tsx/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-accent" />
          </a>
          <a
            href="https://github.com/harshs16"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
