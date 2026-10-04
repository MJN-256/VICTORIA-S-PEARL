document.addEventListener('DOMContentLoaded', () => {
  const slideshow = document.querySelector('.slideshow');

  if (!slideshow) {
    return;
  }

  const slides = Array.from(slideshow.querySelectorAll('img'));

  if (slides.length < 2) {
    return;
  }

  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
  };

  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === 0);
    slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 3000);
});
