/* =========================================================
   KR NURSERIES
   ADMIN + GALLERY + AUTO SLIDER
   PKR ENTERPRISES
========================================================= */

"use strict";


/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

/*
   IMPORTANT:
   This number is intentionally NOT displayed in index.html.

   It is used only by the browser-side admin login.

   For true secure authentication, move this to a
   Cloudflare Worker/backend later.
*/

const ADMIN_NUMBERS = [
  "9381661029"
];

const ADMIN_SESSION_KEY = "kr_nurseries_admin_logged_in";



/* =========================================================
   GALLERY STORAGE
========================================================= */

const GALLERY_STORAGE_KEY = "kr_nurseries_gallery_v3";



/* =========================================================
   DEFAULT GALLERY
========================================================= */

const DEFAULT_GALLERY = [
  {
    id: "default-1",
    title: "Agricultural Plants",
    image: "",
    emoji: "🌱",
    default: true
  },

  {
    id: "default-2",
    title: "Nursery Plants",
    image: "",
    emoji: "🌿",
    default: true
  },

  {
    id: "default-3",
    title: "Plantation Plants",
    image: "",
    emoji: "🌳",
    default: true
  },

  {
    id: "default-4",
    title: "Bulk Plant Supply",
    image: "",
    emoji: "🌾",
    default: true
  }
];



/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  setCurrentYear();

  initializeAdmin();

  initializeGallery();

  initializeEnquiryForm();

  initializeGalleryControls();

});



/* =========================================================
   CURRENT YEAR
========================================================= */

function setCurrentYear() {

  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

}



/* =========================================================
   ADMIN
========================================================= */

function initializeAdmin() {

  const loginForm =
    document.getElementById("adminLoginForm");

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        adminLogin();

      }
    );

  }


  const galleryForm =
    document.getElementById("galleryForm");

  if (galleryForm) {

    galleryForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        uploadGalleryImage();

      }
    );

  }


  const galleryFile =
    document.getElementById("galleryFile");

  if (galleryFile) {

    galleryFile.addEventListener(
      "change",
      previewGalleryImage
    );

  }


  if (
    sessionStorage.getItem(
      ADMIN_SESSION_KEY
    ) === "true"
  ) {

    showAdminPanel();

  }

}



/* =========================================================
   OPEN ADMIN
========================================================= */

function openAdmin() {

  const modal =
    document.getElementById("adminModal");

  if (!modal) return;

  modal.classList.add("active");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  const loggedIn =
    sessionStorage.getItem(
      ADMIN_SESSION_KEY
    ) === "true";


  if (loggedIn) {

    showAdminPanel();

  } else {

    showAdminLogin();

  }

}



/* =========================================================
   CLOSE ADMIN
========================================================= */

function closeAdmin() {

  const modal =
    document.getElementById("adminModal");

  if (!modal) return;

  modal.classList.remove("active");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

}



/* =========================================================
   ADMIN LOGIN
========================================================= */

function adminLogin() {

  const input =
    document.getElementById("adminPhone");

  const error =
    document.getElementById("loginError");

  if (!input) return;


  const entered =
    input.value
      .replace(/\D/g, "")
      .trim();


  const valid =
    ADMIN_NUMBERS.includes(entered);


  if (!valid) {

    if (error) {

      error.textContent =
        "Invalid admin number.";

      error.style.display =
        "block";

    }

    input.focus();

    return;

  }


  sessionStorage.setItem(
    ADMIN_SESSION_KEY,
    "true"
  );


  if (error) {

    error.style.display =
      "none";

  }


  input.value = "";

  showAdminPanel();

}



/* =========================================================
   SHOW LOGIN
========================================================= */

function showAdminLogin() {

  const login =
    document.getElementById("adminLogin");

  const panel =
    document.getElementById("adminPanel");


  if (login) {
    login.style.display = "block";
  }


  if (panel) {
    panel.style.display = "none";
  }

}



/* =========================================================
   SHOW ADMIN PANEL
========================================================= */

function showAdminPanel() {

  const login =
    document.getElementById("adminLogin");

  const panel =
    document.getElementById("adminPanel");


  if (login) {
    login.style.display = "none";
  }


  if (panel) {
    panel.style.display = "block";
  }


  renderAdminGallery();

}



