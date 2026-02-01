import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Using Lucide React for consistent, clean icons
import { 
  FileText, 
  GraduationCap, 
  Image as ImageIcon, 
  Newspaper, 
  Link2, 
  Briefcase, 
  ArrowRight, 
  Plus,
  Megaphone
} from "lucide-react";

export default function Dashboard() {
  
  // Expanded Dashboard Data
  const dashboardSections = [
    {
      title: "Feed",
      description: "Manage feed",
      href: "/dashboard/feed/create",
      buttonText: "Feed",
      count: "12 posts",
      icon: <FileText className="h-5 w-5 text-indigo-400" />,
      color: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] group-hover:border-indigo-500/50"
    },
    {
      title: "Books",
      description: "Curriculum & students",
      href: "/dashboard/Books",
      buttonText: "My Books",
      count: "5 books",
      icon: <GraduationCap className="h-5 w-5 text-purple-400" />,
      color: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover:border-purple-500/50"
    },
    {
      title: "Media Gallery",
      description: "Images & Assets",
      href: "/dashboard/images",
      buttonText: "View Gallery",
      count: "248 files",
      icon: <ImageIcon className="h-5 w-5 text-cyan-400" />,
      color: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group-hover:border-cyan-500/50"
    }
  ];

  return (
    <div className="min-h-screen pt-[100px] bg-[#09090B] text-zinc-100 dark selection:bg-indigo-500/30">
      {/* Sticky Header */}
 

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Overview Grid (Expanded to 6 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dashboardSections.map((section, index) => (
            <Link href={section.href} key={index} className="block group relative h-full">
              <Card className={`h-full bg-[#18181B] border-zinc-800 transition-all duration-300 relative overflow-hidden ${section.color}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-zinc-900/50 rounded-lg border border-zinc-800/50 group-hover:scale-110 transition-transform duration-300">
                      {section.icon}
                    </div>
                    <span className="flex items-center text-xs font-medium text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-800">
                      {section.count}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-white tracking-tight">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-zinc-500">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                    {section.buttonText} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 2. Unified Data Management Area (Tabs) */}
        <div className="bg-[#18181B] rounded-xl border border-zinc-800 overflow-hidden">
          <Tabs defaultValue="blogs" className="w-full">
            
            {/* Tabs Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">Content Management</h2>
                <p className="text-sm text-zinc-400">View and edit your latest entries</p>
              </div>
              <TabsList className="bg-zinc-900 border border-zinc-800">
                <TabsTrigger value="blogs" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">Feed</TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">chapters</TabsTrigger>
                <TabsTrigger value="jobs" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">Books</TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="p-0 min-h-[400px]">


              <TabsContent value="news" className="m-0 border-none outline-none">
                <div className="p-12 text-center text-zinc-500">
                  {/* Replace this div with <NewsTable /> when you create it */}
                  <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium text-zinc-300"> Feed management</h3>
                  <p className="mb-6">Display announcements on the home page.</p>
                  <Link href="/dashboard/news/create">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white">Create First News Item</Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="m-0 border-none outline-none">
                <div className="p-12 text-center text-zinc-500">
                  {/* Replace this div with <JobsTable /> when you create it */}
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium text-zinc-300">Job Listings</h3>
                  <p className="mb-6">Manage careers and open positions.</p>
                  <Link href="/dashboard/jobs/create">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white">Post a Job</Button>
                  </Link>
                </div>
              </TabsContent>

            </div>
          </Tabs>
        </div>

        {/* 3. Quick Actions Bar */}
        <div className="bg-[#18181B] rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Quick Actions</h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickAction href="/dashboard/blog/create" icon={<FileText />} label="Write Blog" />
                    <QuickAction href="/dashboard/news/create" icon={<Megaphone />} label="Post News" />
                    <QuickAction href="/dashboard/links/create" icon={<Link2 />} label="Add Link" />
                    <QuickAction href="/dashboard/jobs/create" icon={<Briefcase />} label="Post Job" />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Small Component for Quick Actions
function QuickAction({ href, icon, label }: { href: string, icon: any, label: string }) {
    return (
        <Link href={href}>
            <Button 
                variant="outline" 
                className="w-full h-12 justify-start gap-3 bg-zinc-900/30 border-dashed border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 hover:border-solid transition-all"
            >
                {React.cloneElement(icon, { className: "h-4 w-4" })}
                <span>{label}</span>
            </Button>
        </Link>
    );
}