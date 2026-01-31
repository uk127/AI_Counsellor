import { sequelize } from '../config/database.js'
import { University } from '../models/University.js'

const universities = [
  {
    name: 'Massachusetts Institute of Technology (MIT)',
    country: 'United States',
    city: 'Cambridge',
    description: 'A world-leading research university known for its excellence in science, engineering, and technology.',
    website: 'https://www.mit.edu',
    ranking: 1,
    cost: 55000,
    requirements: {
      gpa: 3.8,
      ielts: 7.5,
      toefl: 100,
      gre: 325
    },
    acceptanceRate: 7.3,
    isPublic: false,
    isFeatured: true
  },
  {
    name: 'Stanford University',
    country: 'United States',
    city: 'Stanford',
    description: 'Located in the heart of Silicon Valley, Stanford is famous for its entrepreneurial spirit and academic excellence.',
    website: 'https://www.stanford.edu',
    ranking: 2,
    cost: 56000,
    requirements: {
      gpa: 3.9,
      ielts: 7.5,
      toefl: 100,
      gre: 330
    },
    acceptanceRate: 4.4,
    isPublic: false,
    isFeatured: true
  },
  {
    name: 'University of Oxford',
    country: 'United Kingdom',
    city: 'Oxford',
    description: 'The oldest university in the English-speaking world, offering world-class education and research.',
    website: 'https://www.ox.ac.uk',
    ranking: 3,
    cost: 35000,
    requirements: {
      gpa: 3.7,
      ielts: 7.5,
      toefl: 110
    },
    acceptanceRate: 17.5,
    isPublic: true,
    isFeatured: true
  },
  {
    name: 'University of Cambridge',
    country: 'United Kingdom',
    city: 'Cambridge',
    description: 'A global top-tier university with a rich history of scientific discovery and academic tradition.',
    website: 'https://www.cam.ac.uk',
    ranking: 4,
    cost: 38000,
    requirements: {
      gpa: 3.8,
      ielts: 7.5,
      toefl: 110
    },
    acceptanceRate: 21.0,
    isPublic: true,
    isFeatured: true
  },
  {
    name: 'ETH Zurich',
    country: 'Switzerland',
    city: 'Zurich',
    description: 'One of the world\'s leading universities for technology and natural sciences.',
    website: 'https://ethz.ch',
    ranking: 7,
    cost: 1500,
    requirements: {
      gpa: 3.5,
      ielts: 7.0,
      toefl: 100
    },
    acceptanceRate: 27.0,
    isPublic: true,
    isFeatured: false
  },
  {
    name: 'National University of Singapore (NUS)',
    country: 'Singapore',
    city: 'Singapore',
    description: 'A leading global university centered in Asia, offering a global approach to education and research.',
    website: 'https://www.nus.edu.sg',
    ranking: 11,
    cost: 25000,
    requirements: {
      gpa: 3.6,
      ielts: 7.0,
      toefl: 95
    },
    acceptanceRate: 5.0,
    isPublic: true,
    isFeatured: false
  }
]

async function seed() {
  try {
    await sequelize.authenticate()
    console.log('Database connected...')

    // Sync models
    await sequelize.sync({ alter: true })
    console.log('Database synced...')

    for (const uni of universities) {
      await University.upsert(uni)
    }

    console.log('Universities seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding universities:', error)
    process.exit(1)
  }
}

seed()
