import { getProjectsData } from './getProjectsData';

export type Project = {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  area: string;
  duration: string;
  status: string;
};

// Re-export the function to get localized project data
export { getProjectsData };

// Legacy export for backward compatibility (defaults to English)
export const projectsData = getProjectsData('en');
