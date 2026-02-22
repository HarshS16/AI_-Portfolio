import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";

const roles = [
  "Full Stack Engineer",
  "AI / ML Enthusiast",
  "React & Next.js Developer",
  "Open Source Contributor"
];

const Hero = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRoleIndex]);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 md:pt-0">
      {/* Neural grid background */}
      <div className="absolute inset-0 neural-grid opacity-20" />

      {/* Gradient glow effect */}
      <div className="absolute inset-0 bg-[image:var(--gradient-glow)] pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between animate-fade-in">
          <div className="md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left">
            {/* Main heading with enhanced glow */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold">
              Hi, I'm{" "}
              <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">Harsh Srivastava</span>
            </h1>

            {/* Typing Animation */}
            <div className="text-lg md:text-xl lg:text-2xl font-semibold h-7 md:h-8">
              <span className="text-cyan-400">{displayText}</span>
              <span className="animate-pulse text-cyan-400">|</span>
            </div>

            <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg px-4 md:px-5 py-2 md:py-3 backdrop-blur-sm">
              <p className="text-sm md:text-base text-foreground font-medium">
                Building full-stack apps that solve real problems — from AI-powered tools to production platforms
              </p>
            </div>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 pt-2 md:pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 neural-glow"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Mail className="mr-2 h-5 w-5" />
                Get in Touch
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="neural-border hover:neural-glow"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/harsh-tsx/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-5 w-5" />
                  View LinkedIn
                </a>
              </Button>
            </div>


          </div>

          <div className="md:w-1/2 mt-6 md:mt-16">
            <div className="relative w-full max-w-[280px] sm:max-w-sm mx-auto mt-4 md:mt-8">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-lg blur-2xl animate-pulse opacity-60"></div>
              <div className="absolute inset-0 neural-border rounded-lg"></div>

              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-accent rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-accent rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-accent rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-accent rounded-br-lg" />

              <img
                src="/me.jpeg"
                alt="Harsh Srivastava"
                className="relative w-full rounded-lg shadow-2xl card-3d"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse" />

      {/* Floating nodes */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default Hero;
