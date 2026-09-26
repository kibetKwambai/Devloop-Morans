
import { JobSeekerProfile, VerificationStatus, WorkExperience, Education, Skill, SubscriptionPlan, Job, Application, Notification, IndustryCategory } from '../types';

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
            bmi: parseFloat((getRandomNumber(180, 300) / 10).toFixed(1)),
            gender: gender.charAt(0).toUpperCase() + gender.slice(1),
            nationality: 'Kenyan',
            maritalStatus: getRandomElement(['Single', 'Married', 'Divorced']),
            dateOfBirth: `${getRandomNumber(1980, 2005)}-${String(getRandomNumber(1, 12)).padStart(2, '0')}-${String(getRandomNumber(1, 28)).padStart(2, '0')}`
        },
        healthInfo: {
            condition: getRandomElement(healthConditions),
            vaccinationStatus: getRandomElement(['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated']),
            lastMedicalCheckup: '2023-12-10'
        },
        legalInfo: {
            hasCriminalRecord: Math.random() < 0.05,
            policeClearanceUrl: '#',
            policeClearanceExpiry: '2024-12-15',
            securityClearanceLevel: Math.random() < 0.2 ? 'Level 1 (Secret)' : 'None',
            kRACompliance: Math.random() < 0.9,
            helbCompliance: Math.random() < 0.8
        },
        documents: [{ id: `doc_${i}`, name: `${name.replace(' ', '_')}_CV.pdf`, type: 'CV', url: '#', uploadedAt: '2023-11-15' }],
        certifications: [],
        languages: [getRandomElement(languages), 'English'],
        isShortlisted: Math.random() < 0.15, // 15% chance of being shortlisted
    };

    if (status === VerificationStatus.REJECTED) {
        profile.rejectionReason = 'Uploaded identification documents were unclear. Please re-upload a clearer copy.';
    }
    
    // Ensure we have consistent users for the test accounts
    if (i === 1) {
        profile.id = 'usr_00001';
        profile.name = 'Amani Wanjiku';
        profile.email = 'amani.wanjiku@example.com';
        profile.headline = 'Lead Cloud & AI Solutions Architect | GCP & Kubernetes';
        profile.photoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
        profile.verificationStatus = VerificationStatus.VERIFIED;
        profile.workExperience = [
            {
                id: 'exp_amani_1',
                title: 'Lead Cloud & AI Architect',
                company: 'Safaricom PLC',
                location: 'Nairobi, Kenya',
                startDate: 'Jan 2022',
                endDate: 'Present',
                description: 'Leading cloud native architectures, high-concurrency microservices, and AI models on Google Cloud Platform.',
                responsibilities: ['Architected M-PESA cloud telemetry engine', 'Mentored 18 engineers in distributed systems design', 'Engineered sub-50ms latency microservices'],
                isVerified: true
            },
            {
                id: 'exp_amani_2',
                title: 'Senior Distributed Systems Engineer',
                company: 'Andela Kenya',
                location: 'Nairobi, Kenya',
                startDate: 'Feb 2019',
                endDate: 'Dec 2021',
                description: 'Designed fault-tolerant global payment gateway integrations.',
                responsibilities: ['Deployed production Kubernetes clusters', 'Implemented automated CI/CD security scanning'],
                isVerified: true
            }
        ];
        profile.education = [
            {
                id: 'edu_amani_1',
                institution: 'University of Nairobi',
                degree: 'Bachelor of Science in Computer Science',
                fieldOfStudy: 'Computer Science & Software Systems',
                startDate: 'Sep 2014',
                endDate: 'May 2018',
                isVerified: true
            }
        ];
        profile.skills = [
            { id: 'sk_am_1', name: 'Google Cloud Platform', type: 'Hard' },
            { id: 'sk_am_2', name: 'Kubernetes', type: 'Hard' },
            { id: 'sk_am_3', name: 'TypeScript', type: 'Hard' },
            { id: 'sk_am_4', name: 'Python', type: 'Hard' },
            { id: 'sk_am_5', name: 'Distributed Systems', type: 'Hard' },
            { id: 'sk_am_6', name: 'System Architecture', type: 'Hard' },
            { id: 'sk_am_7', name: 'Executive Communication', type: 'Soft' }
        ];
    } else if (i === 3) {
        profile.id = 'usr_00003';
        profile.name = 'Faith Muthoni';
        profile.email = 'faith.muthoni@example.com';
        profile.headline = 'Fintech Product Lead & Core Banking Specialist';
        profile.photoUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
        profile.verificationStatus = VerificationStatus.VERIFIED;
        profile.workExperience = [
            {
                id: 'exp_faith_1',
                title: 'Senior Product Manager - Mobile Money',
                company: 'Cellulant Kenya',
                location: 'Nairobi, Kenya',
                startDate: 'Mar 2021',
                endDate: 'Present',
                description: 'Directing pan-African checkout API platform serving over 35 banking institutions.',
                responsibilities: ['Scaled digital merchant checkout by 140% YoY', 'Oversaw regulatory compliance with Central Bank of Kenya'],
                isVerified: true
            }
        ];
        profile.education = [
            {
                id: 'edu_faith_1',
                institution: 'Strathmore University',
                degree: 'Bachelor of Business Information Technology',
                fieldOfStudy: 'FinTech & Information Systems',
                startDate: '2015',
                endDate: '2019',
                isVerified: true
            }
        ];
        profile.skills = [
            { id: 'sk_fm_1', name: 'Product Management', type: 'Hard' },
            { id: 'sk_fm_2', name: 'Financial Modeling', type: 'Hard' },
            { id: 'sk_fm_3', name: 'Agile Scrum', type: 'Hard' },
            { id: 'sk_fm_4', name: 'Payment APIs', type: 'Hard' },
            { id: 'sk_fm_5', name: 'Strategic Planning', type: 'Soft' }
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
    
    let candName = name;
    let candEmail = `${emailName}.avi@example.com`;
    let candPhoto = `https://i.pravatar.cc/200?u=user_aviation${i}`;

    if (i === 1) {
        candName = 'Brian Kiprop';
        candEmail = 'brian.kiprop.avi@example.com';
        candPhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';
        headline = 'Senior First Officer (Boeing 737 Fleet) | KCAA ATPL Verified';
    }

    const profile: JobSeekerProfile = {
        id: `usr_avi_${String(i).padStart(3, '0')}`,
        name: candName,
        email: candEmail,
        phone: `+254 7${getRandomNumber(10, 99)} ${getRandomNumber(100, 999)} ${getRandomNumber(100, 999)}`,
        location: getRandomElement(['Nairobi', 'Mombasa']),
        headline,
        photoUrl: candPhoto,
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
            bmi: parseFloat((getRandomNumber(200, 260) / 10).toFixed(1)),
            gender: gender.charAt(0).toUpperCase() + gender.slice(1),
            nationality: 'Kenyan',
            maritalStatus: getRandomElement(['Single', 'Married']),
            dateOfBirth: `${getRandomNumber(1975, 1995)}-${String(getRandomNumber(1, 12)).padStart(2, '0')}-${String(getRandomNumber(1, 28)).padStart(2, '0')}`
        },
        healthInfo: {
            condition: 'Excellent',
            vaccinationStatus: 'Fully Vaccinated',
            lastMedicalCheckup: '2024-01-15'
        },
        legalInfo: {
            hasCriminalRecord: false,
            policeClearanceUrl: '#',
            policeClearanceExpiry: '2025-01-15',
            securityClearanceLevel: 'High (Top Secret)',
            kRACompliance: true,
            helbCompliance: true
        },
        documents: [{ id: `doc_avi_${i}`, name: `${name.replace(' ', '_')}_CV.pdf`, type: 'CV', url: '#', uploadedAt: '2023-10-01' }],
        certifications: [],
        languages: ['English', 'Swahili'],
    };
    aviationProfiles.push(profile);
}

