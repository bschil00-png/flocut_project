"use client";

import ImageShowcaseSection from "@/app/components/sections/ImageShowcaseSection";

import FlowExplainSection from "@/app/components/sections/FlowExplainSection";
import ReplaceWorkSection from "@/app/components/sections/ReplaceWorkSection";
import MidCTASection from "@/app/components/sections/MidCTASection";
import HeroSection from "@/app/components/sections/HeroSection";
import SupportSection from "@/app/components/sections/SupportSection";

export default function HomePage() {
    return (
        <>


            <main className="pt-16">
                {/*  Hero  */}
                <HeroSection />

                {/*  Main Feature Showcase (이미지 중심)  */}
                <ImageShowcaseSection/>

                {/*  How It Works (Flow)  */}
                <FlowExplainSection/>

                {/*  Problem → Solution  */}
                <ReplaceWorkSection/>

                <SupportSection/>

                {/*  Mid CTA  */}
                <MidCTASection/>

            </main>


        </>
    );
}
