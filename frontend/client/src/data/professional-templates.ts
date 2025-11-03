// Re-export planet templates as the main template system
export { 
  type PlanetTemplate as TemplateData,
  getAllPlanetTemplates as getAllTemplates,
  getTemplateById,
  getTemplatesByCategory,
  getFreeTemplates,
  getPremiumTemplates
} from './planet-templates';

