// element var
const addNoteBtn1 = document.getElementById("create-note-btn");
// container
const containerDivEl = document.getElementById("container-div");
// no notes
const noNotesDivEl = document.getElementById("no-notes-div");
const addNoteBtn2 = document.getElementById("create-note-btn-2");
// dialog
const dialogDivEL = document.getElementById("dialog-div");
const dialogCloseBtn = document.getElementById("dialog-close-btn");
const dialogTitleEl = document.getElementById("dialog-title");
const noteTitleEl = document.getElementById("note-title");
const noteContentEL = document.getElementById("note-content");
const saveBtnEl = document.getElementById("save-btn");
const formEL = document.getElementById("note-form");
// theme
const toggleBtn = document.getElementById("theme-toggle-btn");
const sunSvgEl = document.getElementById("sun-svg");
const moonSvgEL = document.getElementById("moon-svg");
const htmlEL = document.children[0];

//data store var
let notes = [];
let editingNoteId = null;
const LOCAL_STORAGE_KEY = "notes";
const THEME_KEY = "theme";

// open note dialog
function openNoteDialog(e, noteId = null) {
  if (noteId) {
    // edit note
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    dialogTitleEl.textContent = "Edit Note";
    saveBtnEl.textContent = "update note";
    noteTitleEl.value = noteToEdit.title;
    noteContentEL.value = noteToEdit.content;
    // color
    // get checked input color
    const noteColorCheckedEl = document.querySelector(
      "input[name = 'color']:checked",
    );
    noteColorCheckedEl.checked = false;
    // find edit users previous color ratio input and set it's attribute checked
    const focusColorEl = document.querySelector(
      `input[name = 'color'][value = '${noteToEdit.color.join(" ")}']`,
    );
    focusColorEl.checked = true;
  } else {
    // add note
    editingNoteId = null;
    dialogTitleEl.textContent = "Add New Note";
    saveBtnEl.textContent = "Save note";
    formEL.reset();
  }

  // on dialog open removes the previous validation's styles
  // title
  noteTitleEl.classList.remove(
    "border",
    "border-red-500",
    "focus:outline-none",
  );
  noteTitleEl.classList.add("focus:outline-2");
  noteTitleEl.nextElementSibling.classList.add("hidden");
  // content
  noteContentEL.classList.remove(
    "border",
    "border-red-500",
    "focus:outline-none",
  );
  noteContentEL.classList.add("focus:outline-2");
  noteContentEL.nextElementSibling.classList.add("hidden");

  dialogDivEL.showModal();
}

// close dialog
function closeNoteDialog() {
  dialogDivEL.close();
  formEL.reset();
}

// note save
function saveNote(event) {
  event.preventDefault();

  const noteTitle = noteTitleEl.value.trim();
  const noteContent = noteContentEL.value.trim();
  const noteColor = document.querySelector(
    "input[name = 'color']:checked",
  ).value;
  const noteColorArr = noteColor.split(" ");

  if (noteTitle == "" || noteContent == "") {
    // title
    if (noteTitle == "") {
      noteTitleEl.classList.add(
        "border",
        "border-red-500",
        "focus:outline-none",
      );
      noteTitleEl.classList.remove("focus:outline-2");
      noteTitleEl.nextElementSibling.classList.remove("hidden");
    } else {
      noteTitleEl.classList.remove(
        "border",
        "border-red-500",
        "focus:outline-none",
      );
      noteTitleEl.classList.add("focus:outline-2");
      noteTitleEl.nextElementSibling.classList.add("hidden");
    }

    // content
    if (noteContent == "") {
      noteContentEL.classList.add(
        "border",
        "border-red-500",
        "focus:outline-none",
      );
      noteContentEL.classList.remove("focus:outline-2");
      noteContentEL.nextElementSibling.classList.remove("hidden");
    } else {
      noteContentEL.classList.remove(
        "border",
        "border-red-500",
        "focus:outline-none",
      );
      noteContentEL.classList.add("focus:outline-2");
      noteContentEL.nextElementSibling.classList.add("hidden");
    }

    return;
  }

  if (editingNoteId) {
    // update note
    const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
    if (noteIndex >= 0) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        title: noteTitle,
        content: noteContent,
        color: noteColorArr,
      };
    }
  } else {
    // add note
    notes.unshift({
      id: generateId(),
      title: noteTitle,
      content: noteContent,
      color: noteColorArr,
    });
  }

  storeInLocalFn();
  closeNoteDialog();
  renderNotesFn();
}

// generate id
const generateId = () => crypto.randomUUID();

// save in local
function storeInLocalFn() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
}

// rerender
function renderNotesFn() {
  let fetchedNotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  notes = fetchedNotes ?? [];

  //  console.log(notes);
  //  create
  if (notes.length == 0) {
    // no list-items visible
    containerDivEl.innerHTML = "";
    noNotesDivEl.classList.remove("hidden");
    return;
  } else {
    // no list-items hide
    noNotesDivEl.classList.add("hidden");

    // fragment
    const fragmentEL = document.createDocumentFragment();

    // create card
    notes.forEach((note) => {
      const cardEl = document.createElement("div");
      cardEl.classList.add("card", note.color[0], note.color[1]);

      const actionDivEl = document.createElement("div");
      actionDivEl.classList.add("card-action");
      cardEl.append(actionDivEl);

      const editBtnEL = document.createElement("button");
      editBtnEL.setAttribute("title", "edit")
      editBtnEL.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" />
              </svg>`;
      editBtnEL.addEventListener("click", (e) => openNoteDialog(e, note.id));
      actionDivEl.append(editBtnEL);

      const deleteBtnEL = document.createElement("button");
      deleteBtnEL.setAttribute("title", "delete")
      deleteBtnEL.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                </svg>`;
      deleteBtnEL.addEventListener("click", () => deleteNoteFn(note.id));
      actionDivEl.append(deleteBtnEL);

      const cardTitleEL = document.createElement("h3");
      cardTitleEL.classList.add("card-title");
      cardTitleEL.textContent = note.title;
      cardEl.append(cardTitleEL);

      const cardContentEL = document.createElement("pre");
      cardContentEL.classList.add("text-pretty");
      cardContentEL.textContent = note.content;
      cardEl.append(cardContentEL);

      // append
      fragmentEL.append(cardEl);
    });
    containerDivEl.innerHTML = "";
    containerDivEl.append(fragmentEL);
  }
}

function deleteNoteFn(noteID) {
  const confirmAlert = confirm("Do you want to delete this note ?")
  if (!confirmAlert) return;
  
  notes = notes.filter((note) => note.id !== noteID);
  storeInLocalFn();
  renderNotesFn();
}

// theme toggle fn
function themeToggle() {
  if (htmlEL.classList.contains("dark")) {
    sunSvgEl.classList.add("hidden");
    moonSvgEL.classList.remove("hidden");
    // local store
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    sunSvgEl.classList.remove("hidden");
    moonSvgEL.classList.add("hidden");
    localStorage.setItem(THEME_KEY, "light");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // get theme form local & set to UI
  htmlEL.className = localStorage.getItem(THEME_KEY);
  themeToggle();
  // get notes data from local and display in UI
  renderNotesFn();
});

// events
addNoteBtn1.addEventListener("click", openNoteDialog);
addNoteBtn2.addEventListener("click", openNoteDialog);
dialogCloseBtn.addEventListener("click", closeNoteDialog);
formEL.addEventListener("submit", saveNote);
toggleBtn.addEventListener("click", () => {
  htmlEL.classList.toggle("dark");
  themeToggle();
});
