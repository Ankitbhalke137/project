import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-directory';

// Student data matching the frontend
const studentNames = [
    "Abhay Kale", "Adinath Patil", "Ankit Bhalke", "Arman Patel", "Ashish Sonaniya",
    "Dayanand Jat", "Devansh Mittal", "Dhireena Banu", "Ganesh Choudhary", "Jay Mehta",
    "Kaif Khan", "Kaif Shaikh", "Khushi Agarwal", "Khushi Shah", "Mohhamed Rehan",
    "Moin Kadival", "Parthiv", "Piyush Chouhan", "Pranay Sonaniya",
    "Priya", "Priyanshu Tailor", "Radheshyam Bhati", "Roshan Bhendekar", "Rushikesh",
    "Shayaz", "Sripathi Lakshmi Narasimha Dhruv Teja ", "Sumit Tiwari", "Yashraj", "Zahid Shaikh",
    "GODBOLE VISHVAJEET SURYAKANT", "KUMKUM JANGIR", "ADITYA DOLHARE", "UTKARSH KUMAR", "ANOOP",
    "ABHISHEK YADAV", "SHIVAM KUMAR JHA", "RUSHIKESH SHINDE", "SATYAM SATYAM YADUVANSHI", "AVISHKAR RAVIKANT CHAVAN",
    "SHRADDHA NITIN LIMBEKAR", "BHARAT KUMAR", "RUGVED KADAM", "ABHINAV SINGH", "SOHAM SHINDE",
    "RUDRA ABHISHEK", "BAIBHAV KUMAR", "AKSHATA BIRADAR", "PULAK SAHA", "MILIND THAKARE",
    "SAI SHENDGE", "HARSHVARDHAN SINGH CHAUHAN", "ASHWINLAL", "ADITYA VAWHAL", "ABHILASH",
    "ASHISH SHARMA", "SURAJ MADHESHIYA", "SANKALP TIWARI", "AYUSH KARANJIYA", "DHRUVARAJ NIKAM",
    "KRISHNA GUPTA", "VIVEK INGLE", "VIVEK MISHRA", "GYANRANJAN KUMAR", "SAURYAMAN BISEN",
    "ADITHYA HK", "SHAIKH ARMAN", "ARINDAM SARKAR", "SHRESTHA ARYA", "AYESHA SHEIKH",
    "ABRAR SHEIKH", "KSHITIJ DAS", "VIVEK BHURBHURE", "SOHAM SAWANT", "Ashu Singh"
];

const cities = [
    'Pune', 'Bengaluru', 'Delhi', 'Mumbai', 'Hyderabad',
    'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Chandigarh', 'Indore', 'Kochi', 'Bhubaneswar', 'Guwahati',
    'Nagpur', 'Thiruvananthapuram', 'Dehradun', 'Shimla', 'Ranchi'
];

const states = [
    'Maharashtra', 'Karnataka', 'Delhi', 'Maharashtra', 'Telangana',
    'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh',
    'Punjab', 'Madhya Pradesh', 'Kerala', 'Odisha', 'Assam',
    'Maharashtra', 'Kerala', 'Uttarakhand', 'Himachal Pradesh', 'Jharkhand'
];

const femaleNames = [
    "Dhireena Banu", "Khushi Agarwal", "Khushi Shah", "Priya", "KUMKUM JANGIR",
    "SHRADDHA NITIN LIMBEKAR", "AKSHATA BIRADAR", "SHRESTHA ARYA", "AYESHA SHEIKH"
];

const seedDatabase = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing students...');
        await Student.deleteMany({});

        // Create student documents
        const students = studentNames.map((name, i) => {
            const isFemale = femaleNames.includes(name);
            const boyAvatars = [1, 2];
            const girlAvatars = [3, 4];
            const avatarId = isFemale
                ? girlAvatars[Math.floor(Math.random() * girlAvatars.length)]
                : boyAvatars[Math.floor(Math.random() * boyAvatars.length)];

            const cityIndex = (i * 7) % cities.length;

            return {
                name,
                location: `${cities[cityIndex]}, ${states[cityIndex]}`,
                avatar: `public/student_avatar_${avatarId}.png`,
                batch: 2023 + (i % 3),
                campus: ["Bengaluru", "Pune", "Hyderabad"][i % 3],
                about: `A passionate School of Technology student exploring the future of innovation.`,
                portfolio: `https://github.com/`,
                achievements: ["Deans List", "Hackathon Finalist"]
            };
        });

        console.log(`📝 Inserting ${students.length} students...`);
        await Student.insertMany(students);

        console.log(`✅ Successfully seeded ${students.length} students!`);

        // Display sample data
        const count = await Student.countDocuments();
        console.log(`\n📊 Database Statistics:`);
        console.log(`   Total Students: ${count}`);

        const campusCounts = await Student.aggregate([
            { $group: { _id: '$campus', count: { $sum: 1 } } }
        ]);
        console.log(`\n📍 Campus Distribution:`);
        campusCounts.forEach(({ _id, count }) => {
            console.log(`   ${_id}: ${count} students`);
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

seedDatabase();
