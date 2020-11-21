document.addEventListener("DOMContentLoaded", function () {
//dom elements
const listPanel = document.querySelector("#list-panel");
const showPanel = document.querySelector("#show-panel");

let userObj = {
  id: 1,
  username: "pouros"
}
let book = {}

//event listeners
  listPanel.addEventListener("click", event => {
      const bookId = event.target.dataset.id 
      Array.from(showPanel.children).forEach(book => {
          if (book.dataset.id === bookId) {
              book.style.display = ""
          } else {
              book.style.display = "none"
          }
      })
  })

  showPanel.addEventListener("click", event => {
    const bookUl = event.target.parentElement.children[3]
    return fetch(`http://localhost:3000/books/${event.target.dataset.id}`)
      .then((response) => response.json())
      .then((bookData) => {
        if(event.target.tagName === "BUTTON") {
          if (!bookData.users.find( (user) => user.id == userObj.id)) {
            bookData.users.push(userObj) 
            const newLikeLi = document.createElement("li")
            newLikeLi.textContent = userObj.username 
            bookUl.append(newLikeLi) 
            } else {
              bookData.users.pop(userObj)
              const deleteLi = Array.from(bookUl.children).find(child => child.textContent === userObj.username)
              deleteLi.remove()
            }
            console.log(bookData.users)
            likeBookFetchPath(bookData, event.target.dataset.id)
          }
      });
  })
//fetches
  const booksFetchGet = () => {
    return fetch("http://localhost:3000/books")
      .then((response) => response.json())
      .then((booksData) => renderBooks(booksData));
  };
  

  const likeBookFetchPath = (bookData, bookId) => {
      return fetch(`http://localhost:3000/books/${bookId}`, {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(bookData)
      })
        .then(resp => resp.json())
        .then(newBookData => renderShowBook(newBookData))
  }


//render functions
  const renderBooks = (books) => {
      books.forEach(book => {
          renderOneBook(book)
          renderShowBook(book)
      })
  }

  const renderOneBook = (book) => {
    const bookDiv = document.createElement("div")
    bookDiv.dataset.id = book.id
    bookDiv.textContent = `${book.title} by ${book.author}`
    listPanel.append(bookDiv)
  }
  
  const renderShowBook = (book) => {
    const showBookDiv = document.createElement("div")
    showBookDiv.dataset.id = book.id
    showBookDiv.style.display = "none"
    const img = document.createElement("img")
    img.src = book.img_url
    img.alt = "book image"
    const p = document.createElement("p")
    p.textContent = book.description
    const button = document.createElement("button")
    button.textContent = "Like Book"
    button.dataset.id = book.id
    const ul = document.createElement("ul")
    ul.textContent = "Users Who Have Liked The Book"
    ul.dataset.id = book.id 
    book.users.forEach(user => {
      const li = document.createElement("li")
      li.textContent = user.username
      li.dataset.id = user.id 
      ul.append(li)
    })
      showBookDiv.append(img, p, button, ul)
      showPanel.append(showBookDiv)
}


  //initializers
  const initialize = () => {
    booksFetchGet();
  };
  initialize();
});
