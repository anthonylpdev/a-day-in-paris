import '../scss/style.scss';
import {gsap} from 'gsap';

class Base {
  constructor() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent);
    this.mouse = {x: 0, y: 0};
    this.ref = document.querySelector('svg');
    this.rect = this.ref.getBoundingClientRect();
    this.elList = gsap.utils.toArray('.parallax-el');
    this.isMoving = false;

    // Parcel hot module replacement (HMR)
    if (module.hot) {
      module.hot.accept();
    }

    if (!this.isMobile) {
      window.addEventListener('mousemove', (event) => {
        this.onMouseMove(event, this);
      }, false);
    }

    this.raf();
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
          x: this.rect.width * this.mouse.x * (index + 1) / speed,
          y: this.rect.height * this.mouse.y * (index + 1) / speed,
        });
      });
      this.isMoving = false;
    }
  }

}

new Base();
