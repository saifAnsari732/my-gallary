"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, CloudLightning, ShieldCheck, Search, Image as ImageIcon, LayoutGrid, Calendar } from "lucide-react";
import Link from "next/link";

const Hero3D = dynamic(() => import("@/components/home/Hero3D"), { ssr: false });

const features = [
  { title: "Unlimited Uploads", desc: "Store all your memories without limits.", icon: CloudLightning },
  { title: "Smart Organization", desc: "Automatic categorization and tagging.", icon: LayoutGrid },
  { title: "Date & Time Tracking", desc: "Preserve exact moments.", icon: Calendar },
  { title: "Lightning Fast Search", desc: "Find images instantly.", icon: Search },
  { title: "Secure Storage", desc: "Enterprise-grade encryption.", icon: ShieldCheck },
  { title: "Responsive Gallery", desc: "Looks great on any device.", icon: ImageIcon },
];

export default function HomeClient({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-32 pb-24">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] w-full rounded-3xl overflow-hidden glass-card flex items-center justify-center border border-white/10">
        <div className="absolute inset-0 z-0">
          <Hero3D />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-full glass mb-6 inline-flex items-center gap-2 border border-primary-500/30"
          >
            <span className="text-primary-400">✨</span>
            <span className="text-sm font-medium text-primary-100">Next Generation Gallery</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white/90 leading-tight"
          >
            Store Your Memories In A <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400 drop-shadow-sm">Digital Universe</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted mb-10 max-w-2xl"
          >
            Upload, organize and showcase your images with stunning visual experiences.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/upload"
              className="px-8 py-4 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center gap-2"
            >
              Upload Images <UploadIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-4 rounded-full glass hover:bg-white/10 text-white font-semibold transition-all hover:scale-105 flex items-center gap-2"
            >
              Explore Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto w-full">
        {[
          { label: "Images", value: "50K+" },
          { label: "Users", value: "10K+" },
          { label: "Uptime", value: "99.9%" },
          { label: "Storage", value: "Unlimited" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center"
          >
            <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
            <div className="text-sm text-muted font-medium uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* FEATURES SECTION */}
      <section className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Premium Features</h2>
          <p className="text-muted max-w-2xl mx-auto">Everything you need to manage your digital assets securely and beautifully.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card rounded-2xl p-8 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <feature.icon className="w-10 h-10 text-secondary-400 mb-6 group-hover:text-primary-400 transition-colors" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVER COMPONENT SLOT (RecentUploads) */}
      {children}

      {/* CTA SECTION */}
      <section className="relative rounded-3xl overflow-hidden p-16 text-center border border-primary-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-xl" />
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to showcase your work?</h2>
          <p className="text-lg text-muted mb-8 max-w-xl">Join thousands of users who trust Hasan Pic for their most precious memories.</p>
          <Link
            href="/upload"
            className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all hover:scale-105 flex items-center gap-2"
          >
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
