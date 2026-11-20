import React from "react";
import * as Icons from "lucide-react";

export const DynamicIcon = ({ name, className = "w-5 h-5", color, style = {} }) => {
  if (!name) return <Icons.Code className={className} style={{ color, ...style }} />;

  // If it's a FontAwesome class like "fab fa-github" or "fas fa-code"
  if (name.startsWith("fa") || name.includes("fa-")) {
    return <i className={name} style={{ color, ...style }}></i>;
  }

  // Normalize name e.g. "Server"
  let cleanName = name.replace(/^fa[srb]?\s+fa-/, "").replace(/^fa-/, "");
  // capitalize first letter or match camelCase
  cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  // Map common icons
  const iconMap = {
    Code: Icons.Code,
    Python: Icons.FileCode2,
    Django: Icons.Server,
    Server: Icons.Server,
    Database: Icons.Database,
    Globe: Icons.Globe,
    Cpu: Icons.Cpu,
    Palette: Icons.Palette,
    Layers: Icons.Layers,
    Layout: Icons.Layout,
    Git: Icons.GitBranch,
    GitBranch: Icons.GitBranch,
    Github: Icons.Github,
    Linkedin: Icons.Linkedin,
    Mail: Icons.Mail,
    Phone: Icons.Phone,
    MapPin: Icons.MapPin,
    ExternalLink: Icons.ExternalLink,
    Terminal: Icons.Terminal,
    Briefcase: Icons.Briefcase,
    GraduationCap: Icons.GraduationCap,
    Send: Icons.Send,
    Download: Icons.Download,
    Check: Icons.Check,
    Star: Icons.Star,
    Image: Icons.Image,
    Sparkles: Icons.Sparkles
  };

  const IconComponent = Icons[name] || Icons[cleanName] || iconMap[cleanName] || Icons.Code2;

  return <IconComponent className={className} style={{ color, ...style }} />;
};
