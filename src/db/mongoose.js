const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/ashwini-electronics', {
    useNewUrlParser: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

const me = new User({
    name: 'Shiva',
    age: 23
})

me.save().then((res) => {
    console.log(res)
}).catch(() => {
    console.log('Error!', error)
})