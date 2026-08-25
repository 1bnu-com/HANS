// ================= MOBILE MENU =================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("show");
    const isOpen = navMenu.classList.contains("show");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("menu-open", isOpen);

    const icon = menuToggle.querySelector("i");

    if (navMenu.classList.contains("show")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        document.body.classList.remove("menu-open");
    }

});

document.addEventListener("click", event => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove("show");
        menuToggle.querySelector("i").className = "fa-solid fa-bars";
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        document.body.classList.remove("menu-open");
    }
});


// ================= CLOSE MENU AFTER CLICK =================

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("show");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        document.body.classList.remove("menu-open");

    });

});


// ================= ACTIVE NAV =================

const sections = document.querySelectorAll("section");
const links = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    links.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});


// ================= SCROLL REVEAL =================

const revealElements = document.querySelectorAll(
    ".section-heading, .about-grid, .service-card, .featured-project, .project-card, .tools-list, .contact-box"
);

const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("reveal-active");

            }

        });

    },
    {
        threshold: 0.1
    }
);

revealElements.forEach(element => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


// ================= FMB LIGHTBOX =================

const fmbPreview = document.querySelector(".fmb-preview");
const fmbLightbox = document.getElementById("fmbLightbox");
const lightboxClose = fmbLightbox.querySelector(".lightbox-close");
let previousFocus;

const closeFmbLightbox = () => {
    fmbLightbox.classList.remove("is-open");
    fmbLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    previousFocus?.focus();
};

fmbPreview.addEventListener("click", () => {
    previousFocus = document.activeElement;
    fmbLightbox.classList.add("is-open");
    fmbLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
});

lightboxClose.addEventListener("click", closeFmbLightbox);

fmbLightbox.addEventListener("click", event => {
    if (event.target === fmbLightbox) {
        closeFmbLightbox();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && fmbLightbox.classList.contains("is-open")) {
        closeFmbLightbox();
    }
});


// ================= CINEMATIC VIDEO OVERLAY =================

document.querySelectorAll(".video-preview").forEach(videoPreview => {
    const video = videoPreview.querySelector("video");
    const overlay = videoPreview.querySelector(".video-start-overlay");

    if (!overlay) {
        return;
    }

    overlay.addEventListener("click", () => {
        videoPreview.classList.add("has-started");
        video.play();
    });

    video.addEventListener("play", () => {
        videoPreview.classList.add("has-started");
    });
});


// ================= PROJECT MODAL =================

const projectModal = document.getElementById("projectModal");
const projectModalClose = projectModal.querySelector(".project-modal-close");
const modalVisual = document.getElementById("modalVisual");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalRole = document.getElementById("modalRole");
const modalYear = document.getElementById("modalYear");
const modalTools = document.getElementById("modalTools");
let modalPreviousFocus;

const projectDetails = {
    social: {
        category: "05 / DIGITAL MARKETING",
        title: "Social Media Campaign",
        description: "A social-first campaign system built around clear messaging, strong visual rhythm, and content made for everyday scrolling.",
        role: "ROLE / Digital Marketing",
        year: "YEAR / 2026",
        tools: "TOOLS / Strategy, Content Planning, Social Design",
        visual: "social-visual"
    },
    branding: {
        category: "06 / DESIGN",
        title: "Brand Visual Identity",
        description: "A considered visual identity direction with a flexible mark, expressive typography, and a focused color language for brand communication.",
        role: "ROLE / Design Editor",
        year: "YEAR / 2026",
        tools: "TOOLS / Visual Design, Art Direction, Branding",
        visual: "branding-visual"
    },
    content: {
        category: "07 / CONTENT",
        title: "Creative Content",
        description: "A creative content direction combining short-form video, social layouts, and editorial typography into a consistent visual story.",
        role: "ROLE / Creative Content",
        year: "YEAR / 2026",
        tools: "TOOLS / Concept, Storytelling, Video Editing",
        visual: "content-visual"
    },
    landing: {
        category: "08 / WEB",
        title: "Landing Page",
        description: "A focused landing page concept that uses clear hierarchy, purposeful interaction, and a strong visual entry point to guide visitors.",
        role: "ROLE / Web Designer",
        year: "YEAR / 2026",
        tools: "TOOLS / HTML5, CSS3, JavaScript",
        visual: "landing-visual"
    }
};

const closeProjectModal = () => {
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalVisual.replaceChildren();
    modalPreviousFocus?.focus();
};

document.querySelectorAll("[data-project]").forEach(projectTrigger => {
    projectTrigger.addEventListener("click", event => {
        event.preventDefault();
        const project = projectDetails[projectTrigger.dataset.project];

        if (!project) {
            return;
        }

        modalPreviousFocus = document.activeElement;
        modalCategory.textContent = project.category;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;
        modalRole.textContent = project.role;
        modalYear.textContent = project.year;
        modalTools.textContent = project.tools;
        const visual = projectTrigger.closest(".project-card").querySelector(`.${project.visual}`).cloneNode(true);
        visual.removeAttribute("aria-label");
        modalVisual.append(visual);
        projectModal.classList.add("is-open");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        projectModalClose.focus();
    });
});

projectModalClose.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", event => {
    if (event.target === projectModal) {
        closeProjectModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && projectModal.classList.contains("is-open")) {
        closeProjectModal();
    }
});


// ================= PAGE LOADER =================

window.addEventListener("load", () => {
    document.body.classList.add("page-ready");
    document.getElementById("pageLoader").setAttribute("aria-hidden", "true");
});