profiles.push(...aviationProfiles);

export const mockProfiles: JobSeekerProfile[] = profiles;

// --- JOB GENERATION ---
const jobCategories = ['Technology', 'Business & Management', 'Creative & Design', 'Aviation', 'Healthcare', 'Engineering', 'Customer Service', 'Legal'];
const jobTypes: ('Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote')[] = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const expLevels: ('Entry' | 'Mid' | 'Senior' | 'Executive')[] = ['Entry', 'Mid', 'Senior', 'Executive'];

const generateJobs = (count: number): Job[] => {
    const jobs: Job[] = [];
    
    const detailedTerms = [
        "Standard employment contract as per Kenyan Labor Laws. 3 months probation period. 21 days annual leave. 15 days sick leave. Overtime compensated as per policy.",
        "Fixed-term contract for 12 months, renewable based on performance. Comprehensive health insurance provided. Confidentiality and non-disclosure agreement required.",
        "Permanent position with a 6-month probationary period. Performance reviews conducted bi-annually. Eligibility for company pension scheme after 1 year.",
        "Consultancy agreement. Payment based on project milestones. Flexible working hours. Consultant responsible for their own taxes and insurance.",
        "Internship program for 6 months. Monthly stipend provided. Opportunity for permanent placement based on performance and vacancy availability."
    ];

    const detailedLegalRights = [
        "Equal opportunity employer. Protection against discrimination as per the Constitution of Kenya and International Labor Organization (ILO) standards. Right to fair labor practices.",
        "Adherence to the Employment Act, 2007. Right to a safe and healthy working environment. Protection of personal data as per the Data Protection Act, 2019.",
        "Compliance with international human rights standards. Right to join a trade union. Protection against arbitrary dismissal and right to due process.",
        "VerifiedHire ensures all employers comply with minimum wage regulations. Candidates have the right to transparent recruitment processes and feedback.",
        "Strict adherence to occupational health and safety regulations (OSHA). Right to reasonable working hours and rest periods as per international standards."
    ];

    for (let i = 1; i <= count; i++) {
        const category = getRandomElement(jobCategories);
        const industryKey = category as keyof typeof jobTitlesByIndustry;
        const title = jobTitlesByIndustry[industryKey] ? getRandomElement(jobTitlesByIndustry[industryKey]) : `${category} Specialist`;
        const company = getRandomElement(companies);
        
        const minSal = getRandomNumber(40, 120);
        const maxSal = minSal + getRandomNumber(30, 150);

        jobs.push({
            id: `job_${String(i).padStart(5, '0')}`,
            employerId: `emp_${getRandomNumber(1, 20)}`,
            companyName: company,
            companyLogo: `https://picsum.photos/seed/${company.replace(/ /g, '')}/200/200`,
            title,
            location: getRandomElement(locations),
            type: getRandomElement(jobTypes),
            salaryRange: `KES ${minSal}k - ${maxSal}k`,
            description: `We are seeking a dedicated ${title} to join our team at ${company}. This role is critical for our ${category} operations and offers significant growth potential. You will be responsible for executing high-impact projects and collaborating with a talented group of professionals to achieve our strategic objectives.\n\nThe successful candidate will demonstrate a deep understanding of ${category} principles and possess the technical skills required to excel in a fast-paced environment. We value innovation, integrity, and a commitment to excellence.`,
            requirements: [
                `Bachelor's degree in ${category} or a related field.`,
                `At least ${getRandomNumber(2, 7)} years of proven experience in ${category}.`,
                `Proficiency in ${getRandomElement(skillsLibrary[industryKey] || Object.values(skillsLibrary).flat())}.`,
                'Strong analytical and problem-solving capabilities.',
                'Excellent communication and interpersonal skills.',
                'Ability to manage multiple projects and meet deadlines.'
            ],
            responsibilities: [
                `Oversee and manage ${category} projects from inception to completion.`,
                'Develop and implement best practices and standard operating procedures.',
                'Collaborate with internal and external stakeholders to drive results.',
                'Provide technical guidance and mentorship to junior staff.',
                'Analyze data and prepare reports for senior management.',
                'Ensure all activities comply with industry standards and regulations.'
            ],
            benefits: [
                'Competitive base salary and performance-linked bonuses.',
                'Comprehensive medical, dental, and vision insurance.',
                'Retirement savings plan with employer matching contributions.',
                'Generous paid time off, including vacation, sick leave, and holidays.',
                'Opportunities for professional development and continuous learning.',
                'Flexible work arrangements, including remote and hybrid options.',
                'Employee wellness programs and on-site amenities.'
            ],
            termsAndConditions: getRandomElement(detailedTerms),
            legalRights: getRandomElement(detailedLegalRights),
            postedAt: new Date(Date.now() - getRandomNumber(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
            deadline: new Date(Date.now() + getRandomNumber(15, 60) * 24 * 60 * 60 * 1000).toISOString(),
            category,
            experienceLevel: getRandomElement(expLevels),
            status: 'Open'
        });
    }
    return jobs;
};

export const mockJobs: Job[] = generateJobs(200);

// --- APPLICATION GENERATION ---
const generateApplications = (count: number): Application[] => {
    const apps: Application[] = [];
    for (let i = 1; i <= count; i++) {
        apps.push({
            id: `app_${String(i).padStart(5, '0')}`,
            jobId: getRandomElement(mockJobs).id,
            jobSeekerId: getRandomElement(mockProfiles).id,
            status: getRandomElement(['Applied', 'Reviewing', 'Shortlisted', 'Interviewing', 'Offered', 'Accepted', 'Rejected']),
            appliedAt: new Date(Date.now() - getRandomNumber(1, 20) * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'I am very interested in this position and believe my skills and experience make me a strong candidate.',
            interestedOnly: Math.random() < 0.3
        });
    }
    return apps;
};

export const mockApplications: Application[] = generateApplications(150);

// --- NOTIFICATION GENERATION ---
export const mockNotifications: Notification[] = [
    {
        id: 'notif_1',
        userId: 'usr_00001',
        title: 'New Job Match',
        message: 'A new job matching your profile has been posted: Senior Frontend Developer at Safaricom.',
        type: 'System',
        isRead: false,
        createdAt: new Date().toISOString(),
        link: '/jobs/job_00001'
    },
    {
        id: 'notif_2',
        userId: 'usr_00001',
        title: 'Application Status Updated',
        message: 'Your application for Software Engineer at KCB Group has been moved to "Shortlisted".',
        type: 'StatusChange',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const mockBlogPosts = [
    {
        id: 'blog_1',
        title: 'How to Get Your Profile Verified in 24 Hours',
        excerpt: 'Learn the best practices for uploading documents and providing references to speed up your verification process.',
        author: 'Sarah M.',
        date: '2024-03-15',
        image: 'https://picsum.photos/seed/verify/800/600',
        category: 'Career Advice'
    },
    {
        id: 'blog_2',
        title: 'Top 10 Skills Employers are Looking for in 2024',
        excerpt: 'We analyzed data from over 1,000 job postings to find the most in-demand skills in the Kenyan market.',
        author: 'John K.',
        date: '2024-03-10',
        image: 'https://picsum.photos/seed/skills/800/600',
        category: 'Market Trends'
    },
    {
        id: 'blog_3',
        title: 'Navigating the Aviation Job Market in East Africa',
        excerpt: 'A comprehensive guide for pilots and engineers looking to land roles in the region\'s leading airlines.',
        author: 'Capt. James O.',
        date: '2024-03-05',
        image: 'https://picsum.photos/seed/aviation/800/600',
        category: 'Aviation'
    }
];

export const mockFAQs = [
    {
        question: 'What does "Verified" actually mean?',
        answer: 'A "Verified" badge means our agents have manually cross-referenced your work history, contacted previous employers, and validated your educational credentials directly with institutions.'
    },
    {
        question: 'How long does the verification process take?',
        answer: 'Typically, the manual verification process takes between 3 to 7 business days, depending on the responsiveness of your references and institutions.'
    },
    {
        question: 'Is my data secure on VerifiedHire?',
        answer: 'Yes, we use industry-leading encryption and adhere strictly to the Data Protection Act of Kenya and international GDPR standards.'
    },
    {
        question: 'Can I apply for jobs without being verified?',
        answer: 'Yes, you can apply for jobs, but verified candidates are prioritized by employers and have a significantly higher chance of being shortlisted.'
    }
];

export const mockCategories: IndustryCategory[] = [
    {
        id: 'tech-software',
        name: 'Technology & Software',
        icon: 'computerDesktop',
        count: 184,
        sectorTag: 'FinTech, Cloud & AI',
        description: "Full-stack software engineers, cloud architects, machine learning practitioners, and cybersecurity leads powering Nairobi's Silicon Savannah.",
        growth: '+34% YoY',
        avgSalary: 'KES 180k - 480k/mo',
        cluster: 'tech',
        keySkills: ['React', 'Python', 'AWS Cloud', 'FastAPI', 'Cybersecurity']
    },
    {
        id: 'aviation-aerospace',
        name: 'Aviation & Aerospace',
        icon: 'globeAlt',
        count: 48,
        sectorTag: 'KCAA Flight & Engineering',
        description: 'Commercial captains, first officers, KCAA-certified aircraft maintenance engineers (AME B1/B2), and precision flight dispatchers.',
        growth: '+18% YoY',
        avgSalary: 'KES 250k - 850k/mo',
        cluster: 'logistics',
        keySkills: ['KCAA B1.1/B2', 'Flight Operations', 'ATPL/CPL', 'SMS Safety']
    },
    {
        id: 'banking-finance',
        name: 'Banking & Financial Markets',
        icon: 'dollarSign',
        count: 156,
        sectorTag: 'Tier-1 Banking & Microfinance',
        description: 'Investment analysts, credit risk modelers, forensic auditors, IFRS 9 specialists, and digital mobile banking strategists.',
        growth: '+22% YoY',
        avgSalary: 'KES 160k - 440k/mo',
        cluster: 'finance',
        keySkills: ['Financial Modeling', 'Risk Analytics', 'IFRS 9', 'Treasury Mgmt']
    },
    {
        id: 'healthcare-sciences',
        name: 'Healthcare & Life Sciences',
        icon: 'heart',
        count: 98,
        sectorTag: 'Clinical Medicine & HealthTech',
        description: 'Board-registered physicians, critical care clinical officers, diagnostic laboratory scientists, pharmacists, and health informatics leads.',
        growth: '+29% YoY',
        avgSalary: 'KES 140k - 390k/mo',
        cluster: 'health_agri',
        keySkills: ['KMPDC Licensed', 'Critical Care', 'Clinical Trials', 'HealthTech']
    },
    {
        id: 'engineering-infra',
        name: 'Engineering & Infrastructure',
        icon: 'cog',
        count: 122,
        sectorTag: 'Civil, Mechanical & Structural',
        description: 'EBK-registered engineers, mega-infrastructure project directors, MEP consultants, and structural integrity auditors.',
        growth: '+19% YoY',
        avgSalary: 'KES 150k - 420k/mo',
        cluster: 'engineering',
        keySkills: ['EBK Registered', 'AutoCAD & Civil 3D', 'Project Management', 'MEP']
    },
    {
        id: 'agri-foodsystems',
        name: 'Agribusiness & Food Systems',
        icon: 'buildingOffice',
        count: 92,
        sectorTag: 'Export Horticulture & Agritech',
        description: 'Certified agronomists, GlobalGAP export compliance officers, automated cold-chain managers, and food processing technologists.',
        growth: '+26% YoY',
        avgSalary: 'KES 120k - 330k/mo',
        cluster: 'health_agri',
        keySkills: ['GlobalGAP', 'Cold Chain Logistics', 'Precision Agritech', 'Post-Harvest']
    },
    {
        id: 'legal-compliance',
        name: 'Legal & Regulatory Compliance',
        icon: 'scale',
        count: 64,
        sectorTag: 'Corporate Law & ODPC Privacy',
        description: 'High Court advocates, corporate legal counsels, ODPC data protection officers (DPO), and commercial arbitration specialists.',
        growth: '+15% YoY',
        avgSalary: 'KES 170k - 460k/mo',
        cluster: 'finance',
        keySkills: ['LSK Admitted', 'ODPC Compliance', 'Contract Law', 'Arbitration']
    },
    {
        id: 'supplychain-maritime',
        name: 'Supply Chain & Maritime Logistics',
        icon: 'map',
        count: 110,
        sectorTag: 'Port of Mombasa & SGR Cargo',
        description: 'Port operations controllers, bonded warehouse managers, multimodal freight forwarders, and KRA Simba/ICMS customs brokers.',
        growth: '+23% YoY',
        avgSalary: 'KES 115k - 310k/mo',
        cluster: 'logistics',
        keySkills: ['KRA ICMS / Simba', 'Port Logistics', 'KIFWA Certified', 'Multimodal']
    },
    {
        id: 'telecom-network',
        name: 'Telecommunications & 5G Infrastructure',
        icon: 'zap',
        count: 78,
        sectorTag: 'Fiber Optics & Data Centers',
        description: 'Transmission engineers, 5G RF optimization specialists, Tier-3 data center facility managers, and network operations center (NOC) engineers.',
        growth: '+27% YoY',
        avgSalary: 'KES 150k - 400k/mo',
        cluster: 'tech',
        keySkills: ['5G RF Systems', 'Fiber Backbone', 'CCNP/CCIE', 'Data Center Ops']
    },
    {
        id: 'renewable-energy',
        name: 'Renewable Energy & Power Systems',
        icon: 'sun',
        count: 62,
        sectorTag: 'Geothermal, Solar & Wind',
        description: 'Geothermal reservoir engineers, utility-scale solar PV designers, wind energy technicians, and EPRA licensed electrical contractors.',
        growth: '+38% High Demand',
        avgSalary: 'KES 160k - 430k/mo',
        cluster: 'engineering',
        keySkills: ['EPRA Licensed', 'Solar PV Design', 'Geothermal Wells', 'SCADA']
    },
    {
        id: 'hospitality-tourism',
        name: 'Hospitality & Eco-Tourism',
        icon: 'gift',
        count: 74,
        sectorTag: 'Safari Lodges & Luxury MICE',
        description: 'Safari lodge general managers, executive head chefs, KPSGA certified safari guides, and luxury eco-resort experience managers.',
        growth: '+21% YoY',
        avgSalary: 'KES 100k - 300k/mo',
        cluster: 'social_creative',
        keySkills: ['KPSGA Certified', 'Opera PMS', 'Lodge Management', 'Eco-Tourism']
    },
    {
        id: 'education-edtech',
        name: 'Education & Academic Leadership',
        icon: 'academicCap',
        count: 86,
        sectorTag: 'Universities & Curriculum Design',
        description: 'STEM university lecturers, International Baccalaureate (IB) educators, educational technology leads, and TVET vocational trainers.',
        growth: '+17% YoY',
        avgSalary: 'KES 110k - 290k/mo',
        cluster: 'social_creative',
        keySkills: ['TSC Certified', 'IB Curriculum', 'Instructional Design', 'LMS Platforms']
    },
    {
        id: 'creative-media',
        name: 'Creative Economy & Digital Media',
        icon: 'layout',
        count: 94,
        sectorTag: 'UI/UX Design & Brand Strategy',
        description: 'Lead product designers (Figma), creative directors, performance marketing heads, video producers, and brand architects.',
        growth: '+31% YoY',
        avgSalary: 'KES 130k - 350k/mo',
        cluster: 'social_creative',
        keySkills: ['Figma UI/UX', 'Performance Marketing', 'Brand Strategy', 'Motion Design']
    },
    {
        id: 'ngo-development',
        name: 'NGOs & International Development',
        icon: 'award',
        count: 70,
        sectorTag: 'UN Agencies & Global Missions',
        description: 'Monitoring & Evaluation (M&E) directors, USAID/FCDO grant managers, humanitarian field operations leads, and public policy advisors.',
        growth: '+14% YoY',
        avgSalary: 'KES 200k - 580k/mo',
        cluster: 'social_creative',
        keySkills: ['M&E Frameworks', 'USAID Grants', 'Public Policy', 'Humanitarian Ops']
    },
    {
        id: 'manufacturing-fmcg',
        name: 'Manufacturing & FMCG Processing',
        icon: 'circleStack',
        count: 82,
        sectorTag: 'Industrial Plants & Quality Control',
        description: 'Production plant managers, Six Sigma continuous improvement engineers, packaging technologists, and ISO 9001/22000 quality leads.',
        growth: '+16% YoY',
        avgSalary: 'KES 130k - 360k/mo',
        cluster: 'engineering',
        keySkills: ['Six Sigma Black Belt', 'Lean Manufacturing', 'ISO 22000', 'Plant Safety']
    },
    {
        id: 'security-cyberdefense',
        name: 'Security & Cyber Defense Intelligence',
        icon: 'shieldCheck',
        count: 56,
        sectorTag: 'Enterprise Risk & Digital Forensics',
        description: 'Certified ethical hackers (CEH), digital forensic examiners, corporate risk directors, and threat intelligence analysts.',
        growth: '+36% High Demand',
        avgSalary: 'KES 170k - 470k/mo',
        cluster: 'tech',
        keySkills: ['CISSP / CEH', 'Digital Forensics', 'Threat Intel', 'Crisis Protocol']
    }
];

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
