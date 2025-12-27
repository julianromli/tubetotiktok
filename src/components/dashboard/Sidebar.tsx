"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  FolderOpen, 
  Settings, 
  CreditCard, 
  PlusCircle,
  Video,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { NewProjectModal } from "./NewProjectModal";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <aside className="w-64 h-full flex flex-col justify-between bg-sidebar-dark/95 backdrop-blur-md shrink-0 transition-all duration-300 z-20 hidden md:flex border-r border-white/5">
        <div className="flex flex-col gap-2 p-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(242,13,85,0.4)]">
              <Video className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold tracking-tight">TubeToTikTok</h1>
              <p className="text-white/40 text-xs font-medium">Creator Dashboard</p>
            </div>
          </Link>

          {/* Primary Action */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all mb-6 group ring-2 ring-primary ring-offset-2 ring-offset-background-dark cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>New Project</span>
          </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <Link 
            href="/dashboard" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 font-medium transition-colors",
              isActive("/dashboard") ? "bg-white/5 text-white border border-white/5" : "text-gray-400 hover:text-white"
            )}
          >
            <LayoutDashboard className={cn("w-5 h-5", isActive("/dashboard") && "text-primary")} />
            Dashboard
          </Link>
          <Link 
            href="/history" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 font-medium transition-colors",
              isActive("/history") ? "bg-white/5 text-white border border-white/5" : "text-gray-400 hover:text-white"
            )}
          >
            <History className={cn("w-5 h-5", isActive("/history") && "text-primary")} />
            History
          </Link>
          <Link 
            href="/results" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 font-medium transition-colors",
              isActive("/results") ? "bg-white/5 text-white border border-white/5" : "text-gray-400 hover:text-white"
            )}
          >
            <FolderOpen className={cn("w-5 h-5", isActive("/results") && "text-primary")} />
            Results Demo
          </Link>
          <Link 
            href="/settings" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-medium transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <Link 
            href="/billing" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-medium transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Billing
          </Link>
          <SignOutButton redirectUrl="/">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 font-medium transition-colors w-full text-left cursor-pointer mt-2 border border-transparent hover:border-red-500/20">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </SignOutButton>
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
              {isLoaded ? user?.fullName || user?.primaryEmailAddress?.emailAddress : "Loading..."}
            </p>
            <p className="text-xs text-gray-500 truncate">Settings</p>
          </div>
        </div>
      </div>
    </aside>
    <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
