import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    title: "Full Stack Development Intern",
    organization: "Miracle AI",
    location: "Onsite – Delhi",
    period: "December 2025 - Present",
    description:
      "Architected and shipped a fully responsive production website using Next.js, integrating GPU-accelerated 3D scenes and interactive animations with Three.js. Redesigned the React TypeScript-based dashboard UI, optimizing render paths and interaction flow to reduce perceived latency by 50%. Profiled and optimized critical application paths, collaborating with backend and frontend teams to improve end-to-end performance by 70%. Implemented LLM observability across inference routes, instrumenting latency, token usage, error rates, and per-request cost.",
    tags: ["Next.js", "Three.js", "React", "TypeScript", "LLM Observability"],
  },
  {
    title: "Full Stack Developer Intern",
    organization: "Vaxalor AI",
    location: "Hybrid",
    period: "September 2025 - October 2025",
    description:
      "Owned the end-to-end development of the company's production website using React TypeScript. Integrated Supabase for real-time data sync, authentication, and serverless functions. Delivered multiple full-stack features across the product lifecycle.",
    tags: ["React", "TypeScript", "Supabase", "Full Stack"],
  },
  {
    title: "Software Development Intern",
    organization: "Central Ground Water Board",
    location: "Faridabad, Haryana",
    period: "April 2025 - May 2025",
    description:
      "Developed a comprehensive data management portal to digitize groundwater records, reducing manual retrieval time by 40%. Implemented automated reporting scripts using Python and SQL to streamline daily data analysis. Designed and deployed user-friendly interfaces for field officers, ensuring seamless data entry and real-time visualization.",
    tags: ["Python", "SQL", "Data Management", "Portal Development"],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 md:mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            Building production-grade applications and optimizing performance across AI startups and government organizations
          </p>
        </div>

        <div className="space-y-4 md:space-y-8">
          {experiences.map((exp, index) => (
            <Card
              key={index}
              className="p-5 md:p-8 bg-card hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                </div>

                <div className="flex-1 space-y-3 md:space-y-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1">{exp.title}</h3>
                    <p className="text-base md:text-lg text-primary font-medium">{exp.organization}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{exp.location}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
