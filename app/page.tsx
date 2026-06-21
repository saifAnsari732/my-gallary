import { Suspense } from "react";
import HomeClient from "@/components/home/HomeClient";
import RecentUploads from "@/components/home/RecentUploads";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <HomeClient>
      <Suspense fallback={
        <div className="flex flex-col gap-12 py-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Uploads</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">Loading your latest memories...</p>
          </div>
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          </div>
        </div>
      }>
        <RecentUploads />
      </Suspense>
    </HomeClient>
  );
}
