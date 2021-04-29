const { title } = require('process');
const { events } = require('./models/user');

module.exports = function(app, passport, db, multer, storage, upload, ObjectId) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res){
        res.render('index.ejs', {
            message: req.flash('loginMessage')
        })
      
    })



    // HOME/FEED SECTION =========================
    app.get('/singleDiscussionView', isLoggedIn, function(req, res) {
        db.collection('posts').find().toArray((err, result) => {
          db.collection('comments').find().toArray((error, rslt) => {
            if (err) return console.log(err)
            res.render('single-discussion-view.ejs', {
              user : req.user,
              posts: result,
              comment: rslt
            })
          })
        })
    });

    app.put('/feed', isLoggedIn, function(req, res){
        console.log(req.body)
        console.log(req.user)
        db.collection('messages').findOneAndUpdate({
            name: req.body.name,
            size: req.body.size,
            order: req.body.order,
            completedBy: null
        },{
            $set: {completedBy: req.user.local.username}
        }, {
            sort:{_id: -1}},
        (err, result) => {
            if (err) return res.send(err)
            console.log(`Order Completed`);
            res.send();
        }
        )
    })

// Settings Profile
app.get('/my-dashboard-setting', isLoggedIn, function(req, res) {
    res.render('my-dashboard-setting', {user:req.user});
});


    // Discussion Section
    app.get('/discussions', isLoggedIn, function(req, res) {
        res.render('discussions.ejs', {user:req.user});
    });
    // how to target discussions
    // app.get('/abc/:id', isLoggedIn, function(req, res) {
    //     // console.log(req)
    //     // console.log(req.params);
    //     // console.log(req.query);
    //         // look inside topics and find specific id
    //     db.collection("topics").findOne({_id:ObjectId(req.params.id)}, (err, result)=>{
    //         res.render('single-discussion-view.ejs', {info:result, user:req.user.local});
    //     })
    // });
// add about section
    app.get('/about', isLoggedIn, function(req, res) {
        res.render('about.ejs', {user:req.user});
    });

      
    // Add a new event 
       app.get('/addNewEvent', isLoggedIn, function(req, res) {
        res.render('addNewEvent.ejs', {user:req.user});
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('login.ejs');
    });


// rendering main page
    app.get('/main', isLoggedIn, function(req, res) {
        db.collection('users').find().toArray((err, result) => {
            db.collection('events').find().toArray((err2, result2) => {
                if (err) return console.log(err)
                console.log(result2[0], "this is it")
                res.render('main.ejs', {
                    user : req.user,
                    posts: result,
                    eventsImg: result2,
                    message: req.flash('loginMessage')
                })
            })
        
        })
    });



// QP Posts routes ===============================================================
    app.get('/post', isLoggedIn, function(req, res) {
        db.collection('posts').findOne({_id: ObjectId(req.query.id)}, (err, result) => {
            db.collection('comments').find().toArray((error, rslt) => {
                if (err) return console.log(err)
                console.log(result, req.query.id);
                res.render('post.ejs', {
                    user : req.user,
                    post: result,
                    comments: rslt
                })
            })
        })
    });
    // var storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //     cb(null, 'public/img/')
    //     },
    //     filename: (req, file, cb) => {
    //     cb(null, file.fieldname + '-' + Date.now() + ".png")
    //     }
    // })
    var upload = multer({storage: storage})
    app.post('/createTopic', upload.single('file-to-upload'), (req, res) => {
      db.collection('topics').save({
        // image: "img/" + req.file.filename,
        name: req.body.name,
        user: req.user._id,
        description: req.body.description,
        likes: 0
        // timestamp: req.body.timestamp
        }, (err, result) => {
        if (err) return console.log(err)
        console.log(result)
        console.log('saved to database')
        res.redirect(`/${result.ops[0]._id}`)
      })
    })
    app.put('/updateTopic', isLoggedIn,  (req, res) => {
      db.collection('topics').findOneAndUpdate({
        image: req.body.image,
        name: req.body.name,
        description: req.body.description,
        user: req.user._id,
        // likes: 0
        },{ $set:{   
            image: req.body.newImage,
            name: req.body.newName,
            description: req.body.newDescription
            } },{ sort:{_id: -1} }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database');
        res.redirect(`/${result.ops[0]._id}`);
      })
    })

// create new post/event
const path = require('path')
app.post('/createEvent', upload.single('file-to-upload'), (req, res) => {
    console.log(req)
    db.collection('events').save({
      image: "/uploads/file-to-upload-"+ Date.now() + path.extname(req.file.filename),
      name: req.body.name,
      user: req.user._id,
      description: req.body.description,
      likes: 0,
      title: req.body.title, 
      startTime: req.body.startTime,
      endTime:req.body.endTime

      // timestamp: req.body.timestamp
      }, (err, result) => {
      if (err) return console.log(err)
      console.log(result)
      console.log('saved to database')
      res.redirect("/main")
    })
  })

// can delete only if your admin
    app.delete('/delTopic', isLoggedIn , isAdmin, (req, res) => {
        // console.log(req.body);
      db.collection('topics').findOneAndDelete({
        _id: ObjectId(req.body.topicId)
        }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Topic is deleted!')
      })
    })

    //USER'S TOPICS- shows what specific user started
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('topics').find().toArray((err, result) => {
            for(topic in result) {
                if(topic.user != ObjectId(req.user.id)) 
                    delete result.topic
            }
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            topics: result
          })
        })
    });
    // COMMENTS SECTION

    app.get('/comment', isLoggedIn, function(req, res) {
        db.collection('comments').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('post.ejs', {
            user : req.user,
            comments: result
        })
        })
    });

    app.post('/createComment', (req, res) => {
        console.log(req);
        console.log("hello");
        const topicId = req.headers.referer.slice(req.headers.referer.lastIndexOf("/")+ 1)
        const comingFromPage = req.headers['referer'].slice(req.headers['origin'].length);
        console.log("where are you", comingFromPage)
        db.collection('comments').insertOne({
            comment: req.body.comment, 
            user: req.user._id, 
            topic: topicId
            // timestamp: req.body.timestamp
        }, (err, result) => {
            if (err) return res.send(err);
            console.log('Comment Created');
            res.redirect(comingFromPage);
        })
    })
    app.delete('/delComment', (req, res) => {
        db.collection('comments').findOneAndDelete({
          comment: req.body.comment,
          user: req.user._id,
          topic: req.body.postId
          }, (err, result) => {
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        })
      })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
      

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/main', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
       
// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });
    app.get('/:id', isLoggedIn, function(req, res) {
        // console.log(req)
        // console.log(req.params);
        // console.log(req.query);
            // look inside topics and find specific id
        db.collection("topics").findOne({_id:ObjectId(req.params.id)}, (err, result)=>{
            db.collection('comments').find({'topic': req.params.id }).toArray((err, result2) => {
                if (err) return console.log(err)
                console.log(result2)
                res.render('single-discussion-view.ejs', {info:result, user:req.user.local, comments: result2} );
          })
        })
    });
};


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


// checks if person is admin
function isAdmin(req, res, next) {
    if (req.user.local.role === "admin")
        return next();

    res.redirect('/');
}