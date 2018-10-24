// import IMask from 'imask';

document.addEventListener('DOMContentLoaded', () => {
  const isScrollActive = (boolean) => {
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    // left: 37, up: 38, right: 39, down: 40,
    const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
        e.preventDefault();
      e.returnValue = false;
    }

    function keydown(e) {
      for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
          preventDefault(e);
          return;
        }
      }
    }

    function wheel(e) {
      preventDefault(e);
    }

    function disable_scroll() {
      if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
      }
      window.onmousewheel = document.onmousewheel = wheel;
      document.onkeydown = keydown;
      disable_scroll_mobile();
      // new SimpleBar(document.body);
    }

    function enable_scroll() {
      if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
      }
      window.onmousewheel = document.onmousewheel = document.onkeydown = null;
      enable_scroll_mobile();
    }

    // My improvement

    // MOBILE
    function disable_scroll_mobile() {
      document.addEventListener('touchmove', preventDefault, false);
    }

    function enable_scroll_mobile() {
      document.removeEventListener('touchmove', preventDefault, false);
    }

    if (boolean) {
      enable_scroll();
      enable_scroll_mobile();
    } else {
      disable_scroll();
      disable_scroll_mobile();
    }
  };

  const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

  const pageMenu = document.querySelector('#pageMenu');
  const btnOpenPageMenu = document.querySelector('#showPageMenu');
  const iconPageMenu = document.querySelector('.icon-hamburger');

  isScrollActive(false);

  btnOpenPageMenu.addEventListener('click', (e) => {
    iconPageMenu.classList.toggle('animate');

    if (iconPageMenu.classList.contains('animate')) {
      e.currentTarget.style.zIndex = 2000;
      pageMenu.style.right = 0;
      document.body.style.cssText = 'position: fixed; width: 100%; height: 100%; overflow: hidden;';
    } else {
      pageMenu.style.right = null;
      document.body.style.cssText = null;
      setTimeout(() => { btnOpenPageMenu.style.zIndex = null; }, 300);
    }
  });

  const btnOpenModal = document.querySelector('#modalOpen');
  const btnCloseModal = document.querySelector('#modalFeedbackClose');
  const modalFeedback = document.querySelector('#modalFeedback');
  const modalOk = document.querySelector('#modalOk');
  const mainPage = document.querySelector('.page-main');

  const scrollbarWidth = getScrollbarWidth();

  btnOpenModal.addEventListener('click', () => {
    modalFeedback.style.right = null;
    modalFeedback.style.visibility = 'visible';
    modalFeedback.style.opacity = 1;
    modalFeedback.style.top = 0;
    // modalFeedback.style.height = '100vh';
    setTimeout(() => {
      mainPage.style.filter = 'blur(5px)';
    }, 200);

    document.body.style.cssText = `height: 100%; overflow: hidden; padding-right: ${scrollbarWidth}px`;
  });

  btnCloseModal.addEventListener('click', () => {
    modalFeedback.style.top = null;
    modalFeedback.style.visibility = null;
    modalFeedback.style.opacity = null;
    // modalFeedback.style.height = null;
    mainPage.style.filter = null;

    modalFeedback.style.right = '-14px';
    document.body.style.cssText = null;
  });

  const mainFormTelInputMask = new IMask(
    document.querySelector('#mainForm').querySelector('input[name=phone]'), {
      mask: '+{7} (000) 000-00-00',
    },
  );

  const modalFormTelInputMask = new IMask(
    document.querySelector('#modalForm').querySelector('input[name=phone]'), {
      mask: '+{7} (000) 000-00-00',
    },
  );


  const throttled = (fn, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return false;
      }
      lastCall = now;
      return fn(...args);
    };
  };

  // Do animation when element is visible
  const isVisible = (elem) => {
    const coords = elem.getBoundingClientRect();
    const windowHeight = document.documentElement.clientHeight;

    // верхняя граница elem в пределах видимости ИЛИ нижняя граница видима
    const topVisible = coords.top > 0 && coords.top < windowHeight;
    const bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;
    console.log(true);

    return topVisible || bottomVisible;
  };

  const animateElem = () => {
    const elem = document.querySelector('.feedback-mid_text');

    if (isVisible(elem)) {
      elem.classList.add('animated', 'fadeInLeft', 'delay-4s');
    }
  };

  window.onscroll = throttled(animateElem, 50);

  // Slider
  const slider = document.querySelector('.owl-carousel');
  $(slider).owlCarousel({
    animateOut: 'fadeOutLeft',
    animateIn: 'fadeInRight',
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: true,
    // nav: true,
    navText: ['<svg width="29" height="29" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.142 0L1.414 12.728 0 14.142l1.414 1.414 12.728 12.728 1.414-1.414L2.828 14.142 15.556 1.414 14.142 0z" fill="#fff"/></svg>', '<svg width="29" height="29" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.858 0l12.728 12.728L29 14.142l-1.414 1.414-12.728 12.728-1.414-1.414 12.728-12.728L13.444 1.414 14.858 0z" fill="#fff"/></svg>'],
    // autoplayHoverPause: true,
  });

  // Submit form
  const mainFeedbackForm = document.querySelector('#mainForm');
  const modalFeedbackForm = document.querySelector('#modalForm');
  const btnMainFeedbackSubmit = mainFeedbackForm.querySelector('#mainFormSubmit');
  const btnModalFeedbackSubmit = modalFeedbackForm.querySelector('#modalFormSubmit');

  btnMainFeedbackSubmit.addEventListener('click', () => {
    // e.preventDefault();
    mainFeedbackForm.addEventListener('submit', (e) => { e.preventDefault(); });

    const name = mainFeedbackForm.querySelector('input[name=name]');
    const phone = mainFeedbackForm.querySelector('input[name=phone]')
    const message = mainFeedbackForm.querySelector('textarea[name=message]');
    const agreements = mainFeedbackForm.querySelector('#feedback-agreements');

    if (phone.value.length < 18) {
      phone.classList.add('error');
    } else {
      phone.classList.remove('error');
    }

    if (name.value && phone.value.length === 18 && message.value && agreements.checked) {
      const formData = new FormData(mainFeedbackForm);
  
      fetch('/cart/registration', {
        method: 'POST',
        mode: 'no-cors',
        // headers: myHeaders,
        body: formData,
      }).then((res) => {
        if (res.ok) {
          console.log(`Данные отправились. Ответ: ${res}`);
          
          modalOk.style.right = null;
          modalOk.style.visibility = 'visible';
          modalOk.style.opacity = 1;
          modalOk.style.height = '100vh';
          setTimeout(() => {
            mainPage.style.filter = 'blur(5px)';
          }, 200);
      
          document.body.style.cssText = `height: 100%; overflow: hidden; padding-right: ${scrollbarWidth}px`;

          setTimeout(() => {
            modalOk.style.visibility = null;
            modalOk.style.opacity = null;
            modalOk.style.height = null;
            modalFeedback.style.height = null;
            mainPage.style.filter = null;
        
            modalFeedback.style.right = '-14px';
            document.body.style.cssText = null;
          }, 5000);
        }
      }).catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
    }
  });

  btnModalFeedbackSubmit.addEventListener('click', () => {
    // e.preventDefault();
    modalFeedbackForm.addEventListener('submit', (e) => { e.preventDefault(); });

    const name = modalFeedbackForm.querySelector('input[name=name]');
    const phone = modalFeedbackForm.querySelector('input[name=phone]')
    const message = modalFeedbackForm.querySelector('textarea[name=message]');
    const agreements = modalFeedbackForm.querySelector('#modal-feedback-agreements');

    if (phone.value.length < 18) {
      phone.classList.add('error');
    } else {
      phone.classList.remove('error');
    }

    if (name.value && phone.value.length === 18 && message.value && agreements.checked) {
      const formData = new FormData(modalFeedbackForm);
  
      fetch('/cart/registration', {
        method: 'POST',
        mode: 'no-cors',
        // headers: myHeaders,
        body: formData,
      }).then((res) => {
        if (res.ok) {
          console.log(`Данные отправились. Ответ: ${res}`);
          
          modalOk.style.right = null;
          modalOk.style.visibility = 'visible';
          modalOk.style.opacity = 1;
          modalOk.style.height = '100vh';
          setTimeout(() => {
            mainPage.style.filter = 'blur(5px)';
          }, 200);
      
          document.body.style.cssText = `height: 100%; overflow: hidden; padding-right: ${scrollbarWidth}px`;

          setTimeout(() => {
            modalOk.style.visibility = null;
            modalOk.style.opacity = null;
            modalOk.style.height = null;
            modalFeedback.style.visibility = null;
            modalFeedback.style.opacity = null;
            modalFeedback.style.height = null;
            mainPage.style.filter = null;
        
            modalFeedback.style.right = '-14px';
            document.body.style.cssText = null;
          }, 5000);
        }
      }).catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
    }
  });
});
