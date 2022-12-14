const express = require('express')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const resSuccessObject = require('../models/responce')

router.post('/add-product', auth, async (req, res) => {
    const product = new Product({
        ...req.body,
        owner: req.user._id
    })

    try {
        await product.save()
        res.status(201).send({
            ...resSuccessObject,
            message: 'Product added successfully!',
            data: product
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /products?completed=true
// GET /products?limit=10&skip=20
// GET /products?sortBy=createdAt:desc

// router.get('/products', auth, async (req, res) => {
//     // const products = await Product.find({});
//     // res.send(products)
//     const match = {}
//     const sort = {}

//     if (req.query.completed) {
//         match.completed = req.query.completed === 'true'
//     }


//     if (req.query.startDate && req.query.endDate) {
//         match.createdAt = {
//             "$gte":req.query.startDate,
//             "$lte":req.query.endDate
//         }
//     }

//     if (req.query.sortBy) {
//         const parts = req.query.sortBy.split(':')
//         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
//     }

//     // const products = await Product.find({});
//     // res.send(products)
//     // console.log(req.user)
//     try {
//         await req.user.populate({
//             path: 'product',
//             match,
//             options: {
//                 limit: parseInt(req.query.limit),
//                 skip: parseInt(req.query.skip),
//                 sort,
//             }
//         })
//         res.send({
//             ...resSuccessObject,
//             data: req.user.product
//         })
//         // const products = await Product.find({
//         //     "createdAt":{
//         //         "$gte":req.query.startDate,
//         //         "$lte":req.query.endDate
//         //     }
//         // }
//         // )
//         // res.send(products)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// GET /products?completed=true
// GET /products?limit=10&skip=20
// GET /products?sortBy=createdAt:desc

router.get('/products', auth, async (req, res) => {
    
    let products = []
    const match = {}
    const sort = {}
    let limit = 0
    let skip = 0

    if (req.query.startDate && req.query.endDate) {

        match.createdAt = {
            "$gte": req.query.startDate,
            "$lte": req.query.endDate
        }
    } 
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    } if (req.query.limit && req.query.skip) {
        limit = req.query.limit
        skip = req.query.skip
    } 
    
    products = await Product.find(match).collation({ locale: "en" }).sort(sort).limit(limit).skip(skip)

    try {
        res.send({
            ...resSuccessObject,
            data: products
        })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/product/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const product = await Product.findOne({ _id, owner: req.user._id })

        if (!product) {
            return res.status(404).send()
        }

        res.send({
            ...resSuccessObject,
            data: product
        })
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/update-product/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'buyingPrice', 'sellingPrice', 'count']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const product = await Product.findOne({ _id: req.params.id, owner: req.user._id })

        if (!product) {
            return res.status(404).send()
        }

        updates.forEach((update) => product[update] = req.body[update])
        await product.save()
        res.send({
            ...resSuccessObject,
            message: 'Product updated successfully!',
            data: product
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/delete-product/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!product) {
            res.status(404).send()
        }

        res.send({
            ...resSuccessObject,
            message: `Product '${product['title']}' deleted successfully! `
        })
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/delete-multiple-product', auth, async (req, res) => {
    console.log(req.body.product_ids)
    const product_ids = req.body.product_ids
    try {
        const deletedProducts = await Product.deleteMany({ _id: { $in: product_ids } })

        if (!deletedProducts) {
            res.status(404).send()
        }

        res.send({
            ...resSuccessObject,
            message: `Products deleted successfully! `
        })

    } catch (e) {
        res.status(500).send()
    }
})


const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 4000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload an image.'))
        }

        cb(undefined, true)
    }
});

router.post('/products/:id/image', auth, upload.single('product_image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 400, height: 400 }).png().toBuffer();
    const product = await Product.findOne({ _id: req.params.id, owner: req.user._id });
    product.image = buffer;
    // req.user.avatar = buffer;
    // req.user.avatar = req.file.buffer;
    await product.save()
    res.send({
        ...resSuccessObject,
        message: `Image added successfully! `
    })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})


router.delete('/products/:id/image', auth, async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.image = undefined;
    await product.save()
    res.send({
        ...resSuccessObject,
        message: `Product image deleted successfully!`
    });
    // req.user.avatar = undefined;
    // await req.user.save()
    // res.send()
})

router.get('/products/:id/image', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || !product.image) {
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg');
        res.send(product.image);
    } catch (e) {
        res.status(404).send();
    }
})

module.exports = router