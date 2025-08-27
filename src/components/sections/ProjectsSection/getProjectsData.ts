import type { Project } from './projectsData.en';
import { projectsDataEn } from './projectsData.en';
import { projectsDataHi } from './projectsData.hi';

export function getProjectsData(locale: string): Project[] {
  switch (locale) {
    case 'hi':
      return projectsDataHi;
    case 'en':
    default:
      return projectsDataEn;
  }
}
