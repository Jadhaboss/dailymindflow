const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');

// GET / - Home
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "DailyMindflow",
            description: "A Premium Blog"
        };

        let perPage = 6;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }
});

// GET /post/:id
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findOne({ _id: slug }).populate('category'); // Or find by slug if implemented

        const locals = {
            title: data.title,
            description: "Simple Blog System",
        }

        res.render('post', { locals, data, currentRoute: `/post/${slug}` });
    } catch (error) {
        console.log(error);
    }
});

// GET /about
router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about',
        locals: { title: 'About' }
    });
});

// GET /contact
router.get('/contact', (req, res) => {
    res.render('contact', {
        currentRoute: '/contact',
        locals: { title: 'Contact' }
    });
});

// GET /privacy
router.get('/privacy', (req, res) => {
    res.render('privacy', {
        currentRoute: '/privacy',
        locals: { title: 'Privacy Policy' }
    });
});

// GET /terms
router.get('/terms', (req, res) => {
    res.render('terms', {
        currentRoute: '/terms',
        locals: { title: 'Terms of Service' }
    });
});

// POST /search
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog System"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        res.render("search", {
            data,
            locals,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }
});

// GET /api/search-suggestions
router.get('/api/search-suggestions', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        const searchNoSpecialChar = query.replace(/[^a-zA-Z0-9 ]/g, "");
        const posts = await Post.find({
            title: { $regex: new RegExp(searchNoSpecialChar, 'i') }
        }).limit(5).select('title _id');

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json([]);
    }
});

// GET /category/:id
router.get('/category/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.find({ category: slug }).populate('category');

        const locals = {
            title: "Category",
            description: "Category PostsService"
        }

        res.render('index', {
            locals,
            data,
            current: 1,
            nextPage: null,
            currentRoute: `/category/${slug}`
        });

    } catch (error) {
        console.log(error);
    }
});

// POST /subscribe
router.post('/subscribe', async (req, res) => {
    try {
        const Subscriber = require('../models/Subscriber');
        await Subscriber.create({ email: req.body.email });
        res.send('subscribed'); // Simple response for now, ideally flash message
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
