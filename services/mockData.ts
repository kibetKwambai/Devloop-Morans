
import { JobSeekerProfile, VerificationStatus, WorkExperience, Education, Skill, SubscriptionPlan } from '../types';

// --- DATA LIBRARIES ---

const firstNames = {
    male: ['James', 'John', 'Peter', 'David', 'Joseph', 'Samuel', 'Michael', 'Paul', 'Daniel', 'Brian', 'Kevin', 'Ian', 'Dennis', 'Alex', 'Chris', 'Martin', 'Collins', 'Antony', 'Felix', 'Geoffrey', 'Stephen', 'Edwin', 'Victor', 'Eric', 'Evans', 'Ian', 'Charles', 'Mark'],
    female: ['Mary', 'Jane', 'Grace', 'Faith', 'Esther', 'Mercy', 'Ann', 'Catherine', 'Maureen', 'Winnie', 'Brenda', 'Sharon', 'Cynthia', 'Lilian', 'Nancy', 'Caroline', 'Beatrice', 'Alice', 'Christine', 'Margaret', 'Irene', 'Gladys', 'Rose', 'Elizabeth', 'Vivian', 'Michelle', 'Stella']
};

const lastNames = ['Mwangi', 'Otieno', 'Kariuki', 'Ochieng', 'Kimani', 'Wanjala', 'Njoroge', 'Kamau', 'Owuor', 'Maina', 'Wafula', 'Musyoka', 'Ouma', 'Kiprotich', 'Njeri', 'Omondi', 'Mutua', 'Onyango', 'Waweru', 'Koech', 'Kinyua', 'Akinyi', 'Chepkoech', 'Mutiso', 'Kipkirui', 'Wambui', 'Achieng', 'Cheruiyot', 'Langat', 'Adhiambo', 'Muthoni', 'Kibet', 'Njuguna', 'Munyao', 'Wairimu', 'Anyango', 'Kiptoo', 'Ngigi', 'Juma', 'Karanja'];

const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Machakos', 'Meru', 'Kakamega', 'Naivasha', 'Kericho'];

