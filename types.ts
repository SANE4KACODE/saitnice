import { LucideIcon } from 'lucide-react';

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  socials: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  }
}