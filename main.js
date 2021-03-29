/******************** 
 * Variables
********************/

const board = document.querySelector('.board')
const listButton = document.querySelector('.add-list')

/******************** 
 * Functions
********************/

/**
 * Activates the form and gets title for the new card or list
 * @param {HTMLElement} form to be activated
 * @param {HTMLElement} button that fired activateForm
 */
const activateForm = (form, button) => {
  const formContainer = form.parentElement
  const input = form.querySelector('.form-input')
  button.classList.add('hidden')
  formContainer.classList.remove('hidden')
  input.focus()

  const submitForm = e => {
    e.preventDefault()
    const title = input.value.trim()
    if (!title) return
    if (form.classList.contains('new-card')) {
      const list = button.parentElement
      createCard(list, title)
    } else if (form.classList.contains('new-list')) {
      createList(title)
    }
    button.classList.remove('hidden')
    formContainer.classList.add('hidden')
    input.value = ''
    form.removeEventListener('submit', submitForm)
  }

  const closeForm = e => {
    if (!e.target.closest('.cancel')) return
    button.classList.remove('hidden')
    formContainer.classList.add('hidden')
    input.value = ''
    form.removeEventListener('click', closeForm)
  }

  form.addEventListener('submit', submitForm)
  form.addEventListener('click', closeForm)
}

/*
FUNCTIONS TO HIDE AND SHOW FORMS
*/

/**
 * Creates a new card on the list
 * @param {HTMLElement} list element where the new card is added
 * @param {String} title of the new card
 */
const createCard = (list, title) => {
  const newCard = document.createElement('li')
  newCard.classList.add('card')
  newCard.innerHTML = `
    <p class="card-title">${title}</p>
    <button class="delete-card">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>`

  const cardButton = list.querySelector('.add-card')
  list.insertBefore(newCard, cardButton)
}

/**
 * Creates a new list on the board
 * @param {String} title of the new list
 */
const createList = title => {
  const newList = document.createElement('ul')
  newList.classList.add('list')
  newList.innerHTML = `
    <div class="list-header">
      <p class="list-title">${title}</p>
      <button class="delete-list">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
    <li class="add-card">
      <a href="#">
        <img class="plus-icon" src="/images/plus.svg" alt="Plus sign">
        Add another card
      </a>
    </li>
    <li class="form-container hidden">
      <form action="#" class="new-card">
        <textarea name="new-card-title" id="new-card-title" rows="3"
        placeholder="Enter a title for this card..." class="form-input"></textarea>
        <div class="form-buttons">
          <button type="submit" class="submit">Add card</button>
          <button class="cancel">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </form>
    </li>
  `

  board.insertBefore(newList, listButton)

  // Event listener for the delete button
  const deleteListButton = newList.querySelector('.delete-list')
  deleteListButton.addEventListener('click', e => {
    const list = e.target.closest('.list')
    board.removeChild(list)
  })
}

/******************** 
 * Event listeners
********************/

// Lisää nää listenerit funktioiden sisään
board.addEventListener('click', e => {
  if (!e.target.closest('.delete-card') && !e.target.closest('.add-card')) return
  const list = e.target.closest('.list')

  if (e.target.closest('.add-card')) {
    const form = list.querySelector('form')
    const button = list.querySelector('.add-card')
    activateForm(form, button)
  } else if (e.target.closest('.delete-card')) {
    const card = e.target.closest('.card')
    list.removeChild(card)
  }
})

listButton.addEventListener('click', e => {
  const button = e.currentTarget
  const form = document.querySelector('.new-list')
  activateForm(form, button)
})