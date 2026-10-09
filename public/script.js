const ADMIN_NUMBERS = ['KR Nursery'];

const DEFAULT_GALLERY = [
  {
    title: 'Fresh Nursery Plants',
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Healthy Green Saplings',
    url: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Fruit & Farm Plants',
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Garden Collection',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Grow Green',
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Nursery Life',
    url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1000&q=80'
  }
];

document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     YEAR
  ========================= */
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =========================
     MOBILE MENU
  ========================= */
  const menu = document.querySelector('.menu');

  if (menu) {
    menu.addEventListener('click', () => {
      const nav = document.querySelector('.nav nav');

      if (!nav) return;

      nav.style.display =
        nav.style.display === 'flex' ? 'none' : 'flex';

      nav.style.position = 'absolute';
      nav.style.top = '78px';
      nav.style.right = '6%';
      nav.style.flexDirection = 'column';
      nav.style.background = '#fbfcf8';
      nav.style.padding = '20px';
      nav.style.border = '1px solid #e8ede5';
      nav.style.borderRadius = '12px';
      nav.style.zIndex = '9999';
    });
  }


  /* =========================
     ENQUIRY FORM
  ========================= */
  const enquiryForm =
    document.getElementById('enquiryForm') ||
    document.getElementById('enquiry');

  if (enquiryForm) {

    enquiryForm.addEventListener('submit', e => {

      e.preventDefault();

      const form = new FormData(e.target);

      const branch = form.get('branch') || '';

      const target =
        branch.startsWith('Ragavapalli')
          ? '8074625223'
          : '8328286323';

      const msg =
        `Hello KR Nurseries,

I am ${form.get('name') || ''}.

Phone: ${form.get('phone') || ''}

Branch: ${branch}

Requirement:
${form.get('message') || ''}`;

      window.open(
        'https://wa.me/91' +
        target +
        '?text=' +
        encodeURIComponent(msg),
        '_blank'
      );
    });
  }


  /* =========================
     ADMIN MODAL
  ========================= */
  window.openAdmin = function () {

    const modal = document.getElementById('adminModal');

    if (!modal) return;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    renderAdmin();
  };


  window.closeAdmin = function () {

    const modal = document.getElementById('adminModal');

    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };


  window.addEventListener('click', e => {

    if (e.target && e.target.id === 'adminModal') {
      window.closeAdmin();
    }

  });


  /* =========================
     ADMIN LOGIN
  ========================= */
  const adminLoginForm =
    document.getElementById('adminLoginForm');

  if (adminLoginForm) {

    adminLoginForm.addEventListener('submit', e => {

      e.preventDefault();

      const input =
        document.getElementById('adminPhone');

      const error =
        document.getElementById('loginError');

      if (!input) return;

      const phone =
        input.value.replace(/\D/g, '');

      if (ADMIN_NUMBERS.includes(phone)) {

        sessionStorage.setItem(
          'krAdmin',
          'true'
        );

        if (error) {
          error.textContent = '';
        }

        renderAdmin();

      } else {

        if (error) {
          error.textContent =
            'This number is not authorised.';
        }

      }

    });
  }


  /* =========================
     GALLERY STORAGE
  ========================= */
  function getGallery() {

    try {

      const stored =
        localStorage.getItem('krGallery');

      if (!stored) {
        return DEFAULT_GALLERY;
      }

      const gallery =
        JSON.parse(stored);

      if (!Array.isArray(gallery) || gallery.length === 0) {
        return DEFAULT_GALLERY;
      }

      return gallery;

    } catch (error) {

      console.error(
        'Gallery storage error:',
        error
      );

      return DEFAULT_GALLERY;
    }
  }


  function saveGallery(gallery) {

    localStorage.setItem(
      'krGallery',
      JSON.stringify(gallery)
    );

    renderGallery();
    renderAdminList();
  }


  /* =========================
     GALLERY SLIDER
  ========================= */
  let galleryIndex = 0;
  let galleryTimer = null;

  let galleryTouchStartX = 0;
  let galleryTouchDeltaX = 0;


  function galleryVisibleCount() {

    if (window.innerWidth <= 620) {
      return 1;
    }

    if (window.innerWidth <= 980) {
      return 2;
    }

    return 3;
  }


  function renderGallery() {

    const grid =
      document.getElementById('galleryGrid');

    if (!grid) {
      console.error(
        'galleryGrid element was not found.'
      );
      return;
    }

    const dots =
      document.getElementById('galleryDots');

    const items =
      getGallery();

    if (!items.length) {

      grid.innerHTML = `
        <div style="
          padding:30px;
          text-align:center;
          color:#666;
          width:100%;
        ">
          No gallery images available.
        </div>
      `;

      return;
    }


    grid.innerHTML = items.map((item, index) => {

      return `
        <article class="gallery-item">

          <img
            src="${escapeAttr(item.url)}"
            alt="${escapeAttr(item.title)}"
            loading="lazy"
            onerror="this.parentElement.classList.add('broken')"
          >

          <div>
            <span>
              ${String(index + 1).padStart(2, '0')}
            </span>

            <b>
              ${escapeHtml(item.title)}
            </b>
          </div>

        </article>
      `;

    }).join('');


    const maxIndex =
      Math.max(
        0,
        items.length - galleryVisibleCount()
      );

    galleryIndex =
      Math.min(galleryIndex, maxIndex);


    if (dots) {

      dots.innerHTML = items.map((_, index) => {

        return `
          <button
            type="button"
            aria-label="Go to gallery image ${index + 1}"
            class="${index === galleryIndex ? 'active' : ''}"
            onclick="galleryGo(${index})"
          ></button>
        `;

      }).join('');
    }


    updateGalleryPosition();

    startGalleryAutoSlide();

    bindGalleryTouch();
  }


  function updateGalleryPosition() {

    const track =
      document.getElementById('galleryGrid');

    const items =
      getGallery();

    if (!track || !items.length) {
      return;
    }

    const count =
      galleryVisibleCount();

    const max =
      Math.max(
        0,
        items.length - count
      );

    galleryIndex =
      Math.min(galleryIndex, max);


    const percentage =
      galleryIndex * (100 / count);

    const gap =
      galleryIndex * (16 / count);


    track.style.transform =
      `translateX(calc(-${percentage}% - ${gap}px))`;


    document
      .querySelectorAll('#galleryDots button')
      .forEach((button, index) => {

        button.classList.toggle(
          'active',
          index === galleryIndex
        );

      });
  }


  window.galleryNext = function () {

    const items =
      getGallery();

    if (items.length <= 1) {
      return;
    }

    const max =
      Math.max(
        0,
        items.length - galleryVisibleCount()
      );

    galleryIndex =
      galleryIndex >= max
        ? 0
        : galleryIndex + 1;

    updateGalleryPosition();
  };


  window.galleryPrev = function () {

    const items =
      getGallery();

    if (items.length <= 1) {
      return;
    }

    const max =
      Math.max(
        0,
        items.length - galleryVisibleCount()
      );

    galleryIndex =
      galleryIndex <= 0
        ? max
        : galleryIndex - 1;

    updateGalleryPosition();
  };


  window.galleryGo = function (index) {

    galleryIndex = index;

    updateGalleryPosition();

    startGalleryAutoSlide();
  };


  function startGalleryAutoSlide() {

    clearInterval(galleryTimer);

    const items =
      getGallery();

    if (
      items.length >
      galleryVisibleCount()
    ) {

      galleryTimer =
        setInterval(() => {

          window.galleryNext();

        }, 4000);

    }
  }


  /* =========================
     TOUCH / SWIPE
  ========================= */
  function bindGalleryTouch() {

    const viewport =
      document.querySelector(
        '.gallery-viewport'
      );

    if (
      !viewport ||
      viewport.dataset.touchBound
    ) {
      return;
    }

    viewport.dataset.touchBound = '1';


    viewport.addEventListener(
      'touchstart',
      e => {

        if (
          e.touches &&
          e.touches[0]
        ) {

          galleryTouchStartX =
            e.touches[0].clientX;

          galleryTouchDeltaX = 0;

          clearInterval(galleryTimer);
        }

      },
      { passive: true }
    );


    viewport.addEventListener(
      'touchmove',
      e => {

        if (
          e.touches &&
          e.touches[0]
        ) {

          galleryTouchDeltaX =
            e.touches[0].clientX -
            galleryTouchStartX;
        }

      },
      { passive: true }
    );


    viewport.addEventListener(
      'touchend',
      () => {

        if (
          Math.abs(galleryTouchDeltaX) > 45
        ) {

          if (galleryTouchDeltaX < 0) {
            window.galleryNext();
          } else {
            window.galleryPrev();
          }

        }

        startGalleryAutoSlide();

      }
    );
  }


  window.addEventListener(
    'resize',
    () => {

      updateGalleryPosition();

      startGalleryAutoSlide();

    }
  );


  /* =========================
     ADMIN PANEL
  ========================= */
  function renderAdmin() {

    const logged =
      sessionStorage.getItem('krAdmin') === 'true';


    const login =
      document.getElementById('adminLogin');

    const panel =
      document.getElementById('adminPanel');


    if (login) {
      login.hidden = logged;
    }

    if (panel) {
      panel.hidden = !logged;
    }


    if (logged) {
      renderAdminList();
    }
  }


  function renderAdminList() {

    const element =
      document.getElementById(
        'adminGalleryList'
      );

    if (
      !element ||
      sessionStorage.getItem('krAdmin') !== 'true'
    ) {
      return;
    }


    const gallery =
      getGallery();


    element.innerHTML =
      gallery.map((item, index) => {

        return `
          <div class="admin-row">

            <img
              src="${escapeAttr(item.url)}"
              alt=""
            >

            <span>
              ${escapeHtml(item.title)}
            </span>

            <button
              type="button"
              onclick="removeGallery(${index})"
            >
              Remove
            </button>

          </div>
        `;

      }).join('');
  }


  window.removeGallery = function (index) {

    const gallery =
      getGallery();

    gallery.splice(index, 1);

    saveGallery(gallery);
  };


  window.adminLogout = function () {

    sessionStorage.removeItem(
      'krAdmin'
    );

    renderAdmin();
  };


  /* =========================
     GALLERY UPLOAD
  ========================= */
  const galleryFile =
    document.getElementById(
      'galleryFile'
    );

  const galleryPreview =
    document.getElementById(
      'galleryPreview'
    );

  const galleryPreviewImg =
    document.getElementById(
      'galleryPreviewImg'
    );

  const galleryFileName =
    document.getElementById(
      'galleryFileName'
    );


  const MAX_IMAGE_SIZE =
    5 * 1024 * 1024;


  let selectedGalleryFile = null;


  if (galleryFile) {

    galleryFile.addEventListener(
      'change',
      () => {

        const file =
          galleryFile.files &&
          galleryFile.files[0];


        if (!file) {
          return;
        }


        if (
          !file.type.startsWith(
            'image/'
          )
        ) {

          galleryFile.value = '';

          selectedGalleryFile = null;

          if (galleryPreview) {
            galleryPreview.hidden = true;
          }

          alert(
            'Please select an image file.'
          );

          return;
        }


        if (
          file.size >
          MAX_IMAGE_SIZE
        ) {

          galleryFile.value = '';

          selectedGalleryFile = null;

          if (galleryPreview) {
            galleryPreview.hidden = true;
          }

          alert(
            'Image must be 5 MB or smaller.'
          );

          return;
        }


        selectedGalleryFile = file;


        if (galleryFileName) {
          galleryFileName.textContent =
            file.name;
        }


        if (galleryPreviewImg) {

          galleryPreviewImg.src =
            URL.createObjectURL(file);

        }


        if (galleryPreview) {
          galleryPreview.hidden = false;
        }

      }
    );
  }


  const galleryForm =
    document.getElementById(
      'galleryForm'
    );


  if (galleryForm) {

    galleryForm.addEventListener(
      'submit',
      e => {

        e.preventDefault();


        const titleElement =
          document.getElementById(
            'galleryTitle'
          );


        const title =
          titleElement
            ? titleElement.value.trim()
            : '';


        const file =
          selectedGalleryFile;


        if (!title || !file) {

          alert(
            'Please enter a title and select an image.'
          );

          return;
        }


        const reader =
          new FileReader();


        reader.onload = () => {

          const gallery =
            getGallery();


          gallery.push({
            title: title,
            url: reader.result
          });


          try {

            saveGallery(gallery);


            galleryForm.reset();

            selectedGalleryFile = null;


            if (galleryPreview) {
              galleryPreview.hidden = true;
            }


            if (galleryPreviewImg) {
              galleryPreviewImg.removeAttribute(
                'src'
              );
            }


            if (galleryFileName) {
              galleryFileName.textContent = '';
            }


          } catch (error) {

            console.error(
              'Gallery save error:',
              error
            );


            alert(
              'The image could not be saved in this browser. Try a smaller image.'
            );
          }

        };


        reader.readAsDataURL(file);

      }
    );
  }


  /* =========================
     SECURITY / ESCAPING
  ========================= */
  function escapeHtml(value) {

    return String(value).replace(
      /[&<>"']/g,
      character => {

        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[character];

      }
    );
  }


  function escapeAttr(value) {
    return escapeHtml(value);
  }


  /* =========================
     START GALLERY
  ========================= */
  renderGallery();

  renderAdmin();

});
