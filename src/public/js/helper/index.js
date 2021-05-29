window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/helper/services.js')
  }
})

/* eslint-disable no-undef */

particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 1000 } },
    color: { value: 'random' },
    shape: {
      type: 'star',
      stroke: { width: 0.5, color: 'random' },
      polygon: { nb_sides: 5 },
      image: { src: '/img/github.webp', width: 100, height: 100 }
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: { enable: true, speed: 5, opacity_min: 0, sync: true }
    },
    size: {
      value: 4,
      random: true,
      anim: { enable: true, speed: 100, size_min: 0, sync: true }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.1,
      width: 1
    },
    move: {
      enable: true,
      speed: 10,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'bounce',
      bounce: true,
      attract: { enable: true, rotateX: 10000, rotateY: 10000 }
    }
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'bubble' },
      resize: true
    },
    modes: {
      grab: { distance: 100, line_linked: { opacity: 1 } },
      bubble: { distance: 100, size: 10, duration: 2, opacity: 0.8, speed: 5 },
      repulse: { distance: 100, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
})
