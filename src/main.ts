import "./style.css";

// * IMAGE SLIDER
const slideBtns: HTMLButtonElement[] | null = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-slide-btn]")
);
const slideContainer = document.querySelector<HTMLElement>(
  "[data-slide-container]"
);
const slides = [...document.querySelectorAll("[data-slide]")];
let currentIndex = 0;
let isMoving = false;

/**
 * Handler for Button Click
 *
 * @param {*} e
 * @return {*} void
 */
function handleSlideBtnClick(e: any): void {
  if (isMoving) return;
  isMoving = true;
  e.currentTarget.id === "prev" ? currentIndex-- : currentIndex++;
  slideContainer?.dispatchEvent(new Event("slidermove"));
}

//remover/add attribute function
const removeDisabledAttribute = (els: HTMLElement[]) =>
  Array.from(els).forEach((el) => el.removeAttribute("disabled"));
const addDisabledAttribute = (els: HTMLElement[]) =>
  Array.from(els).forEach((el) => el.setAttribute("disabled", "true"));

// event listneers
slideBtns.forEach((btn) => btn.addEventListener("click", handleSlideBtnClick));

slideContainer?.addEventListener("slidermove", () => {
  // 1. translate container to the right/left
  slideContainer.style.transform = `translateX(-${
    currentIndex * slides[0].clientWidth
  }px)`;
  // 2. remove disabled attributes
  removeDisabledAttribute(slideBtns);
  // 3. renable disbaled attributes if needed
  currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
});

//transition end event
slideContainer?.addEventListener("transitionend", () => (isMoving = false));

//disable image drag event
const images: HTMLImageElement[] = Array.from(
  document.querySelectorAll("[data-slide] img")
);
images.forEach((img: HTMLImageElement) => (img.ondragstart = () => false));

// intersection observer for slides
const slideObserver = new IntersectionObserver(
  (slide) => {
    if (slide[0].isIntersecting) {
      addDisabledAttribute([slideBtns[1]]);
    }
  },
  { threshold: 0.75 }
);

slideObserver.observe(slides[slides.length - 1]);
