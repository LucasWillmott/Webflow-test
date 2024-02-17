import gsap from 'gsap'

const config = {
  product: '',
  video: '',
  image: '',
  mvw: '',
  inputs: [],
  outputs: []
}

const modelWrapper = document.querySelector('[model-wrapper]')

/// /////////////////
// Product choice
/// /////////////////

function handleConfigChoices () {
  $('form[data-name="mvw-form"] input, form[data-name="video-form"] input, form[data-name="image-form"] input, form[data-name="product-form"] input').on('change', handleInputChange)

  function handleInputChange (e) {
    const name = e.target.getAttribute('data-name')
    config[name] = e.target.value
    document.querySelector(`[bc="${name}"]`).classList.add('cc-complete')
    handleChecks()
  }
}
handleConfigChoices()

/// /////////////////
// Slots
/// /////////////////

function handleSlots () {
  let activeSlot
  let activeSlotId

  $('[input-slot]').on('click', (e) => {
    if ([...e.currentTarget.classList].includes('cc-filled')) return
    if (activeSlot) activeSlot.classList.remove('cc-active')
    activeSlot = e.currentTarget
    activeSlotId = activeSlot.getAttribute('input-slot')
    activeSlot.classList.add('cc-active')
    document.querySelector('[input-window] .c-card.cc-active')?.classList.remove('cc-active')
    handleWindow('open', 'input')
  })

  $('[output-slot]').on('click', (e) => {
    if ([...e.currentTarget.classList].includes('cc-filled')) return
    if (activeSlot) activeSlot.classList.remove('cc-active')
    activeSlot = e.currentTarget
    activeSlotId = activeSlot.getAttribute('output-slot')
    activeSlot.classList.add('cc-active')
    document.querySelector('[output-window] .c-card.cc-active')?.classList.remove('cc-active')
    handleWindow('open', 'output')
  })

  $('[close-window]').on('click', (e) => {
    activeSlot.classList.remove('cc-active')
    activeSlot = null
    activeSlotId = null
    handleWindow('close', e.currentTarget.getAttribute('close-window'))
  })

  function handleWindow (action, type) {
    if (!config.product.length) {
      alert('Select a product!')
      return
    }

    if (action === 'close') {
      gsap.to(`[${type}-window]`, {
        x: type === 'input' ? '100%' : '-100%',
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          document.querySelector('.c-card.cc-active')?.classList.remove('cc-active')
        }
      })
      return
    }

    gsap.to(`[${type}-window]`, {
      x: 0,
      duration: 0.8,
      ease: 'power3.inOut'
    })
  }

  /// /////////////////
  // Components
  /// /////////////////

  $('[output-window] .c-card, [input-window] .c-card').on('click', handleComponentClick)
  function handleComponentClick (e) {
    const card = e.currentTarget
    const type = card.getAttribute('output-card') !== null ? 'outputs' : 'inputs'
    const cardName = card.querySelector('[card-name]').textContent

    if ([...activeSlot.classList].includes('cc-filled')) {
      document.querySelector('.c-card.cc-active').classList.remove('cc-active')
      const objIndex = config[type].findIndex(item => item.id === activeSlotId)
      config[type][objIndex].card = cardName
    } else {
      config[type].push({ id: activeSlotId, card: cardName })
    }

    const image = card.querySelector('img')
    activeSlot.style.backgroundImage = `url(${image.src})`
    activeSlot.classList.add('cc-filled')
    card.classList.add('cc-active')

    const isCFull = config.product === 'Aquilon C' && config.inputs.length === 4 && config.outputs.length === 4
    const isCPlusFull = config.product === 'Aquilon C+' && config.inputs.length === 6 && config.outputs.length === 5
    console.log(isCFull)
    if (isCFull || isCPlusFull) { alert('full') }
  }

  $('[slot-remove]').on('click', handleComponentRemoveClick)
  function handleComponentRemoveClick (e) {
    e.stopPropagation()
    const slot = e.currentTarget.parentElement
    slot.style.backgroundImage = ''
    slot.classList.remove('cc-filled')

    if (slot.getAttribute('output-slot') !== null) {
      document.querySelector('[output-window] .c-card.cc-active')?.classList.remove('cc-active')
      const id = slot.getAttribute('output-slot')
      config.outputs = config.outputs.filter(e => e.id !== id)
    } else {
      document.querySelector('[input-window] .c-card.cc-active')?.classList.remove('cc-active')
      const id = slot.getAttribute('input-slot')
      config.inputs = config.inputs.filter(e => e.id !== id)
    }
  }
}

handleSlots()

/// /////////////////
// Checks
/// ////////////////

function handleChecks () {
  if (config.product === 'Aquilon C') {
    modelWrapper.classList.add('cc-normal')
  } else {
    modelWrapper.classList.remove('cc-normal')
  }
}

/// /////////////////
// Confirm Selection
/// /////////////////
function handleConfirm () {
  document.querySelector('[confirm-selection]').addEventListener('click', handleConfirmClick)

  function handleConfirmClick () {
    const modelCopy = document.querySelector('[model-wrapper]').cloneNode(true)
    document.querySelector('[export-right]').append(modelCopy)

    gsap.to('[final-step]', {
      marginTop: '-100vh',
      duration: 1,
      ease: 'power3.inOut'
    })

    document.body.style.overflow = 'hidden'

    $('.c-config-nav_breadcrumb.w--current').removeClass('w--current')
    $('.c-config-nav_breadcrumb').last().addClass('w--current')
  }
}

handleConfirm()
