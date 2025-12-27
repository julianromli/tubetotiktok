import { getProjectAction } from "@/app/actions/project";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { BriefCard } from "@/components/dashboard/BriefCard";
import { notFound } from "next/navigation";
import { AiScript } from "@/lib/validations/ai-output";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  try {
    const project = await getProjectAction(id);
    const briefs = project.briefs as AiScript[];

    if (!briefs) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No scripts found</h2>
          <p className="text-text-muted mb-6">This project doesn't have any generated scripts yet.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>

        <header className="shrink-0 px-8 py-6 z-10 border-b border-white/5">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {project.videoTitle || "Project Details"}
            </h1>
            <p className="text-gray-400 mt-1">
              Source: <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{project.youtubeUrl}</a>
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar">
          <ProjectGrid>
            {briefs.map((brief, index) => (
              <BriefCard
                key={index}
                id={`${id}-${index}`}
                title={`Clip #${index + 1}`}
                hook={brief.hook}
                script_body={brief.script_body}
                cta={brief.cta}
                visual_cue={brief.visual_cue}
                viralScore={Math.floor(Math.random() * (100 - 85) + 85) / 10}
                thumbnailUrl={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1074&auto=format&fit=crop&sig=${index}`}
                onUnlock={() => {}}
                onDownload={() => {}}
              />
            ))}
          </ProjectGrid>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch project:", error);
    notFound();
  }
}
