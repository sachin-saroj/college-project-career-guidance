import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Question } from '../modules/assessment/models/Question';
import { Career } from '../modules/career/models/Career';
import { Course } from '../modules/resources/models/Course';
import { Internship } from '../modules/resources/models/Internship';
import { Scholarship } from '../modules/resources/models/Scholarship';
import { Roadmap } from '../modules/resources/models/Roadmap';
import { Article } from '../modules/resources/models/Article';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careersathi';

const questions = [
  {
    text: 'I enjoy solving complex math problems and working with data.',
    category: 'Aptitude',
    type: 'LIKERT',
    weight: 1,
    options: [
      { text: 'Strongly Disagree', traitScores: { analytical: 0, technical: 0 } },
      { text: 'Disagree', traitScores: { analytical: 2, technical: 1 } },
      { text: 'Neutral', traitScores: { analytical: 5, technical: 3 } },
      { text: 'Agree', traitScores: { analytical: 8, technical: 6 } },
      { text: 'Strongly Agree', traitScores: { analytical: 10, technical: 8 } }
    ]
  },
  {
    text: 'I prefer working on a team and leading group projects.',
    category: 'Personality',
    type: 'LIKERT',
    weight: 1,
    options: [
      { text: 'Strongly Disagree', traitScores: { leadership: 0, social: 0 } },
      { text: 'Disagree', traitScores: { leadership: 2, social: 2 } },
      { text: 'Neutral', traitScores: { leadership: 5, social: 5 } },
      { text: 'Agree', traitScores: { leadership: 8, social: 8 } },
      { text: 'Strongly Agree', traitScores: { leadership: 10, social: 10 } }
    ]
  },
  {
    text: 'I like creating art, designing visuals, or writing stories.',
    category: 'Interest',
    type: 'LIKERT',
    weight: 1,
    options: [
      { text: 'Strongly Disagree', traitScores: { artistic: 0, creativity: 0 } },
      { text: 'Disagree', traitScores: { artistic: 2, creativity: 2 } },
      { text: 'Neutral', traitScores: { artistic: 5, creativity: 5 } },
      { text: 'Agree', traitScores: { artistic: 8, creativity: 8 } },
      { text: 'Strongly Agree', traitScores: { artistic: 10, creativity: 10 } }
    ]
  },
  {
    text: 'When faced with a broken device, my first instinct is to take it apart and figure out how it works.',
    category: 'Interest',
    type: 'MULTIPLE_CHOICE',
    weight: 1.5,
    options: [
      { text: 'Yes, always!', traitScores: { realistic: 10, investigative: 10, technical: 10 } },
      { text: 'Sometimes, if I have time.', traitScores: { realistic: 5, investigative: 5, technical: 5 } },
      { text: 'No, I ask someone else to fix it.', traitScores: { social: 10 } },
      { text: 'No, I just buy a new one.', traitScores: { conventional: 5 } }
    ]
  }
];

