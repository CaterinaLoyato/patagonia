
const courseGrid = document.querySelector(".courses__grid");
const courseDots = document.querySelectorAll(".courses-scroll-dots span");

if (courseGrid && courseDots.length) {
  const updateCourseDots = () => {
    const cards = Array.from(courseGrid.querySelectorAll(".course-card"));
    const gridCenter = courseGrid.scrollLeft + courseGrid.clientWidth / 2;

    let activeIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(gridCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    courseDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  courseGrid.addEventListener("scroll", updateCourseDots, { passive: true });
  window.addEventListener("resize", updateCourseDots);
  updateCourseDots();
}