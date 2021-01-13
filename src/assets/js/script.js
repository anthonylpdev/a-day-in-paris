import '../scss/style.scss'
import gsap from 'gsap/all'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

/**
 * Base App class.
 *
 * @class Base
 */
class Base {
  /**
   * Creates an instance of Base.
   * @memberof Base
   */
  constructor() {
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onRaf = this.onRaf.bind(this)
    this.setup()
    this.listener()
    this.onRaf()
    this.logMessage()
  }

  logMessage() {
    console.log('%cYou shall not pass ! 🧙%c\n%c...but you can follow me on Twitter => https://twitter.com/anthonylpdev', 'background-color:#15202b;padding:6px;' , '', 'background-color:#15202b;padding:6px;');
  }

  /**
   * Setup data and values.
   * @memberof Base
   */
  setup() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    this.mouse = { x: 0, y: 0 }
    this.currentScene = 0
    this.svgInfos = document.querySelector('svg').getBoundingClientRect()

    this.mainEl = document.querySelector('main')
    this.variationEl = document.querySelector('#variation')
    this.paralaxItems = [...document.querySelectorAll('.parallax-el')]
    this.isMoving = false

    this.titleItems = [...document.querySelectorAll('.moment__title')]
    this.splited = this.titleItems.map(
      el => new SplitText(el, { type: 'chars' })
    )

    // Parcel hot module replacement (HMR)
    if (module.hot) {
      module.hot.accept()
    }
  }

  /**
   * Add event listeners.
   * @memberof Base
   */
  listener() {
    if (!this.isMobile) {
      window.addEventListener('mousemove', this.onMouseMove)
    }

    document.querySelector('.switch').addEventListener('click', event => {
      event.preventDefault()
      event.target.disabled = true

      const nextScene =
        this.currentScene >= this.splited.length - 1 ? 0 : this.currentScene + 1

      this.transitionAnim(event, this.currentScene, nextScene)
      this.currentScene = nextScene
    })
  }

  /**
   * Time animation.
   * @param {MouseEvent} event
   * @param {number} current
   * @param {number} next
   * @memberof Base
   */
  transitionAnim(event, current, next) {
    const oldClass = this.titleItems[current].dataset.slug
    const newClass = this.titleItems[next].dataset.slug

    gsap
      .timeline()
      .addLabel('begin')
      .to(
        this.splited[current].chars,
        {
          opacity: 0,
          y: -40,
          stagger: 0.05,
          ease: 'expo.in',
        },
        'begin'
      )
      .to(
        this.variationEl.children[current].children,
        {
          opacity: 0,
          y: -40,
          stagger: 0.05,
          ease: 'expo.in',
          onComplete: () => {
            this.mainEl.classList.replace(oldClass, newClass)
          },
        },
        'begin'
      )
      .fromTo(
        this.splited[next].chars,
        {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          ease: 'expo.in',
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: 'expo.out',
        }
      )
      .fromTo(
        this.variationEl.children[next].children,
        {
          opacity: 0,
          y: 40,
          stagger: 0.05,
          ease: 'expo.out',
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 2,
          ease: 'expo.out',
          onComplete: () => {
            event.target.disabled = false
          },
        }
      )
      .play()
  }

  /**
   * On RAF event.
   * @memberof Base
   */
  onRaf() {
    this.parallax()
    requestAnimationFrame(this.onRaf)
  }

  /**
   * On Mouse Move event.
   * @param {MouseEvent} event
   * @memberof Base
   */
  onMouseMove(event) {
    this.isMoving = true
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1 // eslint-disable-line no-mixed-operators
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 // eslint-disable-line no-mixed-operators
  }

  /**
   * Parallax move.
   * @memberof Base
   */
  parallax() {
    if (this.isMoving) {
      const speed = 100

      this.paralaxItems.forEach((el, index) => {
        gsap
          .to(el, {
            x: (this.svgInfos.width * this.mouse.x * (index + 1.2)) / speed,
            y: (this.svgInfos.height * this.mouse.y * (index + 1.2)) / speed,
          })
          .play()
      })
      this.isMoving = false
    }
  }
}

// eslint-disable-next-line no-new
new Base()