const skillsLibrary: { [category: string]: string[] } = {
    "Technology": ["JavaScript", "Python", "Java", "C#", "PHP", "C++", "TypeScript", "Swift", "Kotlin", "Go", "Ruby", "Rust", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot", ".NET Core", "Laravel", "Ruby on Rails", "HTML5", "CSS3", "Sass", "Tailwind CSS", "Bootstrap", "REST APIs", "GraphQL", "Docker", "Kubernetes", "Git", "Jenkins", "CI/CD", "Terraform", "Ansible", "AWS", "Azure", "Google Cloud Platform", "Linux", "Windows Server", "Cybersecurity", "Penetration Testing", "Machine Learning", "TensorFlow", "PyTorch", "Data Analysis", "Pandas", "NumPy", "Scikit-learn", "Big Data", "Hadoop", "Spark", "Power BI", "Tableau", "Qlik Sense"],
    "Business & Management": ["Project Management", "Agile Methodologies", "Scrum", "Product Management", "Business Analysis", "Financial Modeling", "Risk Management", "Business Development", "Sales", "Lead Generation", "CRM (Salesforce)", "Market Research", "Strategic Planning", "Operations Management", "Supply Chain", "Logistics", "Human Resources", "Talent Acquisition", "Performance Management", "Public Speaking", "Negotiation", "Leadership", "Team Management"],
    "Creative & Design": ["UI/UX Design", "Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping", "Graphic Design", "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Video Editing", "Adobe Premiere Pro", "Final Cut Pro", "Motion Graphics", "After Effects", "Content Writing", "Copywriting", "SEO", "SEM", "Content Strategy", "Brand Management", "Photography", "Illustration", "3D Modeling", "Blender"],
    "Communication & Soft Skills": ["Verbal Communication", "Written Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Adaptability", "Time Management", "Emotional Intelligence", "Conflict Resolution", "Client Relations", "Stakeholder Management", "Presentation Skills"],
    "Aviation": ["Commercial Pilot License (CPL)", "Private Pilot License (PPL)", "Airline Transport Pilot License (ATPL)", "Multi-Engine Rating (ME)", "Instrument Rating (IR)", "KCAA B1.1 (Turbine Engines)", "KCAA B1.2 (Piston Engines)", "KCAA B2 (Avionics)", "Flight Operations Management", "Flight Dispatch License", "Cabin Crew Certification", "Air Traffic Control", "Aviation Safety Management (SMS)", "Drone Pilot License (RPL)"],
    "Other Industries": ["Mechanical Engineering", "AutoCAD", "SolidWorks", "Electrical Engineering", "Civil Engineering", "Healthcare Management", "Customer Service", "Technical Support", "Quality Assurance", "Manual Testing", "Automated Testing", "Selenium", "Cypress", "Legal Research", "Contract Law", "Digital Marketing", "Social Media Marketing", "Email Marketing"]
};

const jobTitlesByIndustry = {
    "Technology": ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer", "DevOps Engineer", "Cloud Solutions Architect", "Data Scientist", "Data Analyst", "Database Administrator", "QA Engineer", "IT Support Specialist", "Cybersecurity Analyst", "Systems Administrator"],
    "Business & Management": ["Project Manager", "Product Manager", "Business Analyst", "Operations Manager", "Sales Executive", "Marketing Manager", "HR Generalist", "Financial Analyst", "Accountant", "Management Consultant"],
    "Creative & Design": ["UI/UX Designer", "Graphic Designer", "Content Strategist", "Digital Marketer", "Video Editor", "Copywriter", "Social Media Manager", "Brand Manager"],
    "Aviation": ["Commercial Pilot", "First Officer", "Captain", "Aircraft Maintenance Engineer (AME)", "Flight Operations Officer", "Flight Dispatcher", "Cabin Crew Member", "Aviation Safety Officer", "Drone Pilot", "Flight Instructor"]
};

const companies = ['Safaricom PLC', 'KCB Group', 'Equity Bank', 'Co-operative Bank', 'East African Breweries', 'Cellulant', 'Africa\'s Talking', 'Twiga Foods', 'Sendy', 'Lori Systems', 'Andela', 'Gebeya Inc.', 'M-KOPA Solar', 'BRCK', 'iHub Nairobi', 'Ushahidi', 'Craft Silicon', 'Pesapal', 'Kenya Power', 'KenGen', 'Britam', 'Jubilee Insurance', 'ICEA LION Group', 'Nation Media Group', 'Standard Group', 'Kenya Airways', 'Safarilink Aviation', 'Fly540', 'AMREF Flying Doctors', 'Tropic Air Kenya', 'Phoenix Aviation'];
const institutions = ['University of Nairobi', 'Kenyatta University', 'Jomo Kenyatta University of Agriculture and Technology', 'Moi University', 'Egerton University', 'Maseno University', 'Strathmore University', 'United States International University Africa', 'Daystar University', 'Mount Kenya University', 'Technical University of Kenya', 'Kabarak University', 'Kenya School of Flying', 'Ninety-Nines Flying School', 'East African School of Aviation'];
const degrees = ['Bachelor of Science', 'Bachelor of Arts', 'Bachelor of Commerce', 'Bachelor of Business Administration', 'Master of Science', 'Master of Business Administration', 'Diploma', 'Professional License'];
const fieldsOfStudy = ['Computer Science', 'Information Technology', 'Software Engineering', 'Business Information Technology', 'Electrical and Electronic Engineering', 'Telecommunications', 'Economics', 'Finance', 'Accounting', 'Marketing', 'Human Resource Management', 'Journalism and Media Studies', 'Design', 'International Relations', 'Aeronautical Engineering', 'Aviation Management'];

// --- HELPER FUNCTIONS ---

const tribes = ['Kikuyu', 'Luhya', 'Kalenjin', 'Luo', 'Kamba', 'Kisii', 'Meru', 'Mijikenda', 'Maasai', 'Turkana', 'Samburu'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const healthConditions = ['None', 'Asthma', 'Mild Allergies', 'None', 'None', 'None'];
const jobInterests = ['Remote Work', 'Full-time', 'Contract', 'Part-time', 'Internship', 'Consultancy'];
const languages = ['English', 'Swahili', 'French', 'German', 'Chinese', 'Spanish'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateWorkExperience = (count: number, industryKey: keyof typeof jobTitlesByIndustry = 'Technology'): WorkExperience[] => {
    const experiences: WorkExperience[] = [];
    let currentYear = new Date().getFullYear();
    let isPresent = true;

    for (let i = 0; i < count; i++) {
        const industry = industryKey;
        const title = getRandomElement(jobTitlesByIndustry[industry]);
        const startYear = currentYear - getRandomNumber(1, 3);
        const endYear = isPresent ? 'Present' : currentYear;
        const responsibilities = [
            `Developed and maintained ${getRandomElement(['web applications', 'mobile applications', 'backend services'])} using ${getRandomElement(skillsLibrary.Technology)}.`,
            `Collaborated with cross-functional teams including ${getRandomElement(['designers', 'product managers', 'stakeholders'])} to deliver high-quality products.`,
            `Participated in the full software development lifecycle, from concept and design to testing and deployment.`,
            `Resolved critical bugs and improved application performance by over ${getRandomNumber(10, 25)}%.`
        ];

        experiences.push({
            id: `exp_${i}_${Date.now()}_${Math.random()}`,
            title,
            company: getRandomElement(companies),
            location: getRandomElement(locations),
            startDate: `Jan ${startYear}`,
            endDate: String(endYear),
            description: `Key member of the ${industry} team, responsible for driving innovation and delivering robust solutions.`,
            responsibilities,
            isVerified: Math.random() < 0.7, // 70% chance of being verified for mock data
        });
        
        isPresent = false;
        currentYear = startYear - 1;
    }
    return experiences;
};

const generateEducation = (count: number): Education[] => {
    const educations: Education[] = [];
    let endYear = new Date().getFullYear() - getRandomNumber(3, 6);

    for (let i = 0; i < count; i++) {
        const startYear = endYear - getRandomNumber(2, 4);
        educations.push({
            id: `edu_${i}_${Date.now()}_${Math.random()}`,
            institution: getRandomElement(institutions),
            degree: getRandomElement(degrees),
            fieldOfStudy: getRandomElement(fieldsOfStudy),
            startDate: `Sep ${startYear}`,
            endDate: `May ${endYear}`,
        });
        endYear = startYear - 1;
    }
    return educations;
};

const generateSkills = (count: number, industryKey: keyof typeof skillsLibrary = 'Technology'): Skill[] => {
    const skills: Skill[] = [];
    const skillPool = skillsLibrary[industryKey] || Object.values(skillsLibrary).flat();
    const softSkillPool = skillsLibrary["Communication & Soft Skills"];
    const skillSet = new Set<string>();

    // Add some hard skills
    while (skillSet.size < Math.floor(count * 0.7) && skillSet.size < skillPool.length) {
        skillSet.add(getRandomElement(skillPool));
    }
    
    // Add some soft skills
    while (skillSet.size < count && skillSet.size < (skillPool.length + softSkillPool.length)) {
        skillSet.add(getRandomElement(softSkillPool));
    }

    Array.from(skillSet).forEach((skillName, i) => {
        const isSoft = softSkillPool.includes(skillName);
        skills.push({ 
            id: `skill_${i}_${Date.now()}_${Math.random()}`, 
            name: skillName,
            type: isSoft ? 'Soft' : 'Hard'
        });
    });

    return skills;
};

// --- PROFILE GENERATION ---
const profiles: JobSeekerProfile[] = [];
const statuses = [VerificationStatus.VERIFIED, VerificationStatus.PENDING, VerificationStatus.REJECTED, VerificationStatus.DRAFT];

for (let i = 1; i <= 105; i++) {
    const gender = getRandomElement(['male', 'female']);
    const name = `${getRandomElement(firstNames[gender])} ${getRandomElement(lastNames)}`;
    const emailName = name.toLowerCase().replace(' ', '.');
    const jobTitle = getRandomElement(jobTitlesByIndustry.Technology);
    const status = getRandomElement(statuses);
    
    let profile: JobSeekerProfile = {
        id: `usr_${String(i).padStart(5, '0')}`,
        name: name,
        email: `${emailName}${i}@example.com`,
        phone: `+254 7${getRandomNumber(10, 99)} ${getRandomNumber(100, 999)} ${getRandomNumber(100, 999)}`,
        location: getRandomElement(locations),
        headline: `${jobTitle} | ${getRandomElement(skillsLibrary.Technology).split(' ')[0]} Specialist`,
        photoUrl: `https://i.pravatar.cc/200?u=user${i}`,
        linkedinUrl: `https://linkedin.com/in/${emailName}`,
        jobInterests: [getRandomElement(jobInterests), getRandomElement(jobInterests)],
        verificationStatus: status,
        workExperience: generateWorkExperience(getRandomNumber(2, 4)),
        education: generateEducation(getRandomNumber(1, 2)),
        skills: generateSkills(getRandomNumber(6, 12)),
        personalInfo: {
            bloodGroup: getRandomElement(bloodGroups),
            tribe: getRandomElement(tribes),
            height: `${getRandomNumber(150, 195)}cm`,
            weight: `${getRandomNumber(50, 100)}kg`,
            bmi: parseFloat((getRandomNumber(180, 300) / 10).toFixed(1))
        },
        healthInfo: {
            condition: getRandomElement(healthConditions)
        },
        legalInfo: {
            hasCriminalRecord: Math.random() < 0.05,
            policeClearanceUrl: '#',
            securityClearanceLevel: Math.random() < 0.2 ? 'Level 1' : 'None'
        },
        documents: [{ id: `doc_${i}`, name: `${name.replace(' ', '_')}_CV.pdf`, type: 'CV', url: '#', uploadedAt: '2023-11-15' }],
        certifications: [],
        languages: [getRandomElement(languages), 'English'],
        isShortlisted: Math.random() < 0.15, // 15% chance of being shortlisted
    };

    if (status === VerificationStatus.REJECTED) {
        profile.rejectionReason = 'Uploaded identification documents were unclear. Please re-upload a clearer copy.';
    }
    
    // Ensure we have a consistent user for the "logged in" demo
    if (i === 1) {
        profile.id = 'usr_00001';
        profile.name = 'Amani Wanjiku';
        profile.email = 'amani.wanjiku@example.com';
        profile.headline = 'Aspiring Frontend Developer | React & UI/UX Enthusiast';
        profile.verificationStatus = VerificationStatus.DRAFT;
        profile.workExperience = [{
            id: 'exp_demo_1',
            title: 'IT Intern',
            company: 'Kenya Ports Authority',
            location: 'Mombasa',
            startDate: 'Jun 2023',
            endDate: 'Sep 2023',
            description: 'Assisted the IT department with network troubleshooting, hardware maintenance, and user support.',
            responsibilities: ['Provided Tier 1 technical support to staff', 'Assisted in the deployment of new software updates', 'Maintained inventory of IT equipment'],
            isVerified: true
        }];
        profile.skills = [
            { id: 'skill_demo_1', name: 'HTML5', type: 'Hard' },
            { id: 'skill_demo_2', name: 'CSS3', type: 'Hard' },
            { id: 'skill_demo_3', name: 'JavaScript', type: 'Hard' },
            { id: 'skill_demo_4', name: 'React', type: 'Hard' },
            { id: 'skill_demo_5', name: 'Git', type: 'Hard' }
        ];
    }

    profiles.push(profile);
}

// --- AVIATION PROFILE GENERATION ---

const aviationCompanies = ['Kenya Airways', 'Safarilink Aviation', 'Fly540', 'AMREF Flying Doctors', 'Tropic Air Kenya', 'Phoenix Aviation'];
const aviationSchools = ['Kenya School of Flying', 'Ninety-Nines Flying School', 'East African School of Aviation'];

const aviationProfiles: JobSeekerProfile[] = [];
for (let i = 1; i <= 20; i++) {
    const gender = getRandomElement(['male', 'female']);
    const name = `${getRandomElement(firstNames[gender])} ${getRandomElement(lastNames)}`;
    const emailName = name.toLowerCase().replace(' ', '.');
    const jobTitle = getRandomElement(jobTitlesByIndustry.Aviation);
    let headline = '';
    let skills: Skill[] = [];

    const basePilotSkills = ["Private Pilot License (PPL)", "Instrument Rating (IR)"];
    const advancedPilotSkills = ["Commercial Pilot License (CPL)", "Multi-Engine Rating (ME)", "Airline Transport Pilot License (ATPL)"];
    
    if (jobTitle.includes('Pilot') || jobTitle.includes('Officer') || jobTitle.includes('Captain')) {
        headline = `${jobTitle} | Type-Rated on B737`;
        skills = generateSkills(getRandomNumber(2,3), 'Aviation').concat(basePilotSkills.map((s, idx) => ({id: `pskill_${i}_${idx}`, name: s, type: 'Hard'})));
        if (jobTitle !== 'First Officer') {
            skills.push({id: `pskill_${i}_adv`, name: getRandomElement(advancedPilotSkills), type: 'Hard'});
        }
    } else if (jobTitle.includes('Maintenance')) {
        headline = 'Aircraft Maintenance Engineer | KCAA Licensed';
        const licenseType = getRandomElement(['KCAA B1.1 (Turbine Engines)', 'KCAA B1.2 (Piston Engines)', 'KCAA B2 (Avionics)']);
        skills = generateSkills(getRandomNumber(2,3), 'Aviation').concat([{id: `mskill_${i}`, name: licenseType, type: 'Hard'}]);
    } else {
        headline = `${jobTitle} at ${getRandomElement(aviationCompanies)}`;
        skills = generateSkills(getRandomNumber(4,6), 'Aviation');
    }
    
    const profile: JobSeekerProfile = {
        id: `usr_avi_${String(i).padStart(3, '0')}`,
        name,
        email: `${emailName}.avi@example.com`,
        phone: `+254 7${getRandomNumber(10, 99)} ${getRandomNumber(100, 999)} ${getRandomNumber(100, 999)}`,
        location: getRandomElement(['Nairobi', 'Mombasa']),
        headline,
        photoUrl: `https://i.pravatar.cc/200?u=user_aviation${i}`,
        linkedinUrl: `https://linkedin.com/in/${emailName}`,
        jobInterests: ['Aviation', 'Remote Work'],
        verificationStatus: VerificationStatus.VERIFIED,
        isShortlisted: Math.random() < 0.2,
        workExperience: [
            {
                id: `exp_avi_${i}_1`,
                title: jobTitle,
                company: getRandomElement(aviationCompanies),
                location: 'Nairobi',
                startDate: `Mar ${new Date().getFullYear() - getRandomNumber(2, 5)}`,
                endDate: 'Present',
                description: `Serving as a key member of the air operations team, ensuring safety and efficiency in all duties.`,
                responsibilities: [
                    'Adherence to all KCAA and company regulations.',
                    'Conducting pre-flight and post-flight inspections.',
                    'Collaborating with crew and ground staff for seamless operations.'
                ]
            },
            {
                id: `exp_avi_${i}_2`,
                title: 'Operations Assistant',
                company: getRandomElement(aviationCompanies),
                location: 'Nairobi',
                startDate: `Jan ${new Date().getFullYear() - getRandomNumber(6, 8)}`,
                endDate: `Feb ${new Date().getFullYear() - getRandomNumber(2, 5)}`,
                description: `Supported the daily operations and logistics of the flight department.`,
                responsibilities: []
            }
        ],
        education: [
            {
                id: `edu_avi_${i}`,
                institution: getRandomElement(aviationSchools),
                degree: 'Professional License',
                fieldOfStudy: jobTitle.includes('Pilot') ? 'Pilot Training' : 'Aeronautical Engineering',
                startDate: `Sep ${new Date().getFullYear() - getRandomNumber(9, 12)}`,
                endDate: `May ${new Date().getFullYear() - getRandomNumber(7, 9)}`,
            }
        ],
        skills,
        personalInfo: {
            bloodGroup: getRandomElement(bloodGroups),
            tribe: getRandomElement(tribes),
            height: `${getRandomNumber(160, 190)}cm`,
            weight: `${getRandomNumber(60, 90)}kg`,
            bmi: parseFloat((getRandomNumber(200, 260) / 10).toFixed(1))
        },
        healthInfo: {
            condition: 'Excellent'
        },
        legalInfo: {
            hasCriminalRecord: false,
            policeClearanceUrl: '#',
            securityClearanceLevel: 'High'
        },
        documents: [{ id: `doc_avi_${i}`, name: `${name.replace(' ', '_')}_CV.pdf`, type: 'CV', url: '#', uploadedAt: '2023-10-01' }],
        certifications: [],
        languages: ['English', 'Swahili'],
    };
    aviationProfiles.push(profile);
}

profiles.push(...aviationProfiles);

export const mockProfiles: JobSeekerProfile[] = profiles;

export const subscriptionPlans: SubscriptionPlan[] = [
    {
        id: 'plan_monthly',
        name: 'Monthly',
        price: { monthly: 'KES 8,500', annual: 'KES 7,083' },
        priceDetails: '/month',
        annualPrice: 'KES 85,000 billed annually',
        features: [
            'Access to all verified candidates',
            'Advanced search & filtering',
            'Save up to 50 candidate profiles',
            'Direct contact information',
            'Email support'
        ],
        ctaText: 'Get Started',
        isPopular: false,
    },
    {
        id: 'plan_annual',
        name: 'Annual',
        price: { monthly: 'KES 8,500', annual: 'KES 7,083' },
        priceDetails: '/month',
        annualPrice: 'KES 85,000 billed annually',
        features: [
            'Everything in Monthly',
            'Save up to 200 candidate profiles',
            'Priority customer support',
            'Company profile feature',
            'Usage analytics dashboard'
        ],
        ctaText: 'Choose Annual',
        isPopular: true,
    },
    {
        id: 'plan_enterprise',
        name: 'Enterprise',
        price: { monthly: 'Custom', annual: 'Custom' },
        priceDetails: '',
        annualPrice: 'Contact us for a custom plan',
        features: [
            'Everything in Annual',
            'Unlimited candidate saves',
            'Dedicated account manager',
            'API access for integration',
            'Custom onboarding & training'
        ],
        ctaText: 'Contact Sales',
        isPopular: false,
    }
];

export const jobSeekerPlans: SubscriptionPlan[] = [
    {
        id: 'js_free',
        name: 'Free',
        price: { monthly: 'KES 0', annual: 'KES 0' },
        priceDetails: '/month',
        features: [
            'Basic profile creation',
            'Upload up to 2 documents',
            'Apply to 5 jobs per month',
            'Public profile link'
        ],
        ctaText: 'Sign Up Free',
        isPopular: false,
    },
    {
        id: 'js_pro',
        name: 'Pro',
        price: { monthly: 'KES 1,500', annual: 'KES 1,250' },
        priceDetails: '/month',
        annualPrice: 'KES 15,000 billed annually',
        features: [
            'Everything in Free',
            'Unlimited job applications',
            'Priority verification review',
            'Profile analytics',
            'Featured profile status'
        ],
        ctaText: 'Go Pro',
        isPopular: true,
    },
    {
        id: 'js_premium',
        name: 'Premium',
        price: { monthly: 'KES 3,500', annual: 'KES 2,917' },
        priceDetails: '/month',
        annualPrice: 'KES 35,000 billed annually',
        features: [
            'Everything in Pro',
            'Direct messaging to employers',
            'Career coaching session',
            'Resume review service',
            'Access to exclusive webinars'
        ],
        ctaText: 'Get Premium',
        isPopular: false,
    }
];
