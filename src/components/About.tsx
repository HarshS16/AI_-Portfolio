import { Card } from "@/components/ui/card";
import { GraduationCap, MapPin, Briefcase } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 md:mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="space-y-5 md:space-y-6 animate-slide-up">
            <div className="bg-primary/10 p-4 md:p-6 rounded-3xl rounded-tl-none">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                I'm a Computer Science undergraduate at JSS Academy of Technical Education
                (specializing in Data Science) with hands-on experience building and shipping
                full-stack applications. I've interned at Miracle AI and Vaxalor AI, where I
                architected production websites, optimized dashboards, and implemented LLM
                observability pipelines.
              </p>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-3 md:mt-4">
                I'm passionate about building tools that solve real problems — from professional
                networking platforms to AI-powered career tools. I was also recognized as a
                Reliance Foundation Scholar for academic excellence.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Currently Studying</p>
                  <p className="text-sm text-muted-foreground">B.Tech CSE (Data Science) — JSS Academy</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>
              </div>

              <div className="flex items-center gap-3 text-foreground">

                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">Noida, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 animate-slide-up">
            <Card className="p-4 md:p-6 bg-card hover:shadow-lg transition-all duration-300 border-border/50">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-primary">Full Stack Development</h3>
              <p className="text-muted-foreground">
                Building end-to-end production applications with React, Next.js, Node.js, and PostgreSQL — from ideation to deployment
              </p>
            </Card>

            <Card className="p-4 md:p-6 bg-card hover:shadow-lg transition-all duration-300 border-border/50">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-accent">AI & LLM Integration</h3>
              <p className="text-muted-foreground">
                Implementing LLM observability, Gemini API integrations, and AI-powered features in production environments
              </p>
            </Card>

            <Card className="p-4 md:p-6 bg-card hover:shadow-lg transition-all duration-300 border-border/50">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-primary">Performance Optimization</h3>
              <p className="text-muted-foreground">
                Profiling and optimizing critical application paths, reducing latency and improving end-to-end performance
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
