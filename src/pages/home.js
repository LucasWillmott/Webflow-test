// Example of a page-specific script in pages/home.js
document.addEventListener('DOMContentLoaded', (event) => {
  // Footer dynamic height landscape

  if (window.matchMedia('(max-width: 991px)').matches) {
    const footerHeight = $('.c-footer').height()

    // Get the current bottom padding of the page wrap
    const currentPadding = parseInt($('.c-outer').css('padding-bottom'))

    // Add the footer's height to the page wrap's bottom padding
    $('.c-outer').css(
      'padding-bottom',
      currentPadding + footerHeight + 24 + 'px'
    )
  }

  // Safari colour solution

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  // If the user is using Safari, apply the mix-blend-mode
  if (isSafari) {
    $('.c-icon_svg').css('filter', 'invert()')
    $('.c-image').css('filter', 'invert()')
    $('.c-image').css('mix-blend-mode', 'difference')
  }

  let stringsArray = [
    "HEY, I'M LUCAS",
    'I BUILD WEBSITES',
    'I SOLVE PROBLEMS',
    'FAST LOAD TIMES',
    'GET EXPERT SUPPORT',
    'BOOST SEO RANKING',
    'PIXELS NEED LOVE',
    'WIRE UP FRAMES',
    'BUILT WITH CARE'
  ]

  // Home Hero 991px-

  if (window.matchMedia('(max-width: 991px)').matches) {
    let i = 0
    let j = 0
    let firstTwoStringsRemoved = false
    let isTyping = true
    let isDeleting = false
    let isTyped = false
    let isDeleted = false

    function typeEffect () {
      if (stringsArray.length === 0) return

      if (isTyping) {
        if (j < stringsArray[i].length) {
          document.getElementById('text').innerHTML =
              stringsArray[i].substring(0, ++j) + '<span id="cursor">|</span>'
          const delay =
              j > 0 && stringsArray[i][j - 1] === ' '
                ? 250
                : Math.floor(Math.random() * 101) + 50 // pause for space when typing
          setTimeout(typeEffect, delay)
        } else {
          isTyping = false
          isTyped = true
          setTimeout(typeEffect, 1000) // pause for 2.5 seconds after a string is typed
        }
      } else if (isTyped) {
        isTyped = false
        isDeleting = true
        typeEffect()
      } else if (isDeleting) {
        if (j > 0) {
          document.getElementById('text').innerHTML =
              stringsArray[i].substring(0, --j) + '<span id="cursor">|</span>'
          setTimeout(typeEffect, 50) // speed for deleting
        } else {
          isDeleting = false
          isDeleted = true
          setTimeout(typeEffect, 500) // delay for 0.5 seconds between deletion and typing the next string
        }
      } else if (isDeleted) {
        isDeleted = false
        isTyping = true
        if (i === 1 && !firstTwoStringsRemoved) {
          // After the second string is deleted and if the first two strings haven't been removed yet
          stringsArray.splice(0, 2) // Remove the first two strings
          i = 0 // Reset the index to 0
          firstTwoStringsRemoved = true // Set the flag to true so we don't remove the first two strings again
        } else {
          i = (i + 1) % stringsArray.length // If not after the second string, wrap the index around to 0 when it reaches the end of the array
        }
        j = 0 // Reset j to start typing a new string
        typeEffect()
      }
    }

    typeEffect()
  }

  // $(".c-nav_menu.cc-side").find("path").css("fill", "white");

  $('.c-nav_link').click(function () {
    $('.c-nav_menu').click()
  })
  // Home Hero 991px+

  if (window.matchMedia('(min-width: 991px)').matches) {
    const texts = []
    const blotters = []
    const content = document.querySelector('.content')
    const string20 = '12345678901234567890'
    const rAF = requestAnimationFrame
    const cSection = document.querySelector('.c-section.cc-hero')
    let count = 0
    const loop = 0
    const children = content.children
    let currentIndex = 0

    const lerp = (start, end, amt) => {
      return (1 - amt) * start + amt * end
    }

    function angle360 (x) {
      return ((x % 360) + 360) % 360
    }

    function shortestAngle (from, to) {
      let difference = angle360(to - from)
      if (difference > 180) difference -= 360
      return difference
    }

    function createTextEffect () {
      // Loop through each character in the string
      string20.split('').forEach((char, i) => {
        const elem = document.createElement('span')
        elem.classList.add(`c-${i}`, 'char')
        content.appendChild(elem)

        // Create a new Blotter.Text object for this character
        const text = new Blotter.Text(char, {
          family: "'Beni', cursive",
          size: 120,
          weight: '700',
          fill: '#171717',
          paddingLeft: 12,
          paddingRight: 12
        })

        // Add the Blotter.Text object to the texts array
        texts.push(text)

        // Create a new Blotter object using the ChannelSplitMaterial
        const material = new Blotter.ChannelSplitMaterial()
        const blotter = new Blotter(material, {
          texts: text
        })

        // Add the Blotter object to the blotters array
        blotters.push(blotter)

        const scope = blotter.forText(text)
        scope.appendTo(elem)

        const values = {
          degrees: Math.random() * 2 - 1,
          maxDist: 0.02,
          hover: false,
          targetDegrees: 0,
          targetMaxDist: 0.02
        }

        const radTodegrees = 180 / Math.PI

        cSection.addEventListener('mousemove', (e) => {
          const bounds = elem.getBoundingClientRect()
          const radiusX = bounds.width / 1.75
          const radiusY = bounds.height / 1.75
          const offX = bounds.left + radiusX
          const offY = bounds.top + radiusY
          const mouse = vec2.fromValues(e.clientX, e.clientY)
          const offset = vec2.fromValues(offX, offY)
          const rad = angleTo(mouse, offset)
          const dist = vec2.distance(mouse, offset)

          values.targetDegrees = angle360(radTodegrees * rad)

          values.targetMaxDist = Math.min(
            Math.min(dist / radiusX, dist / radiusY) * 0.0075,
            0.1
          )

          if (dist < 10 && !values.hover) {
            values.hover = true
            material.uniforms.uApplyBlur.value = 0
          } else if (dist >= 10 && values.hover) {
            values.hover = false
            material.uniforms.uApplyBlur.value = values.maxDist
          }
        })

        const animate = () => {
          if (!values.hover) {
            const angleDiff = shortestAngle(
              values.degrees,
              values.targetDegrees
            )
            values.degrees = angle360(values.degrees + lerp(0, angleDiff, 0.1))
            values.maxDist = lerp(values.maxDist, values.targetMaxDist, 0.1)

            material.uniforms.uOffset.value = values.maxDist
            material.uniforms.uRotation.value = values.degrees
            material.uniforms.uAnimateNoise.value = values.maxDist
          }
          rAF(animate)
        }
        animate()
      })
    }

    function deleteChars (children) {
      // deleting characters
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i]
        setTimeout(() => {
          content.children[i].style.transition = '200ms'
          setTimeout(() => {
            child.style.position = 'absolute'
          }, 200)
          child.style.opacity = '0'
        }, (children.length - i - 1) * 37.5) // 1/20th of a second is 50 milliseconds
      }
    }

    function updateTexts (
      texts,
      blotters,
      stringsArray,
      children,
      currentIndex
    ) {
      const currentString = stringsArray[currentIndex]
      currentIndex = (currentIndex + 1) % stringsArray.length
      $('.content').css('opacity', 1)

      // updating and showing characters
      for (let i = 0; i < currentString.length; i++) {
        const child = content.children[i]
        const isSpace = currentString[i] === ' '

        child.classList.toggle('whitespace', isSpace)
        texts[i].value = isSpace ? '\u00A0' : currentString[i]
        blotters[i].needsUpdate = true
        setTimeout(() => {
          child.style.transition = '0.2s'
          child.style.position = 'static'
          child.style.opacity = '1'
        }, (children.length + i + 1) * 37.5)
      }

      // hiding chars which are greater than the length
      for (let i = currentString.length; i < content.children.length; i++) {
        content.children[i].style.transition = '200ms'
        setTimeout(() => {
          content.children[i].style.position = 'absolute'
        }, 200)

        content.children[i].style.opacity = '0'
      }

      return currentIndex
    }

    function angleTo ([x1, y1], [x2, y2]) {
      return Math.atan2(y1 - y2, x1 - x2)
    }

    let observer
    let inProgress = false
    let heroInView = false

    // init blotter
    $('.content').css('opacity', 0)
    createTextEffect()
    deleteChars(children)

    const myFunction = async () => {
      inProgress = true
      // running...
      deleteChars(children)
      setTimeout(() => {
        currentIndex = updateTexts(
          texts,
          blotters,
          stringsArray,
          children,
          currentIndex
        )
      }, 1000)

      count++
      if (count == 3) {
        stringsArray = stringsArray.slice(2)
        currentIndex = 0
      }
      await new Promise((resolve) => setTimeout(resolve, 5000))
      // finished...
      inProgress = false
      if (heroInView && document.visibilityState === 'visible') {
        myFunction()
      }
    }

    // Inside the callback function for the Intersection Observer
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === 'home') {
          heroInView = entry.isIntersecting
          if (!inProgress && heroInView && document.visibilityState === 'visible') {
            myFunction()
          }
        }
      })
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && heroInView && !inProgress) {
        myFunction()
      }
    })

    observer = new IntersectionObserver(callback)
    observer.observe(document.querySelector('#home'))
  }

  // Nav Link click hamburger
  /*
    $(".c-nav_link").click(function () {
      $(".c-nav_menu").click();
    });
  */
  // Tricks Btn Animations

  function attr (defaultVal, attrVal) {
    const defaultValType = typeof defaultVal
    if (typeof attrVal !== 'string' || attrVal.trim() === '') return defaultVal
    if (attrVal === 'true' && defaultValType === 'boolean') return true
    if (attrVal === 'false' && defaultValType === 'boolean') return false
    if (isNaN(attrVal) && defaultValType === 'string') return attrVal
    if (!isNaN(attrVal) && defaultValType === 'number') return +attrVal
    return defaultVal
  }

  const splitType = new SplitType('[text-split-btn]', {
    types: 'words,chars',
    tagName: 'span'
  })

  $("[hoverstagger='link']").each(function (index) {
    const text1 = $(this).find("[hoverstagger='text']").eq(0)
    const text2 = $(this).find("[hoverstagger='text']").eq(1)
    const durationSetting = attr(0.3, $(this).attr('hoverstagger-duration'))
    const staggerDuration = durationSetting * 0.6666666667

    const tl = gsap.timeline({ paused: true })
    tl.to(text1.find('.char'), {
      yPercent: -100,
      duration: durationSetting,
      stagger: { amount: staggerDuration }
    })
    tl.from(
      text2.find('.char'),
      {
        yPercent: 100,
        duration: durationSetting,
        stagger: { amount: staggerDuration }
      },
      0
    )

    $(this).on('mouseenter', function () {
      tl.restart()
    })
  })

  // Nav Underline/Soldify Animations

  const sections = gsap.utils.toArray('[nav]')

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom -200%',
      toggleClass: {
        targets: ['.c-nav-underline_left', '.c-nav-underline_right'],
        className: 'cc-show'
      },
      markers: false
    })

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom -200%',
      toggleClass: {
        targets: '.c-nav',
        className: 'cc-white'
      },
      markers: false
    })
  })

  // Tricks Title Animations

  const typeSplit = new SplitType('[text-split]', {
    types: 'line, words, chars',
    tagName: 'span'
  })

  // Link timelines to scroll position
  function createScrollTrigger (triggerElement, timeline) {
    // Reset tl when scroll out of view past bottom of screen
    ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top bottom',
      onLeaveBack: () => {
        timeline.progress(0)
        timeline.pause()
      }
    })
    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top 90%',
      onEnter: () => timeline.play()
    })
  }

  $('[letters-slide-down]').each(function (index) {
    const tl = gsap.timeline({ paused: true })
    tl.from($(this).find('.char'), {
      yPercent: -120,
      duration: 0.2,
      ease: 'power1.out',
      stagger: { amount: 0.5 }
    })
    createScrollTrigger($(this), tl)
  })

  //
  // Icons
  //

  gsap.registerPlugin(MotionPathPlugin)

  const cards = document.querySelectorAll('.c-card')

  cards.forEach(function (card, index) {
    const animations = []
    const icons = card.querySelectorAll(
      '.c-icon_svg.cc-1, .c-icon_svg.cc-2, .c-icon_svg.cc-3'
    )

    icons.forEach(function (icon, idx) {
      const pathSelector = `.path-${idx + 1}` // Dynamic path selection based on the icon index
      const path = card.querySelector(pathSelector)
      const animation = gsap.to(icon, {
        duration: 3,
        ease: 'slow',
        repeat: -1,
        paused: true,
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false
        }
      })

      animations.push(animation)
    })

    card.addEventListener('mouseenter', function () {
      animations.forEach(function (animation, idx) {
        animation.play()
      })
    })

    card.addEventListener('mouseleave', function () {
      animations.forEach(function (animation) {
        animation.pause()
        animation.progress(0)
      })
    })
  })
})

