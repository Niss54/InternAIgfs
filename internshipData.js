/**
 * internshipData.js
 * Dummy internship listings for testing smart matching system
 */

const dummyInternships = [
    // Web Development (10)
    {
        id: 'int001',
        title: 'Web Developer Intern',
        company: 'Tech Solutions Pvt Ltd',
        category: 'Software Development',
        domain: 'Web Development',
        location: 'Bangalore',
        stipend: 15000,
        duration: '3 months',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
        educationRequired: 'Undergraduate',
        description: 'Build responsive web applications using modern frameworks',
        positions: 5
    },
    {
        id: 'int002',
        title: 'Frontend Developer Intern',
        company: 'Digital Innovations',
        category: 'Software Development',
        domain: 'Web Development',
        location: 'Mumbai',
        stipend: 12000,
        duration: '6 months',
        requiredSkills: ['React', 'JavaScript', 'CSS', 'HTML'],
        educationRequired: 'Undergraduate',
        description: 'Create beautiful user interfaces for web applications',
        positions: 3
    },
    {
        id: 'int003',
        title: 'Full Stack Developer Intern',
        company: 'StartupHub',
        category: 'Software Development',
        domain: 'Web Development',
        location: 'Pune',
        stipend: 18000,
        duration: '6 months',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        educationRequired: 'Undergraduate',
        description: 'Work on both frontend and backend development',
        positions: 2
    },
    {
        id: 'int004',
        title: 'Backend Developer Intern',
        company: 'CloudTech Solutions',
        category: 'Software Development',
        domain: 'Web Development',
        location: 'Hyderabad',
        stipend: 16000,
        duration: '4 months',
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
        educationRequired: 'Undergraduate',
        description: 'Build scalable backend APIs and services',
        positions: 4
    },
    {
        id: 'int005',
        title: 'WordPress Developer Intern',
        company: 'Creative Agency',
        category: 'Web Development',
        domain: 'Web Development',
        location: 'Delhi',
        stipend: 10000,
        duration: '3 months',
        requiredSkills: ['WordPress', 'PHP', 'HTML', 'CSS'],
        educationRequired: 'Undergraduate',
        description: 'Create and customize WordPress websites',
        positions: 3
    },
    {
        id: 'int006',
        title: 'React Developer Intern',
        company: 'NextGen Apps',
        category: 'Software Development',
        domain: 'Web Development',
        location: 'Bangalore',
        stipend: 20000,
        duration: '6 months',
        requiredSkills: ['React', 'Redux', 'JavaScript', 'TypeScript'],
        educationRequired: 'Undergraduate',
        description: 'Build modern React applications with TypeScript',
        positions: 2
    },
    {
        id: 'int007',
        title: 'MERN Stack Intern',
        company: 'WebCraft Studios',
        category: 'Software Development',
        domain: 'Web Development',
        location: 'Chennai',
        stipend: 17000,
        duration: '5 months',
        requiredSkills: ['MongoDB', 'Express', 'React', 'Node.js'],
        educationRequired: 'Undergraduate',
        description: 'Full stack development using MERN stack',
        positions: 3
    },
    {
        id: 'int008',
        title: 'UI/UX Developer Intern',
        company: 'DesignFirst',
        category: 'Design',
        domain: 'Web Development',
        location: 'Noida',
        stipend: 14000,
        duration: '4 months',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Figma'],
        educationRequired: 'Undergraduate',
        description: 'Design and develop user interfaces',
        positions: 4
    },
    {
        id: 'int009',
        title: 'Angular Developer Intern',
        company: 'Enterprise Solutions',
        category: 'Software Development',
        domain: 'Web Development',
        location: 'Gurgaon',
        stipend: 15000,
        duration: '6 months',
        requiredSkills: ['Angular', 'TypeScript', 'JavaScript', 'HTML'],
        educationRequired: 'Undergraduate',
        description: 'Build enterprise applications with Angular',
        positions: 2
    },
    {
        id: 'int010',
        title: 'Next.js Developer Intern',
        company: 'Modern Web Co',
        category: 'Software Development',
        domain: 'Web Development',
        location: 'Remote',
        stipend: 22000,
        duration: '6 months',
        requiredSkills: ['Next.js', 'React', 'TypeScript', 'Node.js'],
        educationRequired: 'Undergraduate',
        description: 'Build server-side rendered React applications',
        positions: 2
    },

    // Data Science & ML (7)
    {
        id: 'int011',
        title: 'Data Science Intern',
        company: 'AI Labs',
        category: 'Data Science',
        domain: 'Data Analysis',
        location: 'Bangalore',
        stipend: 20000,
        duration: '6 months',
        requiredSkills: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
        educationRequired: 'Undergraduate',
        description: 'Work on data analysis and ML projects',
        positions: 3
    },
    {
        id: 'int012',
        title: 'Machine Learning Intern',
        company: 'DeepTech AI',
        category: 'Machine Learning',
        domain: 'AI',
        location: 'Hyderabad',
        stipend: 25000,
        duration: '6 months',
        requiredSkills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning'],
        educationRequired: 'Graduate',
        description: 'Build and deploy ML models',
        positions: 2
    },
    {
        id: 'int013',
        title: 'Data Analyst Intern',
        company: 'Analytics Pro',
        category: 'Data Science',
        domain: 'Data Analysis',
        location: 'Mumbai',
        stipend: 18000,
        duration: '4 months',
        requiredSkills: ['Python', 'SQL', 'Excel', 'Data Analysis'],
        educationRequired: 'Undergraduate',
        description: 'Analyze business data and create reports',
        positions: 4
    },
    {
        id: 'int014',
        title: 'AI/ML Research Intern',
        company: 'Research Labs India',
        category: 'Research',
        domain: 'AI',
        location: 'Bangalore',
        stipend: 30000,
        duration: '6 months',
        requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'Research'],
        educationRequired: 'Graduate',
        description: 'Conduct research in AI and ML',
        positions: 1
    },
    {
        id: 'int015',
        title: 'Business Analyst Intern',
        company: 'ConsultPro',
        category: 'Business Analytics',
        domain: 'Data Analysis',
        location: 'Delhi',
        stipend: 16000,
        duration: '5 months',
        requiredSkills: ['Excel', 'SQL', 'Data Analysis', 'PowerPoint'],
        educationRequired: 'Undergraduate',
        description: 'Analyze business metrics and create presentations',
        positions: 3
    },
    {
        id: 'int016',
        title: 'Computer Vision Intern',
        company: 'Vision AI',
        category: 'Machine Learning',
        domain: 'AI',
        location: 'Pune',
        stipend: 28000,
        duration: '6 months',
        requiredSkills: ['Python', 'OpenCV', 'Deep Learning', 'TensorFlow'],
        educationRequired: 'Graduate',
        description: 'Work on computer vision projects',
        positions: 2
    },
    {
        id: 'int017',
        title: 'NLP Engineer Intern',
        company: 'Language AI',
        category: 'Machine Learning',
        domain: 'AI',
        location: 'Bangalore',
        stipend: 27000,
        duration: '6 months',
        requiredSkills: ['Python', 'NLP', 'Machine Learning', 'Deep Learning'],
        educationRequired: 'Graduate',
        description: 'Build natural language processing models',
        positions: 2
    },

    // Mobile Development (5)
    {
        id: 'int018',
        title: 'Android Developer Intern',
        company: 'MobileApps Inc',
        category: 'Mobile Development',
        domain: 'App Development',
        location: 'Noida',
        stipend: 16000,
        duration: '5 months',
        requiredSkills: ['Java', 'Kotlin', 'Android', 'XML'],
        educationRequired: 'Undergraduate',
        description: 'Develop native Android applications',
        positions: 3
    },
    {
        id: 'int019',
        title: 'iOS Developer Intern',
        company: 'AppleDevs',
        category: 'Mobile Development',
        domain: 'App Development',
        location: 'Bangalore',
        stipend: 18000,
        duration: '6 months',
        requiredSkills: ['Swift', 'iOS', 'Xcode', 'SwiftUI'],
        educationRequired: 'Undergraduate',
        description: 'Build iOS apps using Swift',
        positions: 2
    },
    {
        id: 'int020',
        title: 'React Native Developer Intern',
        company: 'CrossPlatform Apps',
        category: 'Mobile Development',
        domain: 'App Development',
        location: 'Mumbai',
        stipend: 17000,
        duration: '5 months',
        requiredSkills: ['React Native', 'JavaScript', 'React', 'Mobile Development'],
        educationRequired: 'Undergraduate',
        description: 'Build cross-platform mobile apps',
        positions: 3
    },
    {
        id: 'int021',
        title: 'Flutter Developer Intern',
        company: 'FlutterPro',
        category: 'Mobile Development',
        domain: 'App Development',
        location: 'Hyderabad',
        stipend: 19000,
        duration: '6 months',
        requiredSkills: ['Flutter', 'Dart', 'Mobile Development', 'Firebase'],
        educationRequired: 'Undergraduate',
        description: 'Create beautiful mobile apps with Flutter',
        positions: 2
    },
    {
        id: 'int022',
        title: 'Mobile App Testing Intern',
        company: 'QualityFirst',
        category: 'Testing',
        domain: 'Mobile Development',
        location: 'Pune',
        stipend: 12000,
        duration: '4 months',
        requiredSkills: ['Testing', 'Mobile Testing', 'Android', 'iOS'],
        educationRequired: 'Undergraduate',
        description: 'Test mobile applications for bugs and issues',
        positions: 4
    },

    // Marketing & Business (4)
    {
        id: 'int023',
        title: 'Digital Marketing Intern',
        company: 'MarketGuru',
        category: 'Marketing',
        domain: 'Digital Marketing',
        location: 'Delhi',
        stipend: 10000,
        duration: '3 months',
        requiredSkills: ['SEO', 'Social Media', 'Content Writing', 'Google Ads'],
        educationRequired: 'Undergraduate',
        description: 'Execute digital marketing campaigns',
        positions: 5
    },
    {
        id: 'int024',
        title: 'Content Writing Intern',
        company: 'ContentPro',
        category: 'Content',
        domain: 'Marketing',
        location: 'Remote',
        stipend: 8000,
        duration: '3 months',
        requiredSkills: ['Content Writing', 'SEO', 'Research', 'Blogging'],
        educationRequired: 'Undergraduate',
        description: 'Write engaging content for websites and blogs',
        positions: 6
    },
    {
        id: 'int025',
        title: 'Social Media Marketing Intern',
        company: 'SocialBoost',
        category: 'Marketing',
        domain: 'Social Media',
        location: 'Mumbai',
        stipend: 9000,
        duration: '4 months',
        requiredSkills: ['Social Media', 'Content Creation', 'Instagram', 'Facebook'],
        educationRequired: 'Undergraduate',
        description: 'Manage social media accounts and campaigns',
        positions: 4
    },
    {
        id: 'int026',
        title: 'MBA Marketing Intern',
        company: 'BizConsult',
        category: 'Business',
        domain: 'Marketing',
        location: 'Bangalore',
        stipend: 15000,
        duration: '6 months',
        requiredSkills: ['Marketing', 'Business Strategy', 'Market Research', 'MBA'],
        educationRequired: 'Graduate',
        description: 'Work on marketing strategy and execution',
        positions: 2
    },

    // Others (4)
    {
        id: 'int027',
        title: 'Graphic Designer Intern',
        company: 'CreativeMinds',
        category: 'Design',
        domain: 'Graphic Design',
        location: 'Jaipur',
        stipend: 11000,
        duration: '4 months',
        requiredSkills: ['Photoshop', 'Illustrator', 'Figma', 'Design'],
        educationRequired: 'Undergraduate',
        description: 'Create visual designs for digital and print media',
        positions: 3
    },
    {
        id: 'int028',
        title: 'HR Intern',
        company: 'TalentHub',
        category: 'Human Resources',
        domain: 'HR',
        location: 'Noida',
        stipend: 10000,
        duration: '3 months',
        requiredSkills: ['HR', 'Recruitment', 'Communication', 'Excel'],
        educationRequired: 'Undergraduate',
        description: 'Assist in recruitment and HR operations',
        positions: 4
    },
    {
        id: 'int029',
        title: 'Finance Intern',
        company: 'FinCorp',
        category: 'Finance',
        domain: 'Finance',
        location: 'Mumbai',
        stipend: 12000,
        duration: '5 months',
        requiredSkills: ['Finance', 'Excel', 'Accounting', 'Financial Analysis'],
        educationRequired: 'Undergraduate',
        description: 'Work on financial analysis and reporting',
        positions: 3
    },
    {
        id: 'int030',
        title: 'Cybersecurity Intern',
        company: 'SecureNet',
        category: 'Security',
        domain: 'Cybersecurity',
        location: 'Bangalore',
        stipend: 20000,
        duration: '6 months',
        requiredSkills: ['Cybersecurity', 'Network Security', 'Linux', 'Python'],
        educationRequired: 'Undergraduate',
        description: 'Learn and implement cybersecurity practices',
        positions: 2
    }
];

// Helper function to get all internships
function getAllInternships() {
    return dummyInternships;
}

// Helper function to get internship by ID
function getInternshipById(id) {
    return dummyInternships.find(internship => internship.id === id);
}

// Helper function to filter internships by category
function getInternshipsByCategory(category) {
    return dummyInternships.filter(internship => internship.category === category);
}

// Export for use in other files
export const internshipData = {
    getAllInternships,
    getInternshipById,
    getInternshipsByCategory,
    internships: dummyInternships
};

// Also export for window global access
if (typeof window !== 'undefined') {
    window.internshipData = {
        getAllInternships,
        getInternshipById,
        getInternshipsByCategory,
        internships: dummyInternships
    };
}
