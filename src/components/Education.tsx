import { Card } from "@/components/ui/card";
import { GraduationCap, Calendar, BookOpen } from "lucide-react";

const education = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science & Engineering (Specialization: Data Science)",
    institution: "JSS Academy of Technical Education, Noida",
    period: "2023 - 2027",
    highlights: [
      "Specialization in Data Science with focus on AI/ML applications",
      "Building full-stack applications and contributing to open-source",
      "Recognized as Reliance Foundation Undergraduate Scholar",
      "Active in technical communities and hackathons",
    ],
  },
];

const Education = () => {
  return (
    <section id="education" className="py-16 md:py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 md:mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Educational <span className="text-gradient">Journey</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="space-y-4 md:space-y-8">
          {education.map((edu, index) => (
            <Card
              key={index}
              className="p-5 md:p-8 bg-card hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/30 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                  </div>
                </div>

                <div className="flex-1 space-y-3 md:space-y-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1">{edu.degree}</h3>
                    <p className="text-base md:text-lg text-accent font-medium">{edu.field}</p>
                    <p className="text-muted-foreground mt-1">{edu.institution}</p>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{edu.period}</span>
                  </div>

                  <div className="space-y-2">
                    {edu.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
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

export default Education;