const careers = [
  {
    name: 'Software Engineer',
    description: 'Designs, develops, and maintains software applications and systems.',
    requiredSkills: ['Programming', 'Problem Solving', 'System Design', 'Algorithms'],
    requiredSubjects: ['Mathematics', 'Computer Science'],
    educationPath: 'B.Tech in Computer Science or self-taught via bootcamps.',
    salaryRange: { min: 400000, max: 2500000, currency: 'INR' },
    demandLevel: 'High',
    futureOutlook: 'Excellent growth, but basic coding is at risk of AI automation.',
    aiAutomationRisk: 'Medium',
    recommendedCertifications: ['AWS Certified Developer', 'React Developer Certification'],
    growthOpportunities: ['Senior Engineer', 'Engineering Manager', 'CTO'],
    traitRequirements: {
      analytical: 80,
      technical: 90,
      investigative: 70
    }
  },
  {
    name: 'Graphic Designer',
    description: 'Creates visual concepts to communicate ideas that inspire, inform, and captivate consumers.',
    requiredSkills: ['Typography', 'UI/UX', 'Color Theory', 'Adobe Creative Suite'],
    requiredSubjects: ['Art', 'Design'],
    educationPath: 'B.Des in Graphic Design or equivalent portfolio.',
    salaryRange: { min: 300000, max: 1500000, currency: 'INR' },
    demandLevel: 'Medium',
    futureOutlook: 'High demand for specialized UI/UX, though generic design faces AI competition.',
    aiAutomationRisk: 'High',
    recommendedCertifications: ['Google UX Design Certificate'],
    growthOpportunities: ['Art Director', 'Creative Director'],
    traitRequirements: {
      artistic: 90,
      creativity: 95
    }
  },
  {
    name: 'Project Manager',
    description: 'Plans, executes, and closes projects, ensuring they finish on time and within budget.',
    requiredSkills: ['Agile/Scrum', 'Leadership', 'Communication', 'Risk Management'],
    requiredSubjects: ['Business Studies', 'Management'],
    educationPath: 'BBA/MBA or equivalent management degree.',
    salaryRange: { min: 600000, max: 3000000, currency: 'INR' },
    demandLevel: 'High',
    futureOutlook: 'Stable. Human coordination and leadership are difficult to automate.',
    aiAutomationRisk: 'Low',
    recommendedCertifications: ['PMP', 'Scrum Master'],
    growthOpportunities: ['Program Manager', 'Director of Operations'],
    traitRequirements: {
      leadership: 85,
      communication: 90,
      social: 80,
      enterprising: 75
    }
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Clear existing knowledge base
    console.log('Clearing existing assessment & career data...');
    await Question.deleteMany({});
    await Career.deleteMany({});
    
    // 2. Insert Data
    console.log('Seeding Question Bank...');
    await Question.insertMany(questions);
    
    const createdCareers = await Career.insertMany(careers);
    console.log(`✅ Seeded ${createdCareers.length} Careers`);

    const sweCareer = createdCareers.find(c => c.name === 'Software Engineer');

    // --- PHASE 8: SEED RESOURCES ---
    if (sweCareer) {
      await Course.deleteMany({});
      await Scholarship.deleteMany({});
      await Internship.deleteMany({});
      await Roadmap.deleteMany({});
      await Article.deleteMany({});

      const sweId = sweCareer._id as mongoose.Types.ObjectId;

      await Course.create({
        title: 'Full-Stack Web Development Bootcamp',
        description: 'Learn MERN stack from scratch.',
        provider: 'Coursera',
        instructor: 'Dr. Angela Yu',
        level: 'Beginner',
        durationHours: 60,
        price: 0,
        url: 'https://coursera.org',
        mappedCareers: [sweId]
      });

      await Internship.create({
        company: 'TechCorp India',
        role: 'Frontend Developer Intern',
        durationMonths: 6,
        location: 'Bangalore',
        remoteStatus: 'Hybrid',
        deadline: new Date('2027-01-01'),
        applyUrl: 'https://techcorp.com/careers',
        mappedCareers: [sweId]
      });

      await Scholarship.create({
        name: 'Women in Tech Scholarship 2026',
        provider: 'Google',
        amount: { min: 50000, max: 100000, currency: 'INR' },
        eligibilityCriteria: {
          maxFamilyIncome: 800000,
          requiredStreams: ['Science'],
          minPercentage: 80,
          targetDemographics: ['Women']
        },
        category: 'Technology',
        deadline: new Date('2027-01-01'),
        applyUrl: 'https://google.com/scholarships'
      });

      await Roadmap.create({
        title: 'Software Engineer Master Roadmap',
        careerId: sweId,
        description: 'Step by step guide to becoming a SWE.',
        stages: [
          { level: 'Beginner', skills: ['HTML', 'CSS', 'JS'], courseIds: [], projects: [], certifications: [] }
        ]
      });

      console.log(`✅ Seeded Phase 8 Resources mapped to Software Engineer`);
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
