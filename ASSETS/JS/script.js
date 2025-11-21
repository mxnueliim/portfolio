// Cursor highlight - centrado correctamente
const cursor = document.getElementById("cursor-highlight");
document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX - 600}px`;
  cursor.style.top = `${e.clientY - 600}px`;
});

// Navegación activa según scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveNav() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);

// Toggle tema claro/oscuro
const themeToggle = document.getElementById("theme-toggle");
const themeIconSun = document.getElementById("theme-icon-sun");
const themeIconMoon = document.getElementById("theme-icon-moon");
const html = document.documentElement;

// Verificar preferencia guardada o preferencia del sistema
function getThemePreference() {
  if (localStorage.getItem("theme")) {
    return localStorage.getItem("theme");
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Aplicar tema
function setTheme(theme) {
  if (theme === "dark") {
    html.classList.add("dark");
    themeIconSun.classList.remove("hidden");
    themeIconMoon.classList.add("hidden");
  } else {
    html.classList.remove("dark");
    themeIconSun.classList.add("hidden");
    themeIconMoon.classList.remove("hidden");
  }
  localStorage.setItem("theme", theme);
}

// Inicializar tema al cargar
setTheme(getThemePreference());

// Toggle al hacer click
themeToggle.addEventListener("click", () => {
  const currentTheme = html.classList.contains("dark") ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
});

// Modal con galería de imágenes
const modalGallery = {
  // Configuración de imágenes y descripciones por categoría
  data: {
    pie: {
      images: ["/ASSETS/IMG/experiencia/pie/imagen1.jpg"],
      descriptions: ["Carta de recomendación."],
    },
    seremi: {
      images: ["/ASSETS/IMG/experiencia/seremi/imagen1.jpg"],
      descriptions: ["Carta de recomendación."],
    },
    "cursos-google": {
      images: [
        "/ASSETS/IMG/estudios/cursos-google/google.jpg",
        "/ASSETS/IMG/estudios/cursos-google/ti.jpg",
      ],
      descriptions: [
        "Certificación en Análisis de Datos de Google",
        "Certificación en Soporte TI de Google",
      ],
    },
    fonoaudiologia: {
      images: ["/ASSETS/IMG/estudios/fonoaudiologia/imagen1.jpg"],
      descriptions: [
        "Título profesional de Fonoaudiólogo - Universidad Católica de Temuco",
      ],
    },
  },

  currentCategory: null,
  currentIndex: 0,

  init() {
    this.modal = document.getElementById("modal-gallery");
    this.modalImage = document.getElementById("modal-image");
    this.modalDescription = document.getElementById("modal-description");
    this.modalClose = document.getElementById("modal-close");
    this.modalPrev = document.getElementById("modal-prev");
    this.modalNext = document.getElementById("modal-next");
    this.modalCounter = document.getElementById("modal-counter");
    this.modalThumbnails = document.getElementById("modal-thumbnails");

    // Event listeners
    document.querySelectorAll("[data-modal]").forEach((item) => {
      item.addEventListener("click", (e) => {
        const category = item.getAttribute("data-modal");
        this.open(category);
      });
    });

    this.modalClose.addEventListener("click", () => this.close());
    this.modalPrev.addEventListener("click", () => this.prev());
    this.modalNext.addEventListener("click", () => this.next());

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });

    // Cerrar al hacer click en el overlay
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
  },

  open(category) {
    if (!this.data[category]) return;

    this.currentCategory = category;
    this.currentIndex = 0;
    this.modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      this.modal.classList.add("show");
      this.render();
    }, 10);
  },

  close() {
    this.modal.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => {
      this.modal.classList.add("hidden");
    }, 300);
  },

  render() {
    const categoryData = this.data[this.currentCategory];
    if (!categoryData || categoryData.images.length === 0) return;

    const images = categoryData.images;
    const descriptions = categoryData.descriptions;

    // Actualizar imagen principal
    this.modalImage.src = images[this.currentIndex];

    // Actualizar descripción
    this.modalDescription.textContent = descriptions[this.currentIndex] || "";

    // Actualizar contador
    this.modalCounter.textContent = `${this.currentIndex + 1} / ${
      images.length
    }`;

    // Mostrar/ocultar botones de navegación
    this.modalPrev.classList.toggle("hidden", images.length <= 1);
    this.modalNext.classList.toggle("hidden", images.length <= 1);

    // Renderizar thumbnails
    this.modalThumbnails.innerHTML = "";
    if (images.length > 1) {
      images.forEach((img, index) => {
        const thumb = document.createElement("img");
        thumb.src = img;
        thumb.classList.add("modal-thumbnail");
        if (index === this.currentIndex) {
          thumb.classList.add("active");
        }
        thumb.addEventListener("click", () => {
          this.currentIndex = index;
          this.render();
        });
        this.modalThumbnails.appendChild(thumb);
      });
    }
  },

  prev() {
    const categoryData = this.data[this.currentCategory];
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = categoryData.images.length - 1;
    }
    this.render();
  },

  next() {
    const categoryData = this.data[this.currentCategory];
    if (this.currentIndex < categoryData.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.render();
  },
};

// Inicializar modal
modalGallery.init();
