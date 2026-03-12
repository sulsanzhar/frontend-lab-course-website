(function () {
  'use strict';

  var COUNTDOWN_END = new Date(2026, 10, 27, 23, 59, 59);

  var perPage = 6;
  var currentPage = 1;

  var products = [
    { id: 'bf-1', title: 'Become A Social Media Expert', originalPrice: 49, discount: 40, category: 'Digital Marketing' },
    { id: 'bf-2', title: 'Advance Your 3d Modelling Skill', originalPrice: 59, discount: 30, category: '3D Artist' },
    { id: 'bf-3', title: 'The Art Of Growing Relationship', originalPrice: 29, discount: 50, category: 'Design' },
    { id: 'bf-4', title: 'Skills Needed In Becoming A Designer', originalPrice: 69, discount: 25, category: 'Design' },
    { id: 'bf-5', title: 'Learn Logo Design', originalPrice: 39, discount: 20, category: 'Design' },
    { id: 'bf-6', title: 'Become A Web Developer', originalPrice: 59, discount: 35, category: 'Web Development' },
    { id: 'bf-7', title: 'Embark On The Journey Of Becoming An Artist', originalPrice: 79, discount: 45, category: 'Design' },
    { id: 'bf-8', title: '4 Weeks Photography Bootcamp', originalPrice: 45, discount: 30, category: 'Photography' },
    { id: 'bf-9', title: 'Learn Organization Management', originalPrice: 49, discount: 15, category: 'Digital Marketing' },
    { id: 'bf-10', title: '3 in 1 Course Of Becoming A Makeup Artist', originalPrice: 55, discount: 40, category: 'Design' },
    { id: 'bf-11', title: 'How To Have A Good Listening Ear For Music', originalPrice: 35, discount: 50, category: 'Sound & Music' },
    { id: 'bf-12', title: 'Motion Graphics Masterclass', originalPrice: 65, discount: 35, category: 'Motion Graphics' },
    { id: 'bf-13', title: 'React & Node Full Stack', originalPrice: 79, discount: 40, category: 'Web Development' },
    { id: 'bf-14', title: 'UI/UX Design Fundamentals', originalPrice: 54, discount: 35, category: 'Design' },
    { id: 'bf-15', title: 'Portrait Photography Pro', originalPrice: 48, discount: 45, category: 'Photography' },
    { id: 'bf-16', title: 'Blender 3D From Zero', originalPrice: 62, discount: 30, category: '3D Artist' },
    { id: 'bf-17', title: 'After Effects For Beginners', originalPrice: 58, discount: 38, category: 'Motion Graphics' },
    { id: 'bf-18', title: 'Music Production With Ableton', originalPrice: 69, discount: 25, category: 'Sound & Music' },
    { id: 'bf-19', title: 'SEO & Content Marketing', originalPrice: 44, discount: 42, category: 'Digital Marketing' },
    { id: 'bf-20', title: 'Figma To Code', originalPrice: 52, discount: 28, category: 'Design' },
    { id: 'bf-21', title: 'Python For Web', originalPrice: 59, discount: 33, category: 'Web Development' },
    { id: 'bf-22', title: 'Landscape Photography', originalPrice: 41, discount: 48, category: 'Photography' },
    { id: 'bf-23', title: 'Cinema 4D Basics', originalPrice: 72, discount: 22, category: '3D Artist' },
    { id: 'bf-24', title: 'Premiere Pro Editing', originalPrice: 55, discount: 36, category: 'Motion Graphics' },
    { id: 'bf-25', title: 'Sound Design For Video', originalPrice: 47, discount: 44, category: 'Sound & Music' },
    { id: 'bf-26', title: 'Facebook & Instagram Ads', originalPrice: 49, discount: 38, category: 'Digital Marketing' },
    { id: 'bf-27', title: 'Brand Identity Design', originalPrice: 61, discount: 32, category: 'Design' },
    { id: 'bf-28', title: 'Vue.js Complete Course', originalPrice: 56, discount: 40, category: 'Web Development' },
    { id: 'bf-29', title: 'Product Photography', originalPrice: 43, discount: 28, category: 'Photography' },
    { id: 'bf-30', title: 'Character Modelling In 3D', originalPrice: 68, discount: 26, category: '3D Artist' },
  ];

  function getDiscountedPrice(originalPrice, discountPercent) {
    return Math.round(originalPrice * (1 - discountPercent / 100));
  }

  function getFilterState() {
    return {
      category: (document.getElementById('filterCategory') && document.getElementById('filterCategory').value) || '',
      sort: (document.getElementById('filterSort') && document.getElementById('filterSort').value) || '',
    };
  }

  function filterAndSortProducts(list, state) {
    var filtered = list.slice();

    if (state.category) {
      filtered = filtered.filter(function (p) {
        return p.category === state.category;
      });
    }

    if (state.sort === 'discount-desc') {
      filtered.sort(function (a, b) {
        return b.discount - a.discount;
      });
    } else if (state.sort === 'discount-asc') {
      filtered.sort(function (a, b) {
        return a.discount - b.discount;
      });
    }

    return filtered;
  }

  function renderProductCard(product) {
    var price = getDiscountedPrice(product.originalPrice, product.discount);
    var priceHtml =
      product.discount > 0
        ? '<span class="card-price-old">$' + product.originalPrice + '</span><span class="card-price">$' + price + '</span>'
        : '<span class="card-price">$' + product.originalPrice + '</span>';

    return (
      '<div class="card blackfriday-card" data-id="' +
      product.id +
      '" data-title="' +
      product.title.replace(/"/g, '&quot;') +
      '" data-price="' +
      price +
      '" data-type="Premium">' +
      '<button type="button" class="card-add-plus" aria-label="Add to cart">+</button>' +
      '<div class="card-img"></div>' +
      '<div class="card-badge">-' + product.discount + '%</div>' +
      '<div class="card-footer">' +
      '<div class="card-title">' +
      product.title +
      '</div>' +
      '<div class="card-price-wrap">' +
      priceHtml +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function renderPagination(totalFiltered, totalPages) {
    var wrap = document.getElementById('bfPagination');
    if (!wrap) return;
    wrap.innerHTML = '';

    if (totalPages <= 0) return;

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'pagination-btn pagination-prev';
    prevBtn.textContent = 'Back';
    prevBtn.setAttribute('aria-label', 'Previous page');
    if (currentPage <= 1) prevBtn.disabled = true;
    prevBtn.addEventListener('click', function () {
      if (currentPage > 1) {
        currentPage--;
        applyFilters();
      }
    });
    wrap.appendChild(prevBtn);

    var maxVisible = 5;
    var start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    var end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    for (var i = start; i <= end; i++) {
      (function (page) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pagination-btn' + (page === currentPage ? ' pagination-btn--active' : '');
        btn.textContent = String(page);
        btn.setAttribute('aria-label', 'Page ' + page);
        btn.addEventListener('click', function () {
          currentPage = page;
          applyFilters();
        });
        wrap.appendChild(btn);
      })(i);
    }

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'pagination-btn pagination-next';
    nextBtn.textContent = 'Next';
    nextBtn.setAttribute('aria-label', 'Next page');
    if (currentPage >= totalPages) nextBtn.disabled = true;
    nextBtn.addEventListener('click', function () {
      if (currentPage < totalPages) {
        currentPage++;
        applyFilters();
      }
    });
    wrap.appendChild(nextBtn);
  }

  function renderProducts(filteredList) {
    var container = document.getElementById('productsContainer');
    var emptyEl = document.getElementById('productsEmpty');
    var resultsEl = document.getElementById('resultsInfo');
    var paginationEl = document.getElementById('bfPagination');

    if (!container) return;

    var totalFiltered = filteredList.length;
    var totalPages = totalFiltered === 0 ? 0 : Math.ceil(totalFiltered / perPage);
    currentPage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;

    var from = (currentPage - 1) * perPage;
    var to = Math.min(from + perPage, totalFiltered);
    var pageList = totalFiltered === 0 ? [] : filteredList.slice(from, from + perPage);

    if (totalFiltered === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      if (paginationEl) paginationEl.innerHTML = '';
      if (resultsEl) {
        var fromSpan = document.getElementById('bfResultsFrom');
        var toSpan = document.getElementById('bfResultsTo');
        var countSpan = document.getElementById('bfResultsCount');
        if (fromSpan) fromSpan.textContent = '0';
        if (toSpan) toSpan.textContent = '0';
        if (countSpan) countSpan.textContent = '0';
      }
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    var fromSpan = document.getElementById('bfResultsFrom');
    var toSpan = document.getElementById('bfResultsTo');
    var countSpan = document.getElementById('bfResultsCount');
    if (fromSpan) fromSpan.textContent = String(from + 1);
    if (toSpan) toSpan.textContent = String(to);
    if (countSpan) countSpan.textContent = String(totalFiltered);

    var COLUMNS = 3;
    var placeholdersCount = (COLUMNS - (pageList.length % COLUMNS)) % COLUMNS;
    var placeholdersHtml = '';
    for (var i = 0; i < placeholdersCount; i++) {
      placeholdersHtml += '<div class="card-placeholder" aria-hidden="true"></div>';
    }
    container.innerHTML = pageList.map(renderProductCard).join('') + placeholdersHtml;

    var cart = JSON.parse(localStorage.getItem('courseCart') || '[]');
    container.querySelectorAll('.card-add-plus').forEach(function (btn) {
      var card = btn.closest('.card');
      var id = card && card.getAttribute('data-id');
      if (id && cart.some(function (item) { return item.id === id; })) {
        btn.textContent = '✓';
        btn.classList.add('card-add-plus--in-cart');
        btn.disabled = true;
      }
    });

    renderPagination(totalFiltered, totalPages);
  }

  function applyFilters() {
    var state = getFilterState();
    var filtered = filterAndSortProducts(products, state);
    renderProducts(filtered);
  }

  function initCountdown() {
    var daysEl = document.getElementById('countdown-days');
    var hoursEl = document.getElementById('countdown-hours');
    var minutesEl = document.getElementById('countdown-minutes');
    var secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }

    function tick() {
      var now = new Date();
      var diff = COUNTDOWN_END.getTime() - now.getTime();

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      var totalSeconds = Math.floor(diff / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  }

  function initFilters() {
    ['filterCategory', 'filterSort'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', function () {
          currentPage = 1;
          applyFilters();
        });
      }
    });

    var resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        var cat = document.getElementById('filterCategory');
        var sort = document.getElementById('filterSort');
        if (cat) cat.value = '';
        if (sort) sort.value = '';
        currentPage = 1;
        applyFilters();
      });
    }
  }

  function init() {
    initCountdown();
    initFilters();
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
