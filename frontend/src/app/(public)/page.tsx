"use client";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

import HeroSection from "@/app/components/sections/HeroSection";
import AiFeatureShowcaseSection from "@/app/components/sections/AiFeatureShowcaseSection";
import FlowExplainSection from "@/app/components/sections/FlowExplainSection";
import ReplaceWorkSection from "@/app/components/sections/ReplaceWorkSection";
import MidCTASection from "@/app/components/sections/MidCTASection";
import MascotHighlightSection from "@/app/components/sections/MascotHighlightSection";
import ImageShowcaseSection from "@/app/components/sections/ImageShowcaseSection";
import NoticeSection from "@/app/components/sections/NoticeSection";

export default function HomePage() {
    return (
        <>
            {/*  Header  */}
            <Header />

            <main className="pt-16">
                {/*  Hero  */}
                <HeroSection />

                {/*  Main Feature Showcase (이미지 중심)  */}
                <ImageShowcaseSection />

                {/*  How It Works (Flow)  */}
                <FlowExplainSection />

                {/*  Problem → Solution  */}
                <ReplaceWorkSection />

                <NoticeSection />

                {/*  Mid CTA  */}
                <MidCTASection />

                {/*  Brand Emotion  */}
                {/*<MascotHighlightSection />*/}
            </main>

            {/*  Footer  */}
            <Footer />
        </>
    );
}
