document.addEventListener("DOMContentLoaded", () => {

  const ADMIN_NUMBERS = ["9381661029","83282863231611","161118"];

  const KEY = "kr_nurseries_gallery_v3";

  const WA = "918328286323";


  /* ================= DEFAULT GALLERY ================= */

  const defaults = [

    [
      "Nursery Plants",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85"
    ],

    [
      "Green Growth",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=85"
    ],

    [
      "Agricultural Plants",
      "https://images.unsplash.com/photo-1523742818354-510e3a4a7f0a?auto=format&fit=crop&w=1200&q=85"
    ],

    [
      "Farm Plantation",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=85"
    ],

    [
      "Healthy Nursery",
      "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1200&q=85"
    ],

    [
      "Growing Together",
      "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=85"
    ]

  ];


  /* ================= LOAD GALLERY ================= */

  let gallery;

  try {

    gallery = JSON.parse(
      localStorage.getItem(KEY) || "null"
    );

  } catch (e) {

    gallery = null;

  }


  if (!Array.isArray(gallery) || !gallery.length) {

    gallery = defaults.map(item => ({
      title: item[0],
      src: item[1]
    }));

  }


  let pos = 0;

  let timer;


  const grid =
    document.getElementById("galleryGrid");

  const dots =
    document.getElementById("galleryDots");


  /* ================= SECURITY ESCAPE ================= */

  const esc = value => {

    return String(value).replace(
      /[&<>"']/g,

      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character])

    );

  };


  /* ================= RESPONSIVE COUNT ================= */

  const count = () => {

    if (window.innerWidth <= 560) {
      return 1;
    }

    if (window.innerWidth <= 980) {
      return 2;
    }

    return 3;

  };


  const max = () => {

    return Math.max(
      0,
      gallery.length - count()
    );

  };


  /* ================= RENDER GALLERY ================= */

  function render() {

    if (!grid) return;

    grid.innerHTML = gallery
      .map((item, i) => {

        return `

          <article class="gallery-item">

            <img
              src="${esc(item.src)}"
              alt="${esc(item.title)}"
              loading="${i < 3 ? "eager" : "lazy"}"
            >

            <div class="gallery-caption">

              <b>
                ${esc(item.title)}
              </b>

              <small>
                KR Nurseries · Quality Plants
              </small>

            </div>

          </article>

        `;

      })
      .join("");


    const total =
      max() + 1;


    dots.innerHTML =
      Array.from(
        { length: total },
        (_, i) => `

          <button
            class="gallery-dot ${
              i === pos ? "active" : ""
            }"
            data-i="${i}"
            aria-label="Gallery ${i + 1}"
          ></button>

        `
      ).join("");


    dots
      .querySelectorAll("button")
      .forEach(button => {

        button.onclick = () => {

          pos = Number(
            button.dataset.i
          );

          update();

          restart();

        };

      });


    update();

  }


  /* ================= UPDATE SLIDER ================= */

  function update() {

    if (!grid) return;

    pos = Math.min(
      pos,
      max()
    );


    const card =
      grid.querySelector(
        ".gallery-item"
      );


    if (!card) return;


    const width =
      card.getBoundingClientRect().width;


    grid.style.transform =
      `translateX(-${
        pos * (width + 16)
      }px)`;


    dots
      .querySelectorAll(".gallery-dot")
      .forEach((dot, i) => {

        dot.classList.toggle(
          "active",
          i === pos
        );

      });

  }


  /* ================= GALLERY BUTTONS ================= */

  window.galleryPrev = () => {

    pos =
      pos <= 0
        ? max()
        : pos - 1;

    update();

    restart();

  };


  window.galleryNext = () => {

    pos =
      pos >= max()
        ? 0
        : pos + 1;

    update();

    restart();

  };


  function restart() {

    clearInterval(timer);

    timer =
      setInterval(
        window.galleryNext,
        4500
      );

  }


  render();

  restart();


  window.addEventListener(
    "resize",
    () => {

      render();

      restart();

    }
  );


  /* ================= MOBILE MENU ================= */

  const nav =
    document.getElementById("nav");

  const menu =
    document.getElementById("menu");


  menu.onclick = () => {

    nav.classList.toggle("open");

  };


  nav
    .querySelectorAll("a")
    .forEach(link => {

      link.onclick = () => {

        nav.classList.remove("open");

      };

    });


  /* ================= YEAR ================= */

  document.getElementById(
    "year"
  ).textContent =
    new Date().getFullYear();


  /* ================= ENQUIRY ================= */

  document
    .getElementById("enquiryForm")
    .onsubmit = event => {

      event.preventDefault();


      const value = id =>
        document
          .getElementById(id)
          .value
          .trim();


      const text =

        `Hello KR Nurseries,%0A%0A` +

        `Name: ${
          encodeURIComponent(
            value("name")
          )
        }%0A` +

        `Phone: ${
          encodeURIComponent(
            value("phone")
          )
        }%0A` +

        `Plant: ${
          encodeURIComponent(
            value("plant") ||
            "Not specified"
          )
        }%0A` +

        `Quantity: ${
          encodeURIComponent(
            value("quantity") ||
            "Not specified"
          )
        }%0A` +

        `Details: ${
          encodeURIComponent(
            value("message") ||
            "Not specified"
          )
        }`;


      window.open(
        `https://wa.me/${WA}?text=${text}`,
        "_blank"
      );

    };


  /* ================= ADMIN MODAL ================= */

  const modal =
    document.getElementById(
      "adminModal"
    );

  const login =
    document.getElementById(
      "adminLogin"
    );

  const panel =
    document.getElementById(
      "adminPanel"
    );


  document
    .getElementById("adminTrigger")
    .onclick = () => {

      modal.classList.add(
        "open"
      );

    };


  document
    .getElementById("adminClose")
    .onclick = () => {

      modal.classList.remove(
        "open"
      );

    };


  modal.onclick = event => {

    if (
      event.target === modal
    ) {

      modal.classList.remove(
        "open"
      );

    }

  };


  /* ================= ADMIN LOGIN ================= */

  document
    .getElementById("adminLoginForm")
    .onsubmit = event => {

      event.preventDefault();


      const number =
        document
          .getElementById("adminPhone")
          .value
          .replace(/\D/g, "");


      if (
        ADMIN_NUMBERS.includes(
          number
        )
      ) {

        login.hidden = true;

        panel.hidden = false;

        document.getElementById(
          "loginError"
        ).textContent = "";


        adminList();

      } else {

        document.getElementById(
          "loginError"
        ).textContent =
          "Unauthorized number.";

      }

    };


  /* ================= IMAGE PREVIEW ================= */

  const file =
    document.getElementById(
      "galleryFile"
    );

  const preview =
    document.getElementById(
      "galleryPreview"
    );

  const previewImg =
    document.getElementById(
      "galleryPreviewImg"
    );


  file.onchange = () => {

    const selected =
      file.files[0];


    if (!selected) return;


    const reader =
      new FileReader();


    reader.onload = () => {

      previewImg.src =
        reader.result;

      preview.hidden = false;

    };


    reader.readAsDataURL(
      selected
    );

  };


  /* ================= GALLERY UPLOAD ================= */

  document
    .getElementById("galleryForm")
    .onsubmit = event => {

      event.preventDefault();


      const selected =
        file.files[0];


      if (!selected) return;


      if (
        selected.size >
        2500000
      ) {

        alert(
          "Please use an image below 2.5 MB."
        );

        return;

      }


      const reader =
        new FileReader();


      reader.onload = () => {

        gallery.push({

          title:
            document
              .getElementById(
                "galleryTitle"
              )
              .value ||
            "KR Nurseries",

          src:
            reader.result

        });


        localStorage.setItem(
          KEY,
          JSON.stringify(gallery)
        );


        event.target.reset();

        preview.hidden = true;


        render();

        adminList();

      };


      reader.readAsDataURL(
        selected
      );

    };


  /* ================= ADMIN GALLERY LIST ================= */

  function adminList() {

    const element =
      document.getElementById(
        "adminGalleryList"
      );


    element.innerHTML =
      gallery
        .map(
          (item, i) => `

            <div class="admin-gallery-row">

              <img
                src="${esc(item.src)}"
                alt=""
              >

              <span>
                ${esc(item.title)}
              </span>

              <button
                data-i="${i}"
                type="button"
              >
                Delete
              </button>

            </div>

          `
        )
        .join("");


    element
      .querySelectorAll("button")
      .forEach(button => {

        button.onclick = () => {

          gallery.splice(
            Number(
              button.dataset.i
            ),
            1
          );


          if (
            !gallery.length
          ) {

            gallery =
              defaults.map(
                item => ({
                  title:item[0],
                  src:item[1]
                })
              );

          }


          localStorage.setItem(
            KEY,
            JSON.stringify(
              gallery
            )
          );


          render();

          adminList();

        };

      });

  }


  /* ================= SWIPE ================= */

  let startX = 0;


  grid.addEventListener(
    "touchstart",
    event => {

      startX =
        event.touches[0]
          .clientX;

    },
    {
      passive:true
    }
  );


  grid.addEventListener(
    "touchend",
    event => {

      const distance =
        event.changedTouches[0]
          .clientX - startX;


      if (
        Math.abs(distance) > 50
      ) {

        if (
          distance < 0
        ) {

          window.galleryNext();

        } else {

          window.galleryPrev();

        }

      }

    },
    {
      passive:true
    }
  );

});
