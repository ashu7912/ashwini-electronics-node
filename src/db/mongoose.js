const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/ashwini-electronics', {
    useNewUrlParser: true
    // useCreateIndex: true,
    // useFindAndModify: false
})