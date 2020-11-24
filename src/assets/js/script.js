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
    this.ref = document.querySelector('svg');
    this.currentScene = 0;
    this.rect = this.ref.getBoundingClientRect();
    this.elList = gsap.utils.toArray('.parallax-el');
    this.isMoving = false;
    this.variation = document.querySelector('#variation');

    // Parcel hot module replacement (HMR)
    if (module.hot) {
      module.hot.accept();
    }

    this.titles = document.querySelectorAll('.moment-title');
    this.splited = [];
    this.titles.forEach((el) => {
      this.splited.push(new SplitText(el, {type:"chars"}));
    });
  }
  listener() {
    if (!this.isMobile) {
      window.addEventListener('mousemove', (event) => {
        this.onMouseMove(event, this);
      }, false);
    }

    let mainSelector = document.querySelector('main');

    document.querySelector('#switch').addEventListener('click', (event)  => {
      event.preventDefault();
      event.target.disabled = true;
      let nextScene = this.currentScene >= this.splited.length - 1 ? 0 : this.currentScene + 1;

      //let newClass = this.titles[this.currentScene].getAttribute('data-slug');
      console.log(this.variation.children[this.currentScene].children, this.variation.children[nextScene].children);
      gsap.timeline()
      .addLabel('begin')
      .to(this.splited[this.currentScene].chars, {
        opacity: 0,
        y: -40,
        stagger: 0.05,
        ease: "expo.in"
      }, 'begin')
      .to(this.variation.children[this.currentScene].children, {
        opacity: 0,
        y: -40,
        stagger: 0.05,
        ease: "expo.in",
        onComplete: () => {
          mainSelector.classList = document.querySelectorAll('.moment-title')[nextScene].getAttribute('data-slug') + ' transition';
        }
      }, 'begin')
      .fromTo(this.splited[nextScene].chars, {
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
      .fromTo(this.variation.children[nextScene].children, {
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
      this.currentScene = nextScene;
    });

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
          x: this.rect.width * this.mouse.x * (index + 1.2) / speed,
          y: this.rect.height * this.mouse.y * (index + 1.2) / speed,
        }).play();
      });
      this.isMoving = false;
    }
  }
}

new Base();
