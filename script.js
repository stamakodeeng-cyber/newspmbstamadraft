document.getElementById('year').textContent = new Date().getFullYear();

    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',function(e){
        const href = this.getAttribute('href');
        if(href.length>1){
          e.preventDefault();
          const el = document.querySelector(href);
          if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        }
      });
    });

    const menuToggle=document.getElementById('menu-toggle');
    const navMenu=document.querySelector('nav ul');
    if(menuToggle){menuToggle.addEventListener('click',()=>{navMenu.classList.toggle('show');});}

    (function(){
      const parallaxBg = document.querySelector('.parallax-bg');
      if(!parallaxBg) return;

      let ticking = false;

      function updateParallax(){
        const scrolled = window.pageYOffset;
        const speed = 0.5;
        const yPos = scrolled * speed;
        
        parallaxBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
        
        ticking = false;
      }

      function requestTick(){
        if(!ticking){
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }

      window.addEventListener('scroll', requestTick, {passive: true});
      updateParallax();
    })();

    (function(){
      const track = document.querySelector('.carousel-track');
      if(!track) return;

      const slides = Array.from(track.children);
      const nextBtn = document.querySelector('.carousel-btn.next');
      const prevBtn = document.querySelector('.carousel-btn.prev');
      let currentIndex = 0;
      let autoplayTimer = null;
      const AUTOPLAY_MS = 5000;

      function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      function goNext(){
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
      }
      function goPrev(){
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
      }

      if(nextBtn) nextBtn.addEventListener('click', ()=> { goNext(); resetAutoplay(); });
      if(prevBtn) prevBtn.addEventListener('click', ()=> { goPrev(); resetAutoplay(); });

      function startAutoplay(){
        stopAutoplay();
        autoplayTimer = setInterval(()=>{ goNext(); }, AUTOPLAY_MS);
      }
      function stopAutoplay(){
        if(autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
      }
      function resetAutoplay(){ startAutoplay(); }

      const carousel = document.querySelector('.carousel');
      if(carousel){
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);
      }

      let touchStartX = 0;
      let touchEndX = 0;
      track.addEventListener('touchstart', function(e){
        stopAutoplay();
        touchStartX = e.touches[0].clientX;
      }, {passive: true});
      track.addEventListener('touchmove', function(e){
        touchEndX = e.touches[0].clientX;
      }, {passive: true});
      track.addEventListener('touchend', function(){
        const dx = touchEndX - touchStartX;
        const threshold = 40;
        if(Math.abs(dx) > threshold){
          if(dx < 0) goNext();
          else goPrev();
        }
        startAutoplay();
      });

      updateCarousel();
      startAutoplay();
    })();