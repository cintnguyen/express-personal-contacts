const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

var db, collection;

const url = "mmongodb+srv://cintnguyen98:mongodb613@cluster0.velizmx.mongodb.net/?retryWrites=true&w=majority";
const dbName = "contactsdb";

app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('contacts').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { contacts: result })
  })
})

//creating the users contact input
app.post('/contacts', (req, res) => {
  db.collection('contacts').insertOne({ name: req.body.name, email: req.body.email, number: req.body.number, inviteStatus: "..." }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//changing Invite Status to invited
app.put('/contacts', (req, res) => {
  db.collection('contacts').findOneAndUpdate(
    {name: req.body.name},
    {
      $set: {
        inviteStatus: "Invited"
      }
    },
      (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
})

app.delete('/contacts', (req, res) => {
  db.collection('contacts').findOneAndDelete({ name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

app.delete('/deleteAllContacts', (req, res) => {
  db.collection('contacts').deleteMany((err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})