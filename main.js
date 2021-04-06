/**
 * Activates the form and gets title for the new card or list
 * @param {HTMLElement} form to be activated
 * @param {HTMLElement} button that fired activateForm
 */
const activateForm = (form, button) => {
  showHideForm(form, button)
  const input = form.querySelector('.form-input')
  input.focus()

  form.addEventListener('submit', submitForm)
  form.addEventListener('click', closeForm)

  function submitForm(e) {
    e.preventDefault()
    const title = input.value.trim()
    if (!title)
      return
    if (form.classList.contains('new-card')) {
      const list = button.parentElement
      createCard(list, title)
    } else if (form.classList.contains('new-list')) {
      createList(title)
    }
    showHideForm(form, button)
    input.value = ''
    form.removeEventListener('submit', submitForm)
    form.removeEventListener('click', closeForm)
  }

  function closeForm(e) {
    if (!e.target.closest('.cancel'))
      return
    showHideForm(form, button)
    input.value = ''
    form.removeEventListener('submit', submitForm)
    form.removeEventListener('click', closeForm)
  }
}

/**
 * Show or hide form according to classes
 * @param {HTMLElement} form element to be shown/hidden 
 * @param {HTMLElement} button element to be shown/hidden 
 */
const showHideForm = (form, button) => {
  const formContainer = form.parentElement
  if (formContainer.classList.contains('hidden')) {
    formContainer.classList.remove('hidden')
    button.classList.add('hidden')
  } else {
    formContainer.classList.add('hidden')
    button.classList.remove('hidden')
  }
}

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

  // Listen delete-button and delete card on click
  const deleteCardButton = newCard.querySelector('.delete-card')
  deleteCardButton.addEventListener('click', e => {
    const card = e.target.closest('.card')
    const currentList = e.target.closest('.list')
    currentList.removeChild(card)
  })

  dragDropCard(newCard)
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

  const board = document.querySelector('.board')
  board.insertBefore(newList, addListButton)

  // Listen delete-button and delete list on click
  const deleteListButton = newList.querySelector('.delete-list')
  deleteListButton.addEventListener('click', e => {
    const list = e.target.closest('.list')
    board.removeChild(list)
  })

  // Listen add-card button and call activateForm() on click
  const addCardButton = newList.querySelector('.add-card')
  addCardButton.addEventListener('click', _ => {
    const form = newList.querySelector('.new-card')
    activateForm(form, addCardButton)
  })
}

/**
 * Adds drag and drop functionalities to card
 * @param {HTMLElement} card element that can be dragged & dropped
 */
const dragDropCard = card => {
  card.addEventListener('pointerdown', e => {
    e.preventDefault()
    if (e.target.closest('.delete-card')) return
    const cardRect = card.getBoundingClientRect()

    // Create preview
    const preview = card.cloneNode()
    preview.classList.add('preview')
    preview.style.height = `${cardRect.height}px`
    card.before(preview)

    // Prepare card for dragging
    document.body.append(card)
    card.dataset.dragging = 'true'
    card.style.left = `${cardRect.left}px`
    card.style.top = `${cardRect.top}px`
    card.style.width = `${cardRect.width}px`
    card.style.height = `${cardRect.height}px`

    card.setPointerCapture(e.pointerId)
    card.addEventListener('pointermove', move)
    card.addEventListener('pointerup', up)

    function move(e) {
      const left = parseFloat(card.style.left)
      const top = parseFloat(card.style.top)
      card.style.left = `${left + e.movementX}px`
      card.style.top = `${top + e.movementY}px`
      card.style.border = 'solid 1px #0079BF'

      const currentPosition = document.elementFromPoint(left, top)
      const list = currentPosition.closest('.list')
      if (!list) return

      const previewExists = [...list.children].find(el => el === preview)
      if (!previewExists) {
        const addCardButton = list.querySelector('.add-card')
        list.insertBefore(preview, addCardButton)
      }

      const cards = [...list.querySelectorAll('.card')]
      const cardPositions = cards.map(card => card.getBoundingClientRect())
      const cardPosition = cardPositions.findIndex(pos => {
        return (pos.left < left && left < pos.right) && (pos.top < top && top < pos.bottom)
      })

      if (cardPosition === -1) return
      const cardElement = cards[cardPosition]
      const previewPosition = cards.findIndex(card => card === preview)

      if (cardPosition > previewPosition) {
        cardElement.after(preview)
      } else {
        cardElement.before(preview)
      }
    }

    function up(e) {
      card.dataset.dragging = 'false'
      card.releasePointerCapture(e.pointerId)
      preview.before(card)
      preview.remove()
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerup', up)
    }
  })
}

/******************** 
 * Event listeners
********************/

const addListButton = document.querySelector('.add-list')
addListButton.addEventListener('click', e => {
  const button = e.currentTarget
  const form = document.querySelector('.new-list')
  activateForm(form, button)
})