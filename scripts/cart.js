(function() {
    var CART_KEY = 'courseCart';

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function setCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function isInCart(id) {
        return getCart().some(function(item) { return item.id === id; });
    }

    function showToast(message) {
        var container = document.getElementById('toastContainer');
        if (!container) return;
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        requestAnimationFrame(function() {
            toast.classList.add('toast--visible');
        });
        setTimeout(function() {
            toast.classList.remove('toast--visible');
            setTimeout(function() {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 2500);
    }

    function updateCartCount() {
        var el = document.getElementById('headerCartCount');
        if (el) el.textContent = getCart().length;
    }

    function updateCardButtons() {
        document.querySelectorAll('.card-add-plus').forEach(function(btn) {
            var card = btn.closest('.card');
            var id = card && card.getAttribute('data-id');
            if (!id) return;
            if (isInCart(id)) {
                btn.textContent = '✓';
                btn.classList.add('card-add-plus--in-cart');
                btn.disabled = true;
            } else {
                btn.textContent = '+';
                btn.classList.remove('card-add-plus--in-cart');
                btn.disabled = false;
            }
        });
    }

    function replaceAddToCartWithPlus() {
        document.querySelectorAll('.card').forEach(function(card) {
            var oldBtn = card.querySelector('.card-add-btn');
            if (!oldBtn) return;
            oldBtn.remove();
            var plus = document.createElement('button');
            plus.type = 'button';
            plus.className = 'card-add-plus';
            plus.setAttribute('aria-label', 'Добавить в корзину');
            plus.textContent = '+';
            card.insertBefore(plus, card.firstChild);
        });
    }

    function addToCart(id, title, price) {
        var cart = getCart();
        if (cart.some(function(item) { return item.id === id; })) return;
        cart.push({ id: id, title: title, price: parseInt(price, 10) });
        setCart(cart);
        showToast('Успешно добавлено в корзину');
        updateCartCount();
        updateCardButtons();
    }


    function init() {
        replaceAddToCartWithPlus();
        updateCartCount();
        updateCardButtons();

        document.addEventListener('click', function(e) {
            var btn = e.target.closest('.card-add-plus');
            if (!btn || btn.disabled) return;
            var card = btn.closest('.card');
            if (!card) return;
            var id = card.getAttribute('data-id');
            var title = card.getAttribute('data-title');
            var price = card.getAttribute('data-price');
            if (id && title !== null) {
                addToCart(id, title, price || '0');
            }
        });

        window.addEventListener('storage', function(e) {
            if (e.key === CART_KEY) {
                updateCartCount();
                updateCardButtons();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.SemajCart = {
        updateCartCount: updateCartCount,
        getCart: getCart
    };
})();
