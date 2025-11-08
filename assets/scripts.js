document.addEventListener("DOMContentLoaded", () => {
  const listItems = Array.from(document.querySelectorAll(".bullet-list ul li"));
  const itemsPerPage = 5;
  const totalItems = listItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage)); // always at least 1 page shown
  const pagination = document.getElementById("pagination");

  // If there are zero items, show nothing
  if (totalItems === 0) {
    pagination.style.display = "none";
    return;
  }

  // read page from query param
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get("page"), 10) || 1;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    listItems.forEach((item, idx) => {
      item.style.display = idx >= start && idx < end ? "block" : "none";
    });

    renderPaginationButtons(page);

    // Update URL without reload
    const newUrl = `${window.location.pathname}?page=${page}`;
    window.history.replaceState(null, "", newUrl);
  }

  function renderPaginationButtons(page) {
    pagination.innerHTML = "";

    // Prev button
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "page-btn prev-btn";
    prevBtn.textContent = "« Prev";
    prevBtn.disabled = page === 1;
    prevBtn.addEventListener("click", () => showPage(page - 1));
    pagination.appendChild(prevBtn);

    // Page numbers: show a compact window if many pages
    const maxButtons = 7; // total numbered buttons to show (including first/last and ellipses)
    const half = Math.floor(maxButtons / 2);

    let startPage = Math.max(1, page - half);
    let endPage = Math.min(totalPages, page + half);

    // adjust when near ends
    if (page - startPage < half) {
      endPage = Math.min(totalPages, endPage + (half - (page - startPage)));
    }
    if (endPage - page < half) {
      startPage = Math.max(1, startPage - (half - (endPage - page)));
    }

    // always show first page and leading ellipsis if needed
    if (startPage > 1) {
      pagination.appendChild(createNumberButton(1, page));
      if (startPage > 2) {
        pagination.appendChild(createEllipsis());
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.appendChild(createNumberButton(i, page));
    }

    // trailing ellipsis and last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pagination.appendChild(createEllipsis());
      }
      pagination.appendChild(createNumberButton(totalPages, page));
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "page-btn next-btn";
    nextBtn.textContent = "Next »";
    nextBtn.disabled = page === totalPages;
    nextBtn.addEventListener("click", () => showPage(page + 1));
    pagination.appendChild(nextBtn);
  }

  function createNumberButton(num, current) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-number";
    btn.textContent = num;
    if (num === current) {
      btn.classList.add("active");
      btn.setAttribute("aria-current", "page");
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => showPage(num));
    }
    return btn;
  }

  function createEllipsis() {
    const span = document.createElement("span");
    span.className = "ellipsis";
    span.textContent = "…";
    return span;
  }

  // initial render
  showPage(currentPage);
});
