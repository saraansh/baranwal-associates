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

// Sample project data
export const projectsData: Project[] = [
  {
    id: 1,
    title: 'Modern Residential Villa',
    category: 'Residential',
    location: 'Mumbai, Maharashtra',
    year: '2023',
    client: 'Private Client',
    shortDescription: 'A stunning contemporary villa featuring sustainable design principles and luxury living spaces...',
    fullDescription: 'This exceptional residential project showcases our commitment to sustainable luxury living. The villa features innovative architectural elements including solar panels, rainwater harvesting, and natural ventilation systems. The design seamlessly integrates indoor and outdoor spaces, creating a harmonious living environment that connects residents with nature while providing all modern amenities.',
    images: ['/assets/projects/modern-villa-1.jpg', '/assets/projects/modern-villa-2.jpg', '/assets/projects/modern-villa-3.jpg'],
    area: '4,500 sq ft',
    duration: '18 months',
    status: 'Completed',
  },
  {
    id: 2,
    title: 'Corporate Headquarters',
    category: 'Commercial',
    location: 'Pune, Maharashtra',
    year: '2023',
    client: 'Tech Solutions Pvt Ltd',
    shortDescription: 'A state-of-the-art corporate building designed for productivity and employee well-being...',
    fullDescription: 'This innovative corporate headquarters redefines modern workspace design. Featuring open collaborative spaces, private work pods, recreational areas, and advanced technology integration. The building incorporates green building principles with LEED certification, natural lighting, and energy-efficient systems that reduce operational costs while enhancing employee productivity and satisfaction.',
    images: ['/assets/projects/corporate-hq-1.jpg', '/assets/projects/corporate-hq-2.jpg', '/assets/projects/corporate-hq-3.jpg'],
    area: '50,000 sq ft',
    duration: '24 months',
    status: 'Completed',
  },
  {
    id: 3,
    title: 'Heritage Hotel Restoration',
    category: 'Hospitality',
    location: 'Jaipur, Rajasthan',
    year: '2022',
    client: 'Heritage Hotels Group',
    shortDescription: 'Careful restoration of a historic palace converted into a luxury boutique hotel...',
    fullDescription: 'This challenging restoration project involved converting a 200-year-old palace into a luxury boutique hotel while preserving its historical significance and architectural integrity. Our team worked closely with heritage conservation experts to restore original frescoes, intricate stone carvings, and traditional architectural elements while integrating modern hospitality amenities and safety systems.',
    images: ['/assets/projects/heritage-hotel-1.jpg', '/assets/projects/heritage-hotel-2.jpg', '/assets/projects/heritage-hotel-3.jpg'],
    area: '25,000 sq ft',
    duration: '30 months',
    status: 'Completed',
  },
  {
    id: 4,
    title: 'Educational Campus',
    category: 'Educational',
    location: 'Bangalore, Karnataka',
    year: '2023',
    client: 'Progressive Education Trust',
    shortDescription: 'A modern educational campus designed to foster learning and creativity...',
    fullDescription: 'This comprehensive educational campus project includes multiple academic buildings, laboratories, libraries, recreational facilities, and residential quarters. The design emphasizes creating inspiring learning environments with flexible classroom spaces, collaborative zones, and outdoor learning areas. Sustainable features include solar power generation, waste management systems, and water conservation measures.',
    images: ['/assets/projects/educational-campus-1.jpg', '/assets/projects/educational-campus-2.jpg', '/assets/projects/educational-campus-3.jpg'],
    area: '100,000 sq ft',
    duration: '36 months',
    status: 'Under Construction',
  },
  {
    id: 5,
    title: 'Luxury Apartment Complex',
    category: 'Residential',
    location: 'Delhi, NCR',
    year: '2022',
    client: 'Premium Living Developers',
    shortDescription: 'High-end apartment complex with premium amenities and modern design...',
    fullDescription: 'This luxury residential complex features 200 premium apartments across multiple towers with world-class amenities including swimming pools, fitness centers, landscaped gardens, and community spaces. The design emphasizes natural light, ventilation, and panoramic city views while incorporating smart home technologies and sustainable building practices for modern urban living.',
    images: ['/assets/projects/luxury-apartments-1.jpg', '/assets/projects/luxury-apartments-2.jpg', '/assets/projects/luxury-apartments-3.jpg'],
    area: '300,000 sq ft',
    duration: '42 months',
    status: 'Completed',
  },
  {
    id: 6,
    title: 'Medical Center Complex',
    category: 'Healthcare',
    location: 'Chennai, Tamil Nadu',
    year: '2023',
    client: 'HealthCare Solutions',
    shortDescription: 'State-of-the-art medical facility designed for patient comfort and operational efficiency...',
    fullDescription: 'This comprehensive medical center includes specialized treatment areas, diagnostic facilities, surgical suites, and patient recovery spaces. The design prioritizes patient comfort, privacy, and accessibility while ensuring efficient workflow for medical staff. Advanced HVAC systems, specialized lighting, and infection control measures create a safe and healing environment for patients and healthcare professionals.',
    images: ['/assets/projects/medical-center-1.jpg', '/assets/projects/medical-center-2.jpg', '/assets/projects/medical-center-3.jpg'],
    area: '75,000 sq ft',
    duration: '28 months',
    status: 'Completed',
  },
  {
    id: 7,
    title: 'Shopping Mall & Entertainment',
    category: 'Commercial',
    location: 'Hyderabad, Telangana',
    year: '2024',
    client: 'Retail Ventures Ltd',
    shortDescription: 'Modern shopping and entertainment complex with innovative retail spaces...',
    fullDescription: 'This dynamic shopping and entertainment complex combines retail spaces, restaurants, cinema, and recreational facilities under one roof. The design creates an engaging customer experience with natural lighting, comfortable circulation areas, and flexible retail spaces. Sustainable features include energy-efficient lighting, waste management systems, and green roof gardens that enhance the urban environment.',
    images: ['/assets/projects/shopping-mall-1.jpg', '/assets/projects/shopping-mall-2.jpg', '/assets/projects/shopping-mall-3.jpg'],
    area: '200,000 sq ft',
    duration: '48 months',
    status: 'Under Construction',
  },
  {
    id: 8,
    title: 'Sustainable Housing Project',
    category: 'Residential',
    location: 'Goa',
    year: '2024',
    client: 'Green Living Society',
    shortDescription: 'Eco-friendly housing development focused on sustainable living practices...',
    fullDescription: 'This innovative housing project demonstrates our commitment to environmental sustainability and community living. Features include passive solar design, rainwater harvesting, organic waste management, renewable energy systems, and community gardens. The development creates a self-sufficient eco-community that minimizes environmental impact while providing comfortable, affordable housing for families.',
    images: ['/assets/projects/sustainable-housing-1.jpg', '/assets/projects/sustainable-housing-2.jpg', '/assets/projects/sustainable-housing-3.jpg'],
    area: '150,000 sq ft',
    duration: '40 months',
    status: 'Planning',
  },
];