/* =========================================================
   LOGOUT
========================================================= */

function adminLogout() {

  sessionStorage.removeItem(
    ADMIN_SESSION_KEY
  );


  showAdminLogin();

}



/* =========================================================
   GET GALLERY
========================================================= */

function getGallery() {

  try {

    const saved =
      localStorage.getItem(
        GALLERY_STORAGE_KEY
      );


    if (!saved) {

      return [
        ...DEFAULT_GALLERY
      ];

    }


    const parsed =
      JSON.parse(saved);


    if (
      !Array.isArray(parsed) ||
      parsed.length === 0
    ) {

      return [
        ...DEFAULT_GALLERY
      ];

    }


    return parsed;

  } catch (error) {

    console.error(
      "Gallery read error:",
      error
    );


    return [
      ...DEFAULT_GALLERY
    ];

  }

}



/* =========================================================
   SAVE GALLERY
========================================================= */

function saveGallery(gallery) {

  try {

    localStorage.setItem(
      GALLERY_STORAGE_KEY,
      JSON.stringify(gallery)
    );

    return true;

  } catch (error) {

    console.error(
      "Gallery save error:",
      error
    );

    alert(
      "The image could not be saved. The browser storage may be full. Please use a smaller image."
    );

    return false;

  }

}



/* =========================================================
   INITIALIZE GALLERY
========================================================= */

function initializeGallery() {

  renderGallery();

  startGalleryAutoSlide();

}



/* =========================================================
   RENDER PUBLIC GALLERY
========================================================= */

function renderGallery() {

  const galleryElement =
    document.getElementById("galleryGrid");

  if (!galleryElement) return;


  const gallery =
    getGallery();


  galleryElement.innerHTML = "";


  if (gallery.length === 0) {

    galleryElement.innerHTML = `
      <div class="empty-gallery">
        No gallery images available.
      </div>
    `;

    return;

  }


  gallery.forEach(function (item) {

    const card =
      document.createElement("div");

    card.className =
      "gallery-item";


    if (item.image) {

      const image =
        document.createElement("img");

      image.src =
        item.image;

      image.alt =
        item.title || "KR Nurseries";

      image.loading =
        "lazy";

      card.appendChild(
        image
      );

    } else {

      const placeholder =
        document.createElement("div");

      placeholder.className =
        "gallery-placeholder";

      placeholder.textContent =
        item.emoji || "🌱";

      card.appendChild(
        placeholder
      );

    }


    const caption =
      document.createElement("div");

    caption.className =
      "gallery-caption";

    caption.textContent =
      item.title || "KR Nurseries";


    card.appendChild(
      caption
    );


    galleryElement.appendChild(
      card
    );

  });


  /*
     Always return slider to first position
     after gallery changes.
  */

  galleryElement.scrollLeft = 0;

}



/* =========================================================
   ADMIN GALLERY LIST
========================================================= */

function renderAdminGallery() {

  const list =
    document.getElementById(
      "adminGalleryList"
    );

  if (!list) return;


  const gallery =
    getGallery();


  list.innerHTML = "";


  gallery.forEach(function (item) {

    const row =
      document.createElement("div");

    row.className =
      "admin-gallery-item";


    if (item.image) {

      const image =
        document.createElement("img");

      image.src =
        item.image;

      image.alt =
        item.title || "";

      row.appendChild(
        image
      );

    } else {

      const placeholder =
        document.createElement("div");

      placeholder.style.width =
        "70px";

      placeholder.style.height =
        "55px";

      placeholder.style.borderRadius =
        "10px";

      placeholder.style.display =
        "grid";

      placeholder.style.placeItems =
        "center";

      placeholder.style.background =
        "#e6f4e7";

      placeholder.style.fontSize =
        "25px";

      placeholder.textContent =
        item.emoji || "🌱";

      row.appendChild(
        placeholder
      );

    }


    const info =
      document.createElement("div");

    info.className =
      "admin-gallery-info";


    const title =
      document.createElement("strong");

    title.textContent =
      item.title || "Untitled";


    const type =
      document.createElement("small");

    type.textContent =
      item.default
        ? "Default gallery image"
        : "Uploaded image";


    info.appendChild(title);

    info.appendChild(type);


    row.appendChild(info);


    /*
       Default placeholder images can also
       be removed if the admin wants.
    */

    const deleteButton =
      document.createElement("button");

    deleteButton.type =
      "button";

    deleteButton.className =
      "delete-btn";

    deleteButton.textContent =
      "Delete";


    deleteButton.addEventListener(
      "click",
      function () {

        deleteGalleryImage(
          item.id
        );

      }
    );


    row.appendChild(
      deleteButton
    );


    list.appendChild(
      row
    );

  });

}



