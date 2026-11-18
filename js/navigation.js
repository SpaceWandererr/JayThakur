const pages = [
  { file: "index.html", name: "Home" },
  { file: "about.html", name: "About" },
  { file: "work.html", name: "Work" },
  { file: "skills.html", name: "Skills" },
  { file: "contact.html", name: "Contact" },
];

let isNavigating = false;
let nextPageBar = null;
let hideBarTimeout = null;

function getCurrentIndex() {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  return pages.findIndex((page) => page.file === currentFile);
}

/* ========================================
   PAGE NAVIGATION
======================================== */

function navigateToPage(index) {
  if (isNavigating || index < 0 || index >= pages.length) return;

  isNavigating = true;
  document.body.classList.add("page-leaving");

  setTimeout(() => {
    window.location.href = pages[index].file;
  }, 350);
}

/* ========================================
   ACTIVE SIDEBAR
======================================== */

function updateActiveSidebar() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const sidebarLinks = document.querySelectorAll(".sidebar__link");

  sidebarLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    const isActive = linkPage === currentPage;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* ========================================
   FLOATING NEXT PAGE BAR
======================================== */

function createNextPageBar() {
  const currentIndex = getCurrentIndex();
  const nextPage = pages[currentIndex + 1];

  if (!nextPage) return;

  nextPageBar = document.createElement("div");
  nextPageBar.className = "page-next-bar";
  nextPageBar.setAttribute("aria-hidden", "true");

  nextPageBar.innerHTML = `
    <div class="page-next-bar__content">
      <span class="page-next-bar__label">CONTINUE EXPLORING</span>
      <strong>Next: ${nextPage.name}</strong>
    </div>

    <button
      class="page-next-bar__button"
      type="button"
      aria-label="Go to ${nextPage.name} page"
    >
      <span>Explore</span>
      <span class="page-next-bar__arrow" aria-hidden="true">↗</span>
    </button>
  `;

  document.body.appendChild(nextPageBar);

  const nextButton = nextPageBar.querySelector(".page-next-bar__button");

  nextButton.addEventListener("click", () => {
    navigateToPage(currentIndex + 1);
  });
}

/* ========================================
   SHOW / HIDE NEXT PAGE BAR
======================================== */

function showNextPageBar() {
  if (!nextPageBar || isNavigating) return;

  clearTimeout(hideBarTimeout);

  nextPageBar.classList.add("is-visible");
  nextPageBar.setAttribute("aria-hidden", "false");
}

function hideNextPageBar() {
  if (!nextPageBar) return;

  nextPageBar.classList.remove("is-visible");
  nextPageBar.setAttribute("aria-hidden", "true");
}

function isAtPageBottom() {
  const distanceFromBottom =
    document.documentElement.scrollHeight -
    (window.scrollY + window.innerHeight);

  return distanceFromBottom <= 80;
}

/* ========================================
   SCROLL DETECTION
======================================== */

function handleScroll() {
  if (isNavigating || !nextPageBar) return;

  if (isAtPageBottom()) {
    showNextPageBar();
  } else {
    hideNextPageBar();
  }
}

/* ========================================
   WHEEL DETECTION
======================================== */

function handleWheel(event) {
  if (isNavigating) return;

  // Show Next bar when visitor tries to scroll
  // beyond the bottom of the current page.
  if (event.deltaY > 10 && isAtPageBottom()) {
    showNextPageBar();
  }

  // Previous page when scrolling upward at the top.
  // if (event.deltaY < -10 && window.scrollY <= 5) {
  //   const currentIndex = getCurrentIndex();
  //   navigateToPage(currentIndex - 1);
  // }
}

/* ========================================
   TOUCH / MOBILE SUPPORT
======================================== */

let touchStartY = 0;

function handleTouchStart(event) {
  touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
  const touchEndY = event.changedTouches[0].clientY;
  const swipeDistance = touchStartY - touchEndY;

  // Swipe upward at the bottom to reveal Next.
  if (swipeDistance > 35 && isAtPageBottom()) {
    showNextPageBar();
  }
}

/* ========================================
   RESPONSIVE SOCIAL DOCK
======================================== */

const socialDock = document.querySelector(".social-dock");

if (socialDock) {
  const socialDockMedia = window.matchMedia("(max-width: 1100px)");

  function updateSocialDock() {
    if (socialDockMedia.matches) {
      socialDock.removeAttribute("open");
    } else {
      socialDock.setAttribute("open", "");
    }
  }

  updateSocialDock();
  socialDockMedia.addEventListener("change", updateSocialDock);
}

/* ========================================
   INITIALIZE
======================================== */

updateActiveSidebar();
createNextPageBar();

window.addEventListener("scroll", handleScroll, {
  passive: true,
});

window.addEventListener("wheel", handleWheel, {
  passive: true,
});

window.addEventListener("touchstart", handleTouchStart, {
  passive: true,
});

window.addEventListener("touchend", handleTouchEnd, {
  passive: true,
});
