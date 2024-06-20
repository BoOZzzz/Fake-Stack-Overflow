// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Answer = require('./models/answers');
const Question = require('./models/questions');
const Tag = require('./models/tags');
const User = require('./models/users');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const router = express.Router();
const bcrypt = require('bcrypt');


const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/fake_so_sessions',
    collection: 'sessions'
});

store.on('error', (error) => {
    console.log('Session store error:', error);
});

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}))


let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (error) => {
    console.log('MongoDB connection error:', error);
});

app.get('/questions', (req, res) => {
  Question.find()
      .populate('tags')
      .populate('answers')
      .then((questions) => {
          res.json(questions);
      })
      .catch((error) => {
          console.log('Error retrieving questions:', error);
          res.status(500).json({ error: 'Error retrieving questions' });
      });
});

app.get('/answers', (req, res) => {
    Answer.find()
        .then((answers) => {
            res.json(answers);
        })
        .catch((error) => {
            console.log('Error retrieving answers:', error);
            res.status(500).json({ error: 'Error retrieving answers' });
        });
});

app.get('/tags', (req, res) => {
    Tag.find()
        .then((tags) => {
            res.json(tags);
        })
        .catch((error) => {
            console.log('Error retrieving tags:', error);
            res.status(500).json({ error: 'Error retrieving tags' });
        });
});

app.get('/welcome', async (req, res) => {
    const sessionID = req.cookies.sessionId;
    store.get(sessionID, function (error, session) {
        if (error) {
            console.error(error);
        } else {
            if (session) {
                res.json({ loggedIn: true, username: session.user.username });
            }
            else {
                res.json({ loggedIn: false });
            }
        }
    });
});

app.put('/questions/:qid/views', async (req, res) => {
  const qid = req.params.qid;

  const question = await Question.findById(qid);

  question.views += 1;
  await question.save();
  res.status(200).json({ views: question.views });
});

app.post('/tags', async (req, res) => {
  console.log('Received request to create tag:', req.body);
  const { name } = req.body;

  try {
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      console.log(`Tag "${name}" already exists`);
      return res.status(200).json({ tag: existingTag });
    }

    const newTag = new Tag({name});
    await newTag.save();
    console.log(`Created tag "${name}"`);
    res.status(200).json({ tag: newTag });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Error creating tag' });
  }
});

app.post('/questions', async (req, res) => {
  const { title, text, tags, answers, asked_by, ask_date_time, views, summary } = req.body;
  const tagArray = [];
  for (let i = 0; i < tags.length; i++)
  {
      const tag = await Tag.findOne( {name: tags[i]} );
      tagArray.push(tag);
  }
  const question = new Question({ title: title, text: text, tags: tagArray, 
    answers: answers, asked_by: asked_by, ask_date_time: ask_date_time, views: views, summary:summary });
 
  await question.save()
      .then((result) => {
          res.json(result);
      })
      .catch((error) => {
          res.status(500).json({ error: 'Error creating question' });
      });
});

app.post('/:qid/answers', async (req, res) => {
  const { text, ans_by } = req.body;
  const answer = new Answer({ text, ans_by });
  answer.save()
      .then((result) => {
          res.json(result);
      })
      .catch((error) => {
          console.log('Error creating answer:', error);
          res.status(500).json({ error: 'Error creating answer' });
      });

  const question = await Question.findById(req.params.qid);
  question.answers.push(answer);
  await question.save();
});


app.post('/createUser', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
        }
    
        if (password.includes(username) || password.includes(email)) {
            return res.status(400).json({ message: 'Password should not contain username or email id' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        console.log(`New user profile created for username ${adminUsername}`);
      } catch (error) {
        console.error(`Error creating new user profile: ${error}`);
      }
  });


  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        req.session.user = user;
        res.json({ message: 'Login successful', sessionId: req.sessionID });
    } catch (error) {
        console.log('Error logging in user:', error);
        res.status(500).json({ error: 'Error logging in user' });
    }
});

 app.get('/username', (req, res) => {
    console.log(req.cookies.sessionId);
    const sessionID = req.cookies.sessionId;
    store.get(sessionID, function (error, session) {
        if (error) {
            console.error(error);
        } else {
            if (session) {
                res.json({ loggedIn: true, username: session.user.username });
            }
            else {
                res.json({ loggedIn: false });
            }
        }
    });
 });

 app.post('/logout', (req, res) => {
    const sessionID = req.cookies.sessionId;
    if (sessionID) {
        store.destroy(sessionID, (error) => {
            if (error) {
                console.error(error);
            }
            res.clearCookie('sessionId');
            res.json({ message: 'Logout successful' });
        });
    } else {
        res.json({ message: 'No session found' });
    }
});

app.get('/users', (req, res) => {
    User.find()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            console.log('Error retrieving users:', error);
            res.status(500).json({ error: 'Error retrieving users' });
        });
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      // Save the user to the database
      await newUser.save();
      // Send a success response
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/qupvote', async (req, res) => {
    const { qid, username } = req.body;
    const question = await Question.findById(qid);
    question.votes += 1;
    await question.save();
    console.log(question);
    const user = await User.findOne({ username: question.asked_by });
    console.log(user);
    user.reputation += 5;
    await user.save();
    res.json({ votes: question.votes });
});

app.put('/qdownvote', async (req, res) => {
    const { qid, username } = req.body;
    const question = await Question.findById(qid);
    question.votes -= 1;
    await question.save();
    console.log(question);
    const user = await User.findOne({ username: question.asked_by });
    console.log(user);
    user.reputation -= 10;
    await user.save();
    res.json({ votes: question.votes });
});

app.put('/aupvote', async (req, res) => {
    const {aid} = req.body;
    console.log(aid);
    const answer = await Answer.findById(aid);
    console.log(answer);
    answer.votes += 1;
    await answer.save();
    console.log(answer);
    const user = await User.findOne({ username: answer.ans_by });
    console.log(user);
    user.reputation += 5;
    await user.save();
    res.json({ votes: answer.votes });
});

app.put('/adownvote', async (req, res) => {
    const {aid} = req.body;
    console.log(aid);
    const answer = await Answer.findById(aid);
    console.log(answer);
    answer.votes -= 1;
    await answer.save();
    console.log(answer);
    const user = await User.findOne({ username: answer.ans_by });
    console.log(user);
    user.reputation -= 10;
    await user.save();
    res.json({ votes: answer.votes });
});

app.get('/user', (req, res) => {
    const sessionID = req.cookies.sessionId;
    store.get(sessionID, async function (error, session) {
        if (error) {
            console.error(error);
        } else {
            if (session) {
                const user = await User.findOne({ email: session.user.email });
                res.json({ user: user });
            }
        }
    });
});

app.post('/votedQ', async (req, res) => {
    const { username, votedQId } = req.body;

    try {
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { voted_q: { $each: votedQId } } },
        { new: true }
      );
  
      res.status(200).json({ message: 'Voted questions updated successfully', user });
    } catch (error) {
      console.error('Error updating voted questions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.listen(8000, () => {
  console.log('Server started on port 8000');
  
});

module.exports = router;