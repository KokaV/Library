const myLibrary = JSON.parse(localStorage.getItem("library")) || [];

class Book {
    constructor(title, author, pages, read, image) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.image = image;
    }

    // კლასის მეთოდი სტატუსის შესაცვლელად
    toggleReadStatus() {
        this.read = !this.read;
    }
}

function addBookToLibrary(title, author, pages, read, image) {
    const newBook = new Book(title, author, pages, read, image);
    myLibrary.push(newBook);
}

const bookForm = document.querySelector("#book-form");

bookForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const image = document.getElementById("image").value;
    const read = document.getElementById("read").checked;

    addBookToLibrary(title, author, pages, read, image);
    bookForm.reset();

    displayBooks();

    localStorage.setItem("library", JSON.stringify(myLibrary));
});

function displayBooks() {
    const container = document.getElementById("library-container");
    container.innerHTML = ""; 

    myLibrary.forEach(function(book) {
        const bookCard = `
            <div class="book-card">
                <img src="${book.image}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>Author: <strong>${book.author}</strong></p>
                <p>Pages: <strong>${book.pages}</strong></p>
                
                <div class="card-actions">
                    <label class="switch-label">
                        Read:
                        <input type="checkbox" class="toggle-read" data-id="${book.id}" ${book.read ? "checked" : ""}>
                    </label>
                    
                    <button class="delete-btn" data-id="${book.id}" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        container.innerHTML += bookCard;
    });
}

displayBooks();

const container = document.getElementById("library-container");

container.addEventListener("change", function(e) {
    if (e.target.classList.contains("toggle-read")) {
        const bookId = e.target.dataset.id;
        
        // ვპოულობთ წიგნს მასივში
        const bookData = myLibrary.find(function(b) {
            return b.id === bookId;
        });
        
        if (bookData) {
            // ვქმნით ნამდვილ Book კლასის ობიექტს, რომ გამოვიყენოთ მისი მეთოდი
            // (იმიტომ რომ localStorage-დან ამოღებული ობიექტები მეთოდებს "კარგავენ" და ზოგადი ობიექტები ხდებიან)
            const book = new Book(
                bookData.title, 
                bookData.author, 
                bookData.pages, 
                bookData.read, 
                bookData.image
            );
            book.id = bookData.id; // ვინარჩუნებთ ძველ აიდის
            
            book.toggleReadStatus(); // ვიყენებთ კლასის მეთოდს
            
            // ვანახლებთ მასივში მნიშვნელობას
            bookData.read = book.read;
            
            localStorage.setItem("library", JSON.stringify(myLibrary));
        }
    }
});

container.addEventListener("click", function(e) {
    const deleteBtn = e.target.closest(".delete-btn");
    
    if (deleteBtn) {
        const bookId = deleteBtn.dataset.id;
        
        const bookIndex = myLibrary.findIndex(function(b) {
            return b.id === bookId;
        });
        
        if (bookIndex !== -1) {
            myLibrary.splice(bookIndex, 1);
            displayBooks();
            localStorage.setItem("library", JSON.stringify(myLibrary));
        }
    }
});