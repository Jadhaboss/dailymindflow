require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Category = require('./models/Category');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await Category.deleteMany({});

        // Create Admin
        await User.create({
            username: 'admin',
            password: 'password123' // Will be hashed by middleware
        });
        console.log('Admin user created (username: admin, password: password123)');

        // Create Categories
        const techCat = await Category.create({ name: 'Technology' });
        const lifeCat = await Category.create({ name: 'Lifestyle' });
        const designCat = await Category.create({ name: 'Design' });

        // Create Posts
        await Post.create([
            {
                title: 'The Future of AI',
                slug: 'the-future-of-ai',
                body: 'Artificial Intelligence is reshaping our world...',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
                category: techCat._id
            },
            {
                title: 'Minimalism in Design',
                slug: 'minimalism-in-design',
                body: 'Less is more. The philosophy of minimalism...',
                image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1000',
                category: designCat._id
            },
            {
                title: 'Morning Routine for Success',
                slug: 'morning-routine-success',
                body: 'How you start your day determines your success...',
                image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=1000',
                category: lifeCat._id
            }
        ]);

        console.log('Sample posts created');
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
