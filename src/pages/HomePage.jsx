import React from "react";
import { Navbar } from "../components/common/Navbar";
import { ScrollProgress } from "../components/common/ScrollProgress";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { Footer } from "../components/common/Footer";
import { HeroSection } from "../components/home/HeroSection";
import { AboutSection } from "../components/home/AboutSection";
import { SkillsSection } from "../components/home/SkillsSection";
import { ServicesSection } from "../components/home/ServicesSection";
import { ProjectsSection } from "../components/home/ProjectsSection";
import { GallerySection } from "../components/home/GallerySection";
import { ContactSection } from "../components/home/ContactSection";
import { useLenis } from "../hooks/useLenis";

export const HomePage = () => {
  // Activate butter-smooth Lenis scroll
  useLenis();

  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ServicesSection />
        <ProjectsSection />
        <GallerySection />
        <ContactSection />
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
};
