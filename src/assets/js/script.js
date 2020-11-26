import '../scss/style.scss';
import gsap  from 'gsap/all'
import {SplitText} from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

class Base {
  constructor() {
    this.setup();
    this.listener();
    this.raf();
  }
  setup() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent);
    this.mouse = {x: 0, y: 0};
    this.svgSelector = document.querySelector('svg');
    this.currentScene = 0;
    this.svgInfos = this.svgSelector.getBoundingClientRect();

    this.elList = gsap.utils.toArray('.parallax-el');
    this.isMoving = false;
    this.variationSelector = document.querySelector('#variation');

    this.titles = document.querySelectorAll('.moment-title');
    this.splited = [];
    this.titles.forEach((el) => {
      this.splited.push(new SplitText(el, {type:"chars"}));
    });

    // Parcel hot module replacement (HMR)
    if (module.hot) {
      module.hot.accept();
    }

  }
  listener() {
    if (!this.isMobile) {
      window.addEventListener('mousemove', (event) => {
        this.onMouseMove(event, this);
      }, false);
    }

    document.querySelector('#switch').addEventListener('click', (event)  => {
      event.preventDefault();
      event.target.disabled = true;
      let nextScene = this.currentScene >= this.splited.length - 1 ? 0 : this.currentScene + 1;

      this.transitionAnim(event, this.currentScene, nextScene);
      this.currentScene = nextScene;
    });

  }
  transitionAnim(event, current, next) {
    let mainSelector = document.querySelector('main');
    let titleSelector = document.querySelectorAll('.moment-title');
    let oldClass = titleSelector[current].getAttribute('data-slug');
    let newClass = titleSelector[next].getAttribute('data-slug');

    gsap.timeline()
    .addLabel('begin')
    .to(this.splited[current].chars, {
      opacity: 0,
      y: -40,
      stagger: 0.05,
      ease: "expo.in"
    }, 'begin')
    .to(this.variationSelector.children[current].children, {
      opacity: 0,
      y: -40,
      stagger: 0.05,
      ease: "expo.in",
      onComplete: () => {
        mainSelector.classList.replace(oldClass, newClass);
      }
    }, 'begin')
    .fromTo(this.splited[next].chars, {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      ease: "expo.in"
    },{
      opacity: 1,
      y: 0,
      stagger: 0.1,
      ease: "expo.out"
    })
    .fromTo(this.variationSelector.children[next].children, {
      opacity: 0,
      y: 40,
      stagger: 0.05,
      ease: "expo.out"
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 2,
      ease: "expo.out",
      onComplete: () => {
        event.target.disabled = false;
      }
    })
    .play();
  }
  raf() {
    this.parallax(this.elList, 100);
    requestAnimationFrame(this.raf.bind(this));
  }
  onMouseMove(event, that) {
    this.isMoving = true;
    that.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    that.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  parallax(target, speed) {
    if (this.isMoving) {
      target.forEach((el, index) => {
        gsap.to(el, {
          x: this.svgInfos.width * this.mouse.x * (index + 1.2) / speed,
          y: this.svgInfos.height * this.mouse.y * (index + 1.2) / speed,
        }).play();
      });
      this.isMoving = false;
    }
  }
}

new Base();