/* =========================================================
   PREVIEW IMAGE
========================================================= */

function previewGalleryImage() {

  const fileInput =
    document.getElementById(
      "galleryFile"
    );

  const preview =
    document.getElementById(
      "galleryPreviewImg"
    );

  const fileName =
    document.getElementById(
      "galleryFileName"
    );


  if (
    !fileInput ||
    !fileInput.files ||
    !fileInput.files[0]
  ) {

    if (preview) {
      preview.style.display =
        "none";
    }

    return;

  }


  const file =
    fileInput.files[0];


  if (fileName) {

    fileName.textContent =
      file.name;

  }


  const reader =
    new FileReader();


  reader.onload =
    function (event) {

      if (!preview) return;

      preview.src =
        event.target.result;

      preview.style.display =
        "block";

    };


  reader.readAsDataURL(
    file
  );

}



/* =========================================================
   IMAGE COMPRESSION
========================================================= */

/*
   Compresses uploaded images before storing them.

   This helps prevent localStorage from filling too quickly.
*/

function compressImage(
  file,
  maxWidth = 1400,
  quality = 0.82
) {

  return new Promise(
    function (resolve, reject) {

      const reader =
        new FileReader();


      reader.onload =
        function (event) {

          const image =
            new Image();


          image.onload =
            function () {

              let width =
                image.width;

              let height =
                image.height;


              if (width > maxWidth) {

                height =
                  Math.round(
                    height *
                    (maxWidth / width)
                  );

                width =
                  maxWidth;

              }


              const canvas =
                document.createElement(
                  "canvas"
                );


              canvas.width =
                width;

              canvas.height =
                height;


              const context =
                canvas.getContext(
                  "2d"
                );


              context.drawImage(
                image,
                0,
                0,
                width,
                height
              );


              const compressed =
                canvas.toDataURL(
                  "image/jpeg",
                  quality
                );


              resolve(
                compressed
              );

            };


          image.onerror =
            function () {

              reject(
                new Error(
                  "Could not process image."
                )
              );

            };


          image.src =
            event.target.result;

        };


      reader.onerror =
        function () {

          reject(
            new Error(
              "Could not read image."
            )
          );

        };


      reader.readAsDataURL(
        file
      );

    }
  );

}



/* =========================================================
   UPLOAD GALLERY IMAGE
========================================================= */

async function uploadGalleryImage() {

  const titleInput =
    document.getElementById(
      "galleryTitle"
    );

  const fileInput =
    document.getElementById(
      "galleryFile"
    );


  if (!titleInput || !fileInput) {
    return;
  }


  const title =
    titleInput.value.trim();


  const file =
    fileInput.files &&
    fileInput.files[0];


  if (!title) {

    alert(
      "Please enter an image title."
    );

    return;

  }


  if (!file) {

    alert(
      "Please select an image."
    );

    return;

  }


  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    alert(
      "Please select an image file."
    );

    return;

  }


  const button =
    document.querySelector(
      "#galleryForm button[type='submit']"
    );


  if (button) {

    button.disabled =
      true;

    button.textContent =
      "Uploading...";

  }


  try {

    const compressedImage =
      await compressImage(
        file
      );


    const gallery =
      getGallery();


    const newImage = {

      id:
        "gallery-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .substring(2, 9),

      title:
        title,

      image:
        compressedImage,

      default:
        false,

      uploadedAt:
        new Date().toISOString()

    };


    gallery.push(
      newImage
    );


    const saved =
      saveGallery(
        gallery
      );


    if (!saved) {
      return;
    }


    titleInput.value = "";

    fileInput.value = "";


    const preview =
      document.getElementById(
        "galleryPreviewImg"
      );

    if (preview) {

      preview.src =
        "";

      preview.style.display =
        "none";

    }


    const fileName =
      document.getElementById(
        "galleryFileName"
      );

    if (fileName) {

      fileName.textContent =
        "";

    }


    renderGallery();

    renderAdminGallery();


    alert(
      "Gallery image uploaded successfully."
    );


    /*
       Restart automatic slider after gallery update.
    */

    restartGalleryAutoSlide();


  } catch (error) {

    console.error(
      "Upload error:",
      error
    );


    alert(
      "Image upload failed. Please try another image."
    );

  } finally {

    if (button) {

      button.disabled =
        false;

      button.textContent =
        "Upload to Gallery";

    }

  }

}