// Dark Mode

document.body.classList.add('cc-light-mode')

function toggleDarkMode () {
  $('[toggle]').toggle()

  const classesToToggle = ['.c-nav', '.c-page-wrap', '.c-footer', '.c-side']
  for (let i = 0; i < classesToToggle.length; i++) {
    const elements = document.querySelectorAll(classesToToggle[i])
    elements.forEach((element) => {
      element.classList.toggle('dark-mode')
    })
  }

  document.body.classList.toggle('cc-white')
  document.body.classList.toggle('cc-no-padding')

  const innerElements = document.querySelectorAll('.c-inner')
  innerElements.forEach((element) => {
    element.classList.toggle('cc-dark-mode')
  })

  const invertElements = document.querySelectorAll('[invert]')
  invertElements.forEach((element) => {
    element.classList.toggle('invert')
  })

  const loadElements = document.querySelectorAll('.c-load')
  loadElements.forEach((element) => {
    element.classList.toggle('cc-dark-mode')
  })
}

document.querySelector('.c-darkmode').addEventListener('click', function () {
  toggleDarkMode()
})

if (
  window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  toggleDarkMode()
}

// Listen for OS setting changes
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', function () {
    toggleDarkMode()
  })
/*
  $(".c-nav_menu").click(function () {
    $("body").toggleClass("hidden");
  });
  */
