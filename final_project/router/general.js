const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new customer
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
  }

  if (isValid(username)) {
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
  } else {
    return res.status(404).json({ message: "Customer with username " + username + " already exists!" });
  }
});

// Task 1 & Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject({ status: 500, message: "Unable to retrieve books" });
    }
  });

  getBooks
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 2 & Task 10: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    let foundBook = null;
    const keys = Object.keys(books);
    for (let key of keys) {
      if (key === isbn) {
        foundBook = books[key];
        break;
      }
    }
    if (foundBook) {
      resolve(foundBook);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 3 & Task 10: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const keys = Object.keys(books);
    for (let key of keys) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "No books found by this author" });
    }
  });

  getBooksByAuthor
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 4 & Task 10: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const keys = Object.keys(books);
    for (let key of keys) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "No books found with this title" });
    }
  });

  getBooksByTitle
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

/*
 ==============================================================================
 Task 10 - Task 13: 4 Methods using Axios with Async/Await and Promises
 ==============================================================================
*/

// Method 1: Get all books using async/await with Axios
async function getAllBooksAxios(url = 'http://localhost:5000/') {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Method 2: Get book details by ISBN using Promises with Axios
function getBookByISBNAxios(isbn, baseUrl = 'http://localhost:5000') {
  return axios.get(`${baseUrl}/isbn/${isbn}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

// Method 3: Get book details by Author using Promises with Axios
function getBooksByAuthorAxios(author, baseUrl = 'http://localhost:5000') {
  return axios.get(`${baseUrl}/author/${encodeURIComponent(author)}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

// Method 4: Get book details by Title using async/await with Axios
async function getBooksByTitleAxios(title, baseUrl = 'http://localhost:5000') {
  try {
    const response = await axios.get(`${baseUrl}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
