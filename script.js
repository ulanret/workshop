 const books = [];
 const RENDER_EVENT = 'render-todo';
 const SAVED_EVENT = 'saved-todo';
 const STORAGE_KEY = 'TODO_APPS';
 
 function generateId() {
   return +new Date();
 }

 function checkComplete() {
    const checkComplete = document.getElementById("inputBookIsComplete");  
    if (checkComplete.checked == true){  
       return true;
     }   
     else {  
       return false;

     }  
 }
 
 

 function generateTodoObject(id, title, author, year, isCompleted) {
   return {
     id,
     title,
     author,
     year,
     isCompleted
   };
 }
 
 function findTodo(bookId) {
   for (const todoItem of books) {
     if (todoItem.id === bookId) {
       return todoItem;bookI
     }
   }
   return null;
 }
 
 function findTodoIndex(bookId) {
   for (const index in books) {
     if (books[index].id === bookId) {
       return index;
     }
   }
   return -1;
 }
 
 
 /**
  * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
  *
  * @returns boolean
  */
 function isStorageExist() /* boolean */ {
   if (typeof (Storage) === undefined) {
     alert('Browser kamu tidak mendukung local storage');
     return false;
   }
   return true;
 }
 
 /**
  * Fungsi ini digunakan untuk menyimpan data ke localStorage
  * berdasarkan KEY yang sudah ditetapkan sebelumnya.
  */
 function saveData() {
   if (isStorageExist()) {
     const parsed /* string */ = JSON.stringify(books);
     localStorage.setItem(STORAGE_KEY, parsed);
    //  document.dispatchEvent(new Event(SAVED_EVENT));
   }
 }
 
 /**
  * Fungsi ini digunakan untuk memuat data dari localStorage
  * Dan memasukkan data hasil parsing ke variabel {@see books}
  */
 function loadDataFromStorage() {
   const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);
 
   if (data !== null) {
     for (const todo of data) {
       books.push(todo);
     }
   }
 
   document.dispatchEvent(new Event(RENDER_EVENT));
 }
 
 function makeTodo(todoObject) {
 
   const {id, title, author, year, isCompleted} = todoObject;
 
   document.createElement('table')
   const textTitle = document.createElement('h3');
   textTitle.innerText = title;
 
   const textAuthor = document.createElement('p');
   textAuthor.innerText =  'Penulis: ' + author;

   const textYear = document.createElement('p');
   textYear.innerText = 'Tahun: ' + year;
 
   const container = document.createElement('article');
   container.classList.add('book_item');
   container.append(textTitle, textAuthor, textYear);
   container.setAttribute('id', `book-${id}`);
 
   if (todoObject.isCompleted == true) {
 
    const div = document.createElement('div');
    div.classList.add('action');
    container.append(div);


    const editButton = document.createElement('button');
     editButton.classList.add('green');
    editButton.innerText = 'edit';
     editButton.addEventListener('click', function () {
      //  editBook(id);
     });
     
     const undoButton = document.createElement('button');
     undoButton.classList.add('green');
    undoButton.innerText = 'tandai belum dibaca';
     undoButton.addEventListener('click', function () {
       undoTaskFromCompleted(id);
     });
 
     const trashButton = document.createElement('button');
     trashButton.classList.add('red');
     trashButton.innerText = 'Hapus Buku';
     trashButton.addEventListener('click', function () {
       removeTaskFromCompleted(id);
     });
 
     div.append(undoButton, trashButton, editButton);
   } else {

    const div = document.createElement('div');
    div.classList.add('action');
    container.append(div);

    const checkButton = document.createElement('button');
    checkButton.classList.add('green');
    checkButton.innerText = 'tandai sudah dibaca';
       checkButton.addEventListener('click', function () {
        addTaskToCompleted(id);
      });
     
    const editButton = document.createElement('button');
    editButton.classList.add('green');
    editButton.innerText = 'edit';
     
    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus Buku';
     
    trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(id);
    });
        
    div.append(checkButton, trashButton, editButton);
   }

   return container;
//    console.log(todoObject.isCompleted) ;
 }
 
 function addBook() {
   const title = document.getElementById('inputBookTitle').value;
   const author = document.getElementById('inputBookAuthor').value;
   const year = document.getElementById('inputBookYear').value;
   
 
   const generatedID = generateId();
   const isCompleted = checkComplete();
   const todoObject = generateTodoObject(generatedID, title, author, year, isCompleted);
   books.push(todoObject);
 
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
 function addTaskToCompleted(bookId /* HTMLELement */) {
   const book = findTodo(bookId);
 
   if (book == null) return;
 
   book.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
 function removeTaskFromCompleted(bookId /* HTMLELement */) {
   const book = findTodoIndex(bookId);
   const text = "Anda yakin ingin menghapus buku ?";
   if (book === -1) return;
   if(confirm(text) == true) {
    books.splice(book, 1);
    console.log("Buku telah dihapus");
   } 
   
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
 function undoTaskFromCompleted(bookId /* HTMLELement */) {
 
   const book = findTodo(bookId);
   if (book == null) return;
 
   book.isCompleted = false;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }

 document.addEventListener('DOMContentLoaded', function () {
 
   const submitForm  = document.getElementById('inputBook');
   
   submitForm.addEventListener('submit', function (event) {
     addBook();
     event.preventDefault();
   });
 
   if (isStorageExist()) {
     loadDataFromStorage();
   }
 });
 
 document.addEventListener(SAVED_EVENT, () => {
   console.log('Data berhasil di simpan.');
 });
 
 document.addEventListener(RENDER_EVENT, function () {
   console.log(books)
   const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
   const listCompleted = document.getElementById('completeBookshelfList');
 
   // clearing list item
   uncompletedTODOList.innerHTML = '';
   listCompleted.innerHTML = '';
 
   for (const todoItem of books) {
     const todoElement = makeTodo(todoItem);
     if (todoItem.isCompleted) {
       listCompleted.append(todoElement);
     } else {
       uncompletedTODOList.append(todoElement);
     }
   }
 });

  document.getElementById('searchSubmit').addEventListener("click", function (event){
  event.preventDefault();
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookList = document.querySelectorAll('.book_item > h3');
    for (book of bookList) {
      if (book.innerText.toLowerCase().includes(searchBook)) {
      book.parentElement.style.display = "block";
    } else {
      book.parentElement.style.display = "none";

    }
  }
})



