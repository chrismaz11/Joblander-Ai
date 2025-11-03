// Planet-Themed Resume Templates - Adobe Quality
export interface PlanetTemplate {
  id: string;
  name: string;
  planet: string;
  description: string;
  category: 'creative' | 'professional' | 'modern' | 'minimalist' | 'executive';
  cssClass: string;
  cssFile: string;
  isPremium: boolean;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  preview: {
    thumbnail: string;
    image: string;
  };
}

export const PLANET_TEMPLATES: PlanetTemplate[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    planet: 'The Swift Professional',
    description: 'Clean, minimalist design perfect for any industry. Fast to scan, professional impact.',
    category: 'minimalist',
    cssClass: 'resume-minimalist-modern',
    cssFile: 'minimalist-modern-professional-resume.css',
    isPremium: false,
    features: ['ATS-Optimized', 'Clean Layout', 'Professional Typography', 'Universal Appeal'],
    colors: {
      primary: '#222',
      secondary: '#111',
      background: '#fcfcfc'
    },
    preview: {
      thumbnail: '/assets/images/templates/mercury/thumbnail.png',
      image: '/assets/images/templates/mercury/preview.png'
    }
  },
  {
    id: 'venus',
    name: 'Venus',
    planet: 'The Golden Standard',
    description: 'Elegant golden accents with sophisticated styling. Perfect for premium positions.',
    category: 'professional',
    cssClass: 'resume-cv--white-yellow',
    cssFile: 'white-yellow-minimal-cv.css',
    isPremium: false,
    features: ['Golden Accents', 'Elegant Design', 'Premium Feel', 'Executive Ready'],
    colors: {
      primary: '#ffd700',
      secondary: '#c49000',
      background: '#fff'
    },
    preview: {
      thumbnail: '/assets/images/templates/venus/thumbnail.png',
      image: '/assets/images/templates/venus/preview.png'
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    planet: 'The Natural Choice',
    description: 'Organic green tones with creative flair. Ideal for design and creative roles.',
    category: 'creative',
    cssClass: 'resume-beige-green-designer',
    cssFile: 'beige-green-graphic-designer-resume.css',
    isPremium: true,
    features: ['Creative Design', 'Natural Colors', 'Designer Focused', 'Artistic Layout'],
    colors: {
      primary: '#729f44',
      secondary: '#4f7c28',
      background: '#f8f6f1'
    },
    preview: {
      thumbnail: '/assets/images/templates/earth/thumbnail.png',
      image: '/assets/images/templates/earth/preview.png'
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    planet: 'The Bold Pioneer',
    description: 'Strong red accents with confident styling. Perfect for leadership positions.',
    category: 'executive',
    cssClass: 'resume-mars-executive',
    cssFile: 'mars-executive-resume.css',
    isPremium: true,
    features: ['Executive Style', 'Bold Design', 'Leadership Focus', 'Confident Layout'],
    colors: {
      primary: '#cd5c5c',
      secondary: '#8b0000',
      background: '#fff5f5'
    },
    preview: {
      thumbnail: '/assets/images/templates/mars/thumbnail.png',
      image: '/assets/images/templates/mars/preview.png'
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    planet: 'The Grand Professional',
    description: 'Majestic blue design with commanding presence. For senior executive roles.',
    category: 'executive',
    cssClass: 'resume-jupiter-professional',
    cssFile: 'jupiter-professional-resume.css',
    isPremium: true,
    features: ['Commanding Presence', 'Executive Layout', 'Professional Blue', 'Senior Level'],
    colors: {
      primary: '#4169e1',
      secondary: '#191970',
      background: '#f0f8ff'
    },
    preview: {
      thumbnail: '/assets/images/templates/jupiter/thumbnail.png',
      image: '/assets/images/templates/jupiter/preview.png'
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    planet: 'The Structured Achiever',
    description: 'Sophisticated structure with elegant rings of content. Perfect for consultants.',
    category: 'professional',
    cssClass: 'resume-saturn-structured',
    cssFile: 'saturn-structured-resume.css',
    isPremium: true,
    features: ['Structured Layout', 'Consultant Ready', 'Elegant Design', 'Achievement Focus'],
    colors: {
      primary: '#daa520',
      secondary: '#b8860b',
      background: '#fffaf0'
    },
    preview: {
      thumbnail: '/assets/images/templates/saturn/thumbnail.png',
      image: '/assets/images/templates/saturn/preview.png'
    }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    planet: 'The Innovative Thinker',
    description: 'Unique teal design with innovative layout. Perfect for tech and startup roles.',
    category: 'modern',
    cssClass: 'resume-uranus-innovative',
    cssFile: 'uranus-innovative-resume.css',
    isPremium: true,
    features: ['Innovative Design', 'Tech Focused', 'Modern Layout', 'Startup Ready'],
    colors: {
      primary: '#20b2aa',
      secondary: '#008b8b',
      background: '#f0ffff'
    },
    preview: {
      thumbnail: '/assets/images/templates/uranus/thumbnail.png',
      image: '/assets/images/templates/uranus/preview.png'
    }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    planet: 'The Deep Professional',
    description: 'Deep blue oceanic design with flowing content. Ideal for maritime and consulting.',
    category: 'professional',
    cssClass: 'resume-neptune-deep',
    cssFile: 'neptune-deep-resume.css',
    isPremium: true,
    features: ['Deep Blue Design', 'Flowing Layout', 'Professional Depth', 'Consulting Ready'],
    colors: {
      primary: '#4682b4',
      secondary: '#2f4f4f',
      background: '#f8f8ff'
    },
    preview: {
      thumbnail: '/assets/images/templates/neptune/thumbnail.png',
      image: '/assets/images/templates/neptune/preview.png'
    }
  },
  {
    id: 'pluto',
    name: 'Pluto',
    planet: 'The Compact Powerhouse',
    description: 'Small but mighty design with maximum impact. Perfect for entry-level positions.',
    category: 'minimalist',
    cssClass: 'resume-pluto-compact',
    cssFile: 'pluto-compact-resume.css',
    isPremium: false,
    features: ['Compact Design', 'Entry Level', 'Maximum Impact', 'Space Efficient'],
    colors: {
      primary: '#696969',
      secondary: '#2f2f2f',
      background: '#ffffff'
    },
    preview: {
      thumbnail: '/assets/images/templates/pluto/thumbnail.png',
      image: '/assets/images/templates/pluto/preview.png'
    }
  },
  {
    id: 'ceres',
    name: 'Ceres',
    planet: 'The Nurturing Professional',
    description: 'Warm beige tones with marketing focus. Perfect for business and marketing roles.',
    category: 'professional',
    cssClass: 'resume-beige-marketing',
    cssFile: 'beige-marketing-resume.css',
    isPremium: false,
    features: ['Marketing Focus', 'Warm Tones', 'Business Ready', 'Professional Layout'],
    colors: {
      primary: '#ca9957',
      secondary: '#b67634',
      background: '#f9f6ee'
    },
    preview: {
      thumbnail: '/assets/images/templates/ceres/thumbnail.png',
      image: '/assets/images/templates/ceres/preview.png'
    }
  },
  {
    id: 'eris',
    name: 'Eris',
    planet: 'The Simple Elegance',
    description: 'Clean beige simplicity with elegant styling. Universal appeal for any industry.',
    category: 'minimalist',
    cssClass: 'resume-beige-simple',
    cssFile: 'beige-simple-resume.css',
    isPremium: false,
    features: ['Simple Design', 'Elegant Styling', 'Universal Appeal', 'Clean Layout'],
    colors: {
      primary: '#ba9154',
      secondary: '#915a1a',
      background: '#fdf9f3'
    },
    preview: {
      thumbnail: '/assets/images/templates/eris/thumbnail.png',
      image: '/assets/images/templates/eris/preview.png'
    }
  },
  {
    id: 'makemake',
    name: 'Makemake',
    planet: 'The Broken White Minimal',
    description: 'Sophisticated off-white design with subtle elegance. Perfect for creative professionals.',
    category: 'minimalist',
    cssClass: 'resume-broken-white-minimal',
    cssFile: 'broken-white-simple-minimal-resume.css',
    isPremium: true,
    features: ['Off-White Design', 'Subtle Elegance', 'Creative Focus', 'Sophisticated'],
    colors: {
      primary: '#b78f5a',
      secondary: '#9a7a45',
      background: '#fefaf7'
    },
    preview: {
      thumbnail: '/assets/images/templates/makemake/thumbnail.png',
      image: '/assets/images/templates/makemake/preview.png'
    }
  },
  {
    id: 'haumea',
    name: 'Haumea',
    planet: 'The Art Director',
    description: 'Bold brown and black design for creative leadership roles. Strong visual impact.',
    category: 'creative',
    cssClass: 'resume-brown-black-art-director',
    cssFile: 'brown-black-art-director-resume.css',
    isPremium: true,
    features: ['Art Direction', 'Bold Design', 'Creative Leadership', 'Strong Impact'],
    colors: {
      primary: '#8b4513',
      secondary: '#654321',
      background: '#faf5f0'
    },
    preview: {
      thumbnail: '/assets/images/templates/haumea/thumbnail.png',
      image: '/assets/images/templates/haumea/preview.png'
    }
  },
  {
    id: 'sedna',
    name: 'Sedna',
    planet: 'The Student Scholar',
    description: 'Clean academic design perfect for students and recent graduates. Professional yet approachable.',
    category: 'minimalist',
    cssClass: 'resume-gray-blank-college-student',
    cssFile: 'gray-blank-college-student-resume.css',
    isPremium: false,
    features: ['Student Friendly', 'Academic Focus', 'Clean Design', 'Entry Level'],
    colors: {
      primary: '#708090',
      secondary: '#556b7d',
      background: '#f8f9fa'
    },
    preview: {
      thumbnail: '/assets/images/templates/sedna/thumbnail.png',
      image: '/assets/images/templates/sedna/preview.png'
    }
  },
  {
    id: 'quaoar',
    name: 'Quaoar',
    planet: 'The Placeholder Pro',
    description: 'Versatile professional template with customizable elements. Adapts to any role.',
    category: 'professional',
    cssClass: 'resume-placeholder-2',
    cssFile: 'placeholder-resume-2.css',
    isPremium: true,
    features: ['Versatile Design', 'Customizable', 'Professional', 'Adaptable'],
    colors: {
      primary: '#4a90e2',
      secondary: '#357abd',
      background: '#ffffff'
    },
    preview: {
      thumbnail: '/assets/images/templates/quaoar/thumbnail.png',
      image: '/assets/images/templates/quaoar/preview.png'
    }
  },
  {
    id: 'orcus',
    name: 'Orcus',
    planet: 'The Executive Elite',
    description: 'Premium executive template with sophisticated styling. For C-level positions.',
    category: 'executive',
    cssClass: 'resume-placeholder-3',
    cssFile: 'placeholder-resume-3.css',
    isPremium: true,
    features: ['Executive Level', 'Premium Design', 'Sophisticated', 'C-Level Ready'],
    colors: {
      primary: '#2c3e50',
      secondary: '#34495e',
      background: '#ecf0f1'
    },
    preview: {
      thumbnail: '/assets/images/templates/orcus/thumbnail.png',
      image: '/assets/images/templates/orcus/preview.png'
    }
  },
  {
    id: 'varuna',
    name: 'Varuna',
    planet: 'The Modern Innovator',
    description: 'Contemporary design with innovative elements. Perfect for tech and startup environments.',
    category: 'modern',
    cssClass: 'resume-placeholder-4',
    cssFile: 'placeholder-resume-4.css',
    isPremium: true,
    features: ['Modern Design', 'Innovative', 'Tech Focus', 'Startup Ready'],
    colors: {
      primary: '#e74c3c',
      secondary: '#c0392b',
      background: '#ffffff'
    },
    preview: {
      thumbnail: '/assets/images/templates/varuna/thumbnail.png',
      image: '/assets/images/templates/varuna/preview.png'
    }
  },
  {
    id: 'gonggong',
    name: 'Gonggong',
    planet: 'The Creative Catalyst',
    description: 'Dynamic creative template with bold elements. Ideal for designers and creative directors.',
    category: 'creative',
    cssClass: 'resume-placeholder-5',
    cssFile: 'placeholder-resume-5.css',
    isPremium: true,
    features: ['Creative Focus', 'Dynamic Design', 'Bold Elements', 'Designer Ready'],
    colors: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      background: '#f8f9fa'
    },
    preview: {
      thumbnail: '/assets/images/templates/gonggong/thumbnail.png',
      image: '/assets/images/templates/gonggong/preview.png'
    }
  }
];

export function getTemplateById(id: string): PlanetTemplate | undefined {
  return PLANET_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): PlanetTemplate[] {
  return PLANET_TEMPLATES.filter(template => template.category === category);
}

export function getFreeTemplates(): PlanetTemplate[] {
  return PLANET_TEMPLATES.filter(template => !template.isPremium);
}

export function getPremiumTemplates(): PlanetTemplate[] {
  return PLANET_TEMPLATES.filter(template => template.isPremium);
}

export function getAllPlanetTemplates(): PlanetTemplate[] {
  return PLANET_TEMPLATES;
}