import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { getProjectById } from "../firebase/services";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { SkeletonDetail } from "../components/common/SkeletonLoader";

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { projects } = usePortfolio();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadProject = async () => {
      // 1. Try finding in loaded portfolio context first (instant!)
      const foundInContext = projects.find((p) => p.id === id);
      if (foundInContext) {
        setProject(foundInContext);
        setLoading(false);
        return;
      }

      // 2. Fetch directly from Firestore doc if not in memory
      try {
        const docData = await getProjectById(id);
        if (docData) {
          setProject(docData);
        }
      } catch (err) {
        console.warn("Direct project lookup:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-200">
        <Navbar />
        <div className="pt-28 pb-16">
          <SkeletonDetail />
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-200 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-32 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Project Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            The project you are looking for may have been removed or the link is incorrect.
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const techList = Array.isArray(project.techStack)
    ? project.techStack
    : (project.techStack || "").split(",").map((t) => t.trim()).filter(Boolean);

  const featuresList = Array.isArray(project.features)
    ? project.features
    : (project.features || "").split("\n").map((f) => f.trim().replace(/^[-*•]\s*/, "")).filter(Boolean);

  return (
    <div className="min-h-screen bg-dark-bg text-slate-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-12">
        {/* Back navigation */}
        <div>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-primary hover:border-primary/30 transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Header Title & Category */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            <Layers className="w-3.5 h-3.5" />
            <span>{project.category || "PROJECT"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            {project.longDescription || project.description}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover transition-colors text-sm shadow-md shadow-primary/20"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-slate-900 border border-white/10 hover:border-primary/40 transition-colors text-sm"
              >
                <Github className="w-4 h-4 text-primary" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Tech Stack Bar */}
        {techList.length > 0 && (
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Technologies & Architecture
            </span>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-white/5 text-slate-200"
                >
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Cover Image */}
        {project.image && (
          <div className="rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
            <img
              src={project.image}
              alt={project.title}
              className="w-full max-h-[500px] object-cover bg-slate-900"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Key Features */}
        {featuresList.length > 0 && (
          <div className="glass-panel p-8 rounded-3xl space-y-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Key Features & Functional Highlights</span>
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuresList.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-white/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Case Study Screenshots Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Screenshots & System Walkthrough</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((imgItem, idx) => {
                const imgUrl = typeof imgItem === "string" ? imgItem : imgItem.url;
                const imgTitle = typeof imgItem === "object" ? imgItem.title : `Screenshot ${idx + 1}`;
                const imgDesc = typeof imgItem === "object" ? imgItem.desc : "";

                return (
                  <div key={idx} className="rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group">
                    <img
                      src={imgUrl}
                      alt={imgTitle || "Project screenshot"}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    {(imgTitle || imgDesc) && (
                      <div className="p-4 space-y-1">
                        {imgTitle && <h4 className="text-sm font-bold text-white">{imgTitle}</h4>}
                        {imgDesc && <p className="text-xs text-slate-400 leading-relaxed">{imgDesc}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Technical Challenges */}
        {project.challenges && (
          <div className="glass-panel p-8 rounded-3xl space-y-4 border-l-4 border-l-amber-400">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Engineering Challenges & Solutions</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {project.challenges}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
