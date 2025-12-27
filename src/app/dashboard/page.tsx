import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { BriefCard } from "@/components/dashboard/BriefCard";
import { Search, Plus, Video } from "lucide-react";
import { getProjectsAction } from "@/app/actions/project";
import Link from "next/link";
import { AiScript } from "@/lib/validations/ai-output";

export default async function DashboardPage() {
  const projects = await getProjectsAction();

  return (
    <>
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>
      
      {/* Header */}
      <header className="shrink-0 px-8 py-6 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Your Projects</h2>
            <p className="text-gray-400 mt-1">Manage and export your generated TikTok scripts</p>
          </div>
          {/* Search */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-black/20 text-white placeholder-gray-500 focus:outline-none focus:bg-black/40 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all" 
              placeholder="Search projects..." 
              type="text"
            />
          </div>
        </div>
      </header>
      
      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-10 z-10 custom-scrollbar">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Video className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
            <p className="text-gray-400 mb-8 max-w-sm">
              Create your first project to start converting YouTube videos into viral TikTok scripts.
            </p>
            {/* Note: In a real app, this would trigger the NewProjectModal */}
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all cursor-pointer">
              <Plus className="w-5 h-5" />
              <span>Create New Project</span>
            </button>
          </div>
        ) : (
          <ProjectGrid>
            {projects.map((project) => {
              const briefs = (project.briefs || []) as AiScript[];
              const firstBrief = briefs[0];
              
              return (
                <Link key={project.id} href={`/dashboard/project/${project.id}`}>
                  <BriefCard 
                    id={project.id}
                    title={project.videoTitle || "Untitled Project"}
                    hook={firstBrief?.hook || "No hook generated"}
                    script_body={firstBrief?.script_body || "No script generated"}
                    cta={firstBrief?.cta || ""}
                    visual_cue={firstBrief?.visual_cue || ""}
                    viralScore={9.5} // Placeholder
                    thumbnailUrl={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1074&auto=format&fit=crop&sig=${project.id}`}
                    isLocked={false}
                  />
                </Link>
              );
            })}
          </ProjectGrid>
        )}
      </div>
    </>
  );
}
