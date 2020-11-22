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

    // Parcel hot module replacement (HMR)
    if (module.hot) {
      module.hot.accept();
    }

    this.splited = [];
    document.querySelectorAll('.moment-title').forEach((el) => {
      this.splited.push(new SplitText(el, {type:"chars"}));
    });

    console.log(this.splited);

  }
  listener() {
    if (!this.isMobile) {
      window.addEventListener('mousemove', (event) => {
        this.onMouseMove(event, this);
      }, false);
    }

    document.querySelector('#switch').addEventListener('click', (event)  => {
      event.preventDefault();
      let nextScene = this.currentScene >= this.splited.length - 1 ? 0 : this.currentScene + 1;
      console.log(this.splited[nextScene]);
      gsap.timeline()
      .to(this.splited[this.currentScene].chars, {
        opacity: 0,
        stagger: 0.1
      })
      .to(this.splited[nextScene].chars, {
        opacity: 1,
        stagger: 0.1
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
        });
      });
      this.isMoving = false;
    }
  }
}

new Base();
