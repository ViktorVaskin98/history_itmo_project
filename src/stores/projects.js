import { defineStore } from 'pinia';
import { projectsData } from '../api/data';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projectsList: projectsData,
  }),
  getters: {
    getAllProjects: (state) => state.projectsList,
    
    getProjectById: (state) => {
      return (id) => state.projectsList.find((project) => project.id === id);
    }
  }
});