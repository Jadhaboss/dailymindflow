const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const adminLayout = '../views/layouts/admin';

// GET /admin/dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        const locals = {
            title: 'Dashboard',
            description: 'Admin Dashboard'
        };
        res.render('admin/dashboard', { locals, posts, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

// GET /admin/add-post
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const categories = await Category.find();
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog System'
        };
        res.render('admin/add-post', { locals, layout: adminLayout, categories });
    } catch (error) {
        console.log(error);
    }
});

// POST /admin/add-post
router.post('/add-post', authMiddleware, upload.single('imageUpload'), async (req, res) => {
    try {
        let imagePath = '/images/default-post.jpg'; // Default

        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            imagePath = req.body.image;
        }

        try {
            const newPost = new Post({
                title: req.body.title,
                slug: req.body.slug || req.body.title.toLowerCase().split(' ').join('-'),
                body: req.body.body,
                image: imagePath,
                category: req.body.category
            });
            await Post.create(newPost);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
});

// GET /admin/edit-post/:id
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = { title: "Edit Post", description: "Edit Post" };
        const data = await Post.findOne({ _id: req.params.id });
        const categories = await Category.find();
        res.render('admin/edit-post', { locals, data, layout: adminLayout, categories });
    } catch (error) {
        console.log(error);
    }
});

// PUT /admin/edit-post/:id
// Note: method-override works with POST to simulate PUT, so we need to handle multipart on the POST request logic if we were strictly using POST.
// primarily for file upload compatibility, method-override might be tricky with multipart forms depending on implementation.
// However, standard browser forms usually POST. Let's see. 
// Actually, method-override runs before body handling, but multipart handling (multer) needs to run to parse fields.
// Safest bet for simplicity with Multer + MethodOverride is to handle this carefully.
// Standard practice: Multer runs first, populates req.body and req.file, then method-override sees _method in body?
// Multer parses body. Method-override looks at body. So Multer MUST come before method-override? 
// No, express app usage order matters. in server.js method override is used.
// If the form is multipart, body-parser/express.json() wont parse it. Multer will.
// So method-override needing req.body._method might fail if Multer hasn't run yet?
// SOLUTION: Pass _method in query string for PUT with file upload: ?_method=PUT (Already doing this in view).
router.put('/edit-post/:id', authMiddleware, upload.single('imageUpload'), async (req, res) => {
    try {
        let imagePath = req.body.image; // Keep existing if not changed

        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            slug: req.body.slug,
            body: req.body.body,
            image: imagePath,
            category: req.body.category,
            updatedAt: Date.now()
        });
        res.redirect(`/admin/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }
});



// DELETE /admin/delete-post/:id
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
});


// --- CATEGORY ROUTES ---

// GET /admin/categories
router.get('/categories', authMiddleware, async (req, res) => {
    try {
        const categories = await Category.find();
        const locals = {
            title: 'Manage Categories',
            description: 'Manage Blog Categories'
        };
        res.render('admin/categories', { locals, categories, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

// POST /admin/add-category
router.post('/add-category', authMiddleware, async (req, res) => {
    try {
        const newCategory = new Category({
            name: req.body.name
        });
        await Category.create(newCategory);
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
});

// GET /admin/edit-category/:id
router.get('/edit-category/:id', authMiddleware, async (req, res) => {
    try {
        const locals = { title: "Edit Category", description: "Edit Category" };
        const data = await Category.findOne({ _id: req.params.id });
        res.render('admin/edit-category', { locals, data, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

// PUT /admin/edit-category/:id
router.put('/edit-category/:id', authMiddleware, async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            updatedAt: Date.now()
        });
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
});

// DELETE /admin/delete-category/:id
router.delete('/delete-category/:id', authMiddleware, async (req, res) => {
    try {
        await Category.deleteOne({ _id: req.params.id });
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
