# wordle-solver

![image](https://user-images.githubusercontent.com/32311654/182776739-c0374a53-0c19-45f0-bc45-c83f375d633e.png)

Link to production hosted on Heroku: [wordle-solver](https://wordle-solver-abanuelo.herokuapp.com/).

## Background

I am learning how to work with the MERN stack in this project: (MongoDB - DB, Express + Node.js - backend, react - frontend). Instead of serving a backend as intended in the MERN stack, I use MongoDB Atlas to make the app serverless. This app is serverless with exposed endpoints from MongoDB Atlas to serve requests. DB contains total of 10,000+ valid wordle words uploaded and parsed into documents inside a `wordle_words` collecton.

The inspiration in creating this app is my love of [Wordle](https://www.nytimes.com/games/wordle/index.html). Go do yours now if you haven't done so already!!! I was wondering if you could create a system that could filter all possible, next best searches based on your current guesses. The way I do that is by querying the database via a regex of the following format:

```
[^{all red letters + yellow letters at pos n}] or green letter 
Example: [^ab]a[^rr]de
```

More updates to come 😁❤️ namely:
- Can we do a pronoun wordle by filtering 5 letter words via Wikipedia API? 🤔
- Can we scrape the actual Wordle site and enter our intial guess and devise a system to automatically solve it? 🤔
- Can we get user input and make this a valid game of wordle but provide suggested hints? (kinda defeats the purpose though...) 