/* =========================================================
   DELETE GALLERY IMAGE
========================================================= */

function deleteGalleryImage(
  id
) {

  const confirmed =
    window.confirm(
      "Delete this gallery image?"
    );


  if (!confirmed) {
    return;
  }


  const gallery =
    getGallery();


  const updated =
    gallery.filter(
      function (item) {
        return item.id !== id;
      }
    );


  saveGallery(
    updated
  );


  renderGallery();

  renderAdminGallery();

  restartGalleryAutoSlide();

}



/* =========================================================
   GALLERY AUTO SLIDER
========================================================= */

let galleryAutoSlideTimer =
  null;

let galleryResumeTimer =
  null;



/* =========================================================
   GET SLIDE DISTANCE
========================================================= */

function getGallerySlideDistance() {

  const gallery =
    document.getElementById(
      "galleryGrid"
    );


  if (!gallery) {
    return 0;
  }


  const firstItem =
    gallery.querySelector(
      ".gallery-item"
    );


  if (!firstItem) {
    return 0;
  }


  const itemWidth =
    firstItem.getBoundingClientRect()
      .width;


  const computed =
    window.getComputedStyle(
      gallery
    );


  const gap =
    parseFloat(
      computed.columnGap ||
      computed.gap ||
      "0"
    ) || 0;


  return itemWidth + gap;

}



/* =========================================================
   MOVE NEXT
========================================================= */

function moveGalleryNext() {

  const gallery =
    document.getElementById(
      "galleryGrid"
    );


  if (!gallery) {
    return;
  }


  const maxScroll =
    gallery.scrollWidth -
    gallery.clientWidth;


  if (maxScroll <= 5) {
    return;
  }


  const distance =
    getGallerySlideDistance();


  if (distance <= 0) {
    return;
  }


  /*
     If we are near the end,
     smoothly return to the beginning.
  */

  if (
    gallery.scrollLeft >=
    maxScroll - 10
  ) {

    gallery.scrollTo({
      left: 0,
      behavior: "smooth"
    });

  } else {

    gallery.scrollBy({
      left: distance,
      behavior: "smooth"
    });

  }

}



/* =========================================================
   MOVE PREVIOUS
========================================================= */

function moveGalleryPrevious() {

  const gallery =
    document.getElementById(
      "galleryGrid"
    );


  if (!gallery) {
    return;
  }


  const distance =
    getGallerySlideDistance();


  if (distance <= 0) {
    return;
  }


  if (
    gallery.scrollLeft <= 5
  ) {

    gallery.scrollTo({
      left:
        gallery.scrollWidth -
        gallery.clientWidth,

      behavior:
        "smooth"
    });

  } else {

    gallery.scrollBy({
      left:
        -distance,

      behavior:
        "smooth"
    });

  }

}



/* =========================================================
   START AUTO SLIDE
========================================================= */

function startGalleryAutoSlide() {

  clearInterval(
    galleryAutoSlideTimer
  );


  galleryAutoSlideTimer =
    setInterval(
      function () {

        moveGalleryNext();

      },
      3000
    );

}



/* =========================================================
   STOP AUTO SLIDE
========================================================= */

function stopGalleryAutoSlide() {

  clearInterval(
    galleryAutoSlideTimer
  );

}



/* =========================================================
   PAUSE THEN RESUME
========================================================= */

function pauseGalleryAutoSlide() {

  stopGalleryAutoSlide();


  clearTimeout(
    galleryResumeTimer
  );


  galleryResumeTimer =
    setTimeout(
      function () {

        startGalleryAutoSlide();

      },
      5000
    );

}



