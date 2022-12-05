const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json())
app.use(userRouter)
app.use(productRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const Product = require('./models/product')
// const User = require('./models/user')

// const main = async () => {
//     // const product = await Product.findById('5c2e505a3253e18a43e612e6')
//     // await product.populate('owner').execPopulate()
//     // console.log(product.owner)

//     // const user = await User.findById('5c2e4dcb5eac678a23725b5b')
//     // await user.populate('product').execPopulate()
//     // console.log(user.products)
// }

// main()