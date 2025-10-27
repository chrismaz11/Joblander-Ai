// Template image imports and mapping

// Generated images
import modernResumeTemplate from '@assets/generated_images/Modern_resume_template_e5991aaf.png';
import executiveResumeTemplate from '@assets/generated_images/Executive_resume_template_820a6579.png';
import studentResumeTemplate from '@assets/generated_images/Student_resume_template_1c2224d4.png';

// Stock images
import professionalBusiness1 from '@assets/stock_images/professional_busines_36348409.jpg';
import professionalBusiness2 from '@assets/stock_images/professional_busines_c7aa056b.jpg';
import professionalBusiness3 from '@assets/stock_images/professional_busines_ef87a72c.jpg';
import minimalClean1 from '@assets/stock_images/minimalist_clean_doc_7c46cd68.jpg';
import minimalClean2 from '@assets/stock_images/minimalist_clean_doc_589066c1.jpg';
import minimalClean3 from '@assets/stock_images/minimalist_clean_doc_e0642427.jpg';
import creativeColorful1 from '@assets/stock_images/creative_colorful_po_d6b2b620.jpg';
import creativeColorful2 from '@assets/stock_images/creative_colorful_po_751bcdd4.jpg';
import creativeColorful3 from '@assets/stock_images/creative_colorful_po_52c75c3d.jpg';
import techDeveloper1 from '@assets/stock_images/tech_developer_codin_41007037.jpg';
import techDeveloper2 from '@assets/stock_images/tech_developer_codin_9ce14b3d.jpg';
import techDeveloper3 from '@assets/stock_images/tech_developer_codin_ce6e64e7.jpg';

// Mapping of template image IDs to imported images
export const templateImageMap: Record<string, string> = {
  // Modern Professional
  'modern_resume_template_e5991aaf': modernResumeTemplate,
  'professional_busines_36348409': professionalBusiness1,
  'professional_busines_c7aa056b': professionalBusiness2,
  'professional_busines_ef87a72c': professionalBusiness3,
  
  // Minimalist
  'minimalist_clean_doc_7c46cd68': minimalClean1,
  'minimalist_clean_doc_589066c1': minimalClean2,
  'minimalist_clean_doc_e0642427': minimalClean3,
  
  // Creative
  'creative_colorful_po_d6b2b620': creativeColorful1,
  'creative_colorful_po_751bcdd4': creativeColorful2,
  'creative_colorful_po_52c75c3d': creativeColorful3,
  
  // Executive
  'executive_resume_template_820a6579': executiveResumeTemplate,
  
  // Student
  'student_resume_template_1c2224d4': studentResumeTemplate,
  
  // Tech
  'tech_developer_codin_41007037': techDeveloper1,
  'tech_developer_codin_9ce14b3d': techDeveloper2,
  'tech_developer_codin_ce6e64e7': techDeveloper3,
};

// Helper function to get template image
export function getTemplateImage(imageId: string): string {
  // First check if we have a direct mapping
  const normalizedId = imageId.toLowerCase();
  
  // Check direct mapping
  if (templateImageMap[normalizedId]) {
    return templateImageMap[normalizedId];
  }
  
  // Try to find a partial match
  for (const [key, value] of Object.entries(templateImageMap)) {
    if (normalizedId.includes(key) || key.includes(normalizedId)) {
      return value;
    }
  }
  
  // Return a default/fallback image if not found
  return modernResumeTemplate;
}