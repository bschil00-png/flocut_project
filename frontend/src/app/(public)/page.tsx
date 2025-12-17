"use client";

import HeroSection from "@/app/components/home/HeroSection";
import MascotHighlightSection from "@/app/components/home/MascotHighlightSection";
import NoticeSection from "@/app/components/home/NoticeSection";
import FlowExplainSection from "@/app/components/home/FlowExplainSection";
import ReplaceWorkSection from "@/app/components/home/ReplaceWorkSection";
import FreeTrialSection from "@/app/components/home/FreeTrialSection";
import AiFeatureShowcaseSection from "@/app/components/home/AiFeatureShowcaseSection";
import Section from "@/app/components/layout/Section";
export default function HomePage() {
  return (
    <>
      <Section>
        <HeroSection />
      </Section>

      <Section variant="surface">
        <AiFeatureShowcaseSection />
      </Section>

      <Section variant="accent">
        <MascotHighlightSection />
      </Section>

      <Section>
        <NoticeSection />
      </Section>

      {/*<Section variant="gradient">*/}
      {/*  <FlowExplainSection />*/}
      {/*</Section>*/}

      <Section>
        <ReplaceWorkSection />
      </Section>

      <Section variant="surface">
        <FreeTrialSection />
      </Section>
    </>
  );
}
