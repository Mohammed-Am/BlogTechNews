const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');


const Blog = require('./models/blog');
const { request } = require('express');

const api = process.env.URL_API;

//Express App
const  app = express();

//Connect to Mongodb

mongoose.set('strictQuery', false)

mongoose.connect(process.env.STRING_CONNECTION)
.then(() =>{
          //listen for requist
            app.listen(3000)
     })
.catch((err) => {
          console.error(`Error connecting to the database .n${err}`)
     });


// Register view engine
app.set('view engine', 'ejs');



// Middleware & Static Files

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});



// Routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});


app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// Blog Routes
app.get('/blogs/dashboard', (req, res) => {
     res.render('dashboard', { title: 'Dashboard' });
 });

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});


app.get('/blogs/delete', (req, res) => {
    
     Blog.find().sort({ createdAt: -1 })
     .then(result => {
       res.render('delete', { blogs: result, title: 'Delete Post' });
     })
     .catch(err => {
       console.log(err);
     });
    
   });

app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/blogs', (req, res) => {
  // console.log(req.body);
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/blogs/delete/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});



// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});