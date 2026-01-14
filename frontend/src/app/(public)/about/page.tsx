"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Users, Heart } from "lucide-react";
import AboutHeroSection from "@/app/components/about/AboutHeroSection";
import TechStackSection from "@/app/components/about/TechStackSection";
import FeaturesSection from "@/app/components/about/FeaturesSection";
import VisionSection from "@/app/components/about/VisionSection";
import TeamSection from "@/app/components/about/TeamSection";
import CultureSection from "@/app/components/about/CultureSection";
import AboutCTASection from "@/app/components/about/AboutCTASection";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"vision" | "team" | "culture">("vision");

  const tabs = [
    { id: "vision" as const, label: "비전", icon: Target },
    { id: "team" as const, label: "팀", icon: Users },
    { id: "culture" as const, label: "문화", icon: Heart }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AboutHeroSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Core Features */}
      <FeaturesSection />

      {/* Vision / Team / Culture Tabs */}
      <section className="w-full py-24 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-6">
          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-16">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-accent text-white shadow-lg shadow-accent/30"
                      : "bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-accent/50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "vision" && <VisionSection />}
            {activeTab === "team" && <TeamSection />}
            {activeTab === "culture" && <CultureSection />}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <AboutCTASection />
    </div>
  );
}