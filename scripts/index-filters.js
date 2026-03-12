(function () {
  'use strict';

  var COLUMNS = 3;
  var perPage = 6;
  var currentPage = 1;
  var allCards = [];

  function getContainer() {
    return document.getElementById('indexCardsContainer');
  }

  function getFilterState() {
    return {
      category: (document.getElementById('indexFilterCategory') && document.getElementById('indexFilterCategory').value) || '',
      stock: (document.getElementById('indexFilterStock') && document.getElementById('indexFilterStock').value) || '',
    };
  }

  function getCards() {
    var container = getContainer();
    if (!container) return [];
    var cards = container.querySelectorAll('.card:not(.card-placeholder)');
    return Array.prototype.slice.call(cards);
  }

  function ensureAllCards() {
    if (allCards.length === 0) {
      allCards = getCards();
    }
    return allCards;
  }

  function filterCards(cards, state) {
    var list = cards.slice();
    if (state.category) {
      list = list.filter(function (card) {
        return card.getAttribute('data-category') === state.category;
      });
    }
    if (state.stock !== '') {
      var inStock = state.stock === '1';
      list = list.filter(function (card) {
        return card.getAttribute('data-in-stock') === (inStock ? '1' : '0');
      });
    }
    return list;
  }

  function createPlaceholder() {
    var div = document.createElement('div');
    div.className = 'card-placeholder';
    div.setAttribute('aria-hidden', 'true');
    return div;
  }

  function renderPagination(totalFiltered, totalPages) {
    var wrap = document.getElementById('indexPagination');
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

  function applyFilters() {
    var container = getContainer();
    if (!container) return;

    ensureAllCards();
    var state = getFilterState();
    var filtered = filterCards(allCards, state);
    var totalFiltered = filtered.length;
    var totalPages = totalFiltered === 0 ? 0 : Math.ceil(totalFiltered / perPage);
    currentPage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;

    var from = (currentPage - 1) * perPage;
    var to = Math.min(from + perPage, totalFiltered);
    var pageCards = totalFiltered === 0 ? [] : filtered.slice(from, from + perPage);

    container.innerHTML = '';
    pageCards.forEach(function (card) {
      container.appendChild(card);
    });

    var placeholdersCount = perPage - pageCards.length;
    for (var i = 0; i < placeholdersCount; i++) {
      container.appendChild(createPlaceholder());
    }

    var fromEl = document.getElementById('indexResultsFrom');
    var toEl = document.getElementById('indexResultsTo');
    var countEl = document.getElementById('indexResultsCount');
    if (fromEl) fromEl.textContent = totalFiltered === 0 ? '0' : String(from + 1);
    if (toEl) toEl.textContent = String(to);
    if (countEl) countEl.textContent = String(totalFiltered);

    renderPagination(totalFiltered, totalPages);

    var cart = JSON.parse(localStorage.getItem('courseCart') || '[]');
    container.querySelectorAll('.card-add-btn').forEach(function (btn) {
      if (btn.disabled) return;
      var id = btn.getAttribute('data-id');
      if (cart.some(function (item) { return item.id === id; })) {
        btn.textContent = 'In cart';
        btn.classList.add('card-add-btn--in-cart');
        btn.disabled = true;
      }
    });
  }

  function init() {
    var cat = document.getElementById('indexFilterCategory');
    var stock = document.getElementById('indexFilterStock');
    var reset = document.getElementById('indexFilterReset');

    if (cat) cat.addEventListener('change', function () { currentPage = 1; applyFilters(); });
    if (stock) stock.addEventListener('change', function () { currentPage = 1; applyFilters(); });
    if (reset) {
      reset.addEventListener('click', function () {
        if (cat) cat.value = '';
        if (stock) stock.value = '';
        currentPage = 1;
        applyFilters();
      });
    }

    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
