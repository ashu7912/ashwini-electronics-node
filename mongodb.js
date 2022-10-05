const {MongoClient, ObjectId} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'ashwini-electronics'


MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client)=> {
    if(error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)
    
    // db.collection('users').findOne({name: 'Shiwa'}, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }

    //     console.log('User', user)
    // })

    db.collection('users').find({}).toArray((error, res) => {
        if (error) {
            return console.log('Unable to fetch data!')
        }
        console.log(res)
    })

})