/* =========================================================
   RESTART AUTO SLIDE
========================================================= */

function restartGalleryAutoSlide() {

  stopGalleryAutoSlide();


  setTimeout(
    function () {

      startGalleryAutoSlide();

    },
    500
  );

}



/* =========================================================
   GALLERY CONTROLS
========================================================= */

function initializeGalleryControls() {

  const gallery =
    document.getElementById(
      "galleryGrid"
    );


  const previous =
    document.getElementById(
      "galleryPrev"
    );


  const next =
    document.getElementById(
      "galleryNext"
    );


  if (previous) {

    previous.addEventListener(
      "click",
      function () {

        moveGalleryPrevious();

        pauseGalleryAutoSlide();

      }
    );

  }


  if (next) {

    next.addEventListener(
      "click",
      function () {

        moveGalleryNext();

        pauseGalleryAutoSlide();

      }
    );

  }


  if (!gallery) {
    return;
  }


  gallery.addEventListener(
    "mouseenter",
    function () {

      stopGalleryAutoSlide();

    }
  );


  gallery.addEventListener(
    "mouseleave",
    function () {

      startGalleryAutoSlide();

    }
  );


  gallery.addEventListener(
    "touchstart",
    function () {

      stopGalleryAutoSlide();

    },
    {
      passive: true
    }
  );


  gallery.addEventListener(
    "touchend",
    function () {

      pauseGalleryAutoSlide();

    },
    {
      passive: true
    }
  );


  /*
     Also pause when user manually scrolls.
  */

  gallery.addEventListener(
    "wheel",
    function () {

      pauseGalleryAutoSlide();

    },
    {
      passive: true
    }
  );

}



/* =========================================================
   ENQUIRY FORM
========================================================= */

function initializeEnquiryForm() {

  const form =
    document.getElementById(
      "enquiryForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const name =
        getInputValue(
          "enquiryName"
        );


      const phone =
        getInputValue(
          "enquiryPhone"
        );


      const email =
        getInputValue(
          "enquiryEmail"
        );


      const type =
        getInputValue(
          "enquiryType"
        );


      const quantity =
        getInputValue(
          "enquiryQuantity"
        );


      const location =
        getInputValue(
          "enquiryLocation"
        );


      const message =
        getInputValue(
          "enquiryMessage"
        );


      if (!name || !phone) {

        alert(
          "Please enter your name and phone number."
        );

        return;

      }


      let whatsappMessage =
        "🌱 KR NURSERIES - PLANT ENQUIRY\n\n";


      whatsappMessage +=
        "Name: " +
        name +
        "\n";


      whatsappMessage +=
        "Phone: " +
        phone +
        "\n";


      if (email) {

        whatsappMessage +=
          "Email: " +
          email +
          "\n";

      }


      whatsappMessage +=
        "Requirement: " +
        type +
        "\n";


      if (quantity) {

        whatsappMessage +=
          "Quantity: " +
          quantity +
          "\n";

      }


      if (location) {

        whatsappMessage +=
          "Delivery Location: " +
          location +
          "\n";

      }


      if (message) {

        whatsappMessage +=
          "Message: " +
          message +
          "\n";

      }


      whatsappMessage +=
        "\nSent through KR Nurseries website.";


      const whatsappURL =
        "https://wa.me/918328286323?text=" +
        encodeURIComponent(
          whatsappMessage
        );


      window.open(
        whatsappURL,
        "_blank",
        "noopener"
      );

    }
  );

}



/* =========================================================
   GET INPUT VALUE
========================================================= */

function getInputValue(
  id
) {

  const element =
    document.getElementById(
      id
    );


  if (!element) {
    return "";
  }


  return element.value.trim();

}



/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
  "click",
  function (event) {

    const modal =
      document.getElementById(
        "adminModal"
      );


    if (
      modal &&
      event.target === modal
    ) {

      closeAdmin();

    }

  }
);



/* =========================================================
   ESCAPE KEY CLOSE
========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape"
    ) {

      closeAdmin();

    }

  }
);



/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
  "resize",
  function () {

    const gallery =
      document.getElementById(
        "galleryGrid"
      );


    if (!gallery) {
      return;
    }


    gallery.scrollLeft = 0;

  }
);
