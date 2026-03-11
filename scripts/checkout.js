(function () {
  var form = document.getElementById("checkoutForm");
  var successBlock = document.getElementById("checkoutSuccess");

  var fields = {
    fullName: {
      el: document.getElementById("fullName"),
      error: document.getElementById("errorFullName"),
    },
    email: {
      el: document.getElementById("email"),
      error: document.getElementById("errorEmail"),
    },
    phone: {
      el: document.getElementById("phone"),
      error: document.getElementById("errorPhone"),
    },
    address: {
      el: document.getElementById("address"),
      error: document.getElementById("errorAddress"),
    },
    payment: { error: document.getElementById("errorPayment") },
  };

  var requiredMessages = {
    fullName: "Укажите имя и фамилию",
    email: "Укажите email",
    phone: "Укажите номер телефона",
    address: "Укажите адрес доставки",
    payment: "Выберите способ оплаты",
  };

  function getPaymentSelected() {
    var radios = form.querySelectorAll('input[name="payment"]:checked');
    return radios.length ? radios[0].value : "";
  }

  function clearErrors() {
    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      if (f.error) f.error.textContent = "";
      if (f.el) {
        f.el.classList.remove("checkout-form__input--error");
        f.el.setAttribute("aria-invalid", "false");
      }
    });
    if (fields.payment.error) fields.payment.error.textContent = "";
  }

  function showError(key, message) {
    var f = fields[key];
    if (f && f.error) f.error.textContent = message;
    if (f && f.el) {
      f.el.classList.add("checkout-form__input--error");
      f.el.setAttribute("aria-invalid", "true");
    }
  }

  function validate() {
    clearErrors();
    var valid = true;
    var fullName =
      fields.fullName.el && fields.fullName.el.value
        ? fields.fullName.el.value.trim()
        : "";
    var email =
      fields.email.el && fields.email.el.value
        ? fields.email.el.value.trim()
        : "";
    var phone =
      fields.phone.el && fields.phone.el.value
        ? fields.phone.el.value.trim()
        : "";
    var address =
      fields.address.el && fields.address.el.value
        ? fields.address.el.value.trim()
        : "";
    var payment = getPaymentSelected();

    if (!fullName) {
      showError("fullName", requiredMessages.fullName);
      valid = false;
    }
    if (!email) {
      showError("email", requiredMessages.email);
      valid = false;
    }
    if (!phone) {
      showError("phone", requiredMessages.phone);
      valid = false;
    }
    if (!address) {
      showError("address", requiredMessages.address);
      valid = false;
    }
    if (!payment) {
      if (fields.payment.error)
        fields.payment.error.textContent = requiredMessages.payment;
      valid = false;
    }

    return valid;
  }

  function showSuccess() {
    if (form) form.style.display = "none";
    if (successBlock) successBlock.style.display = "block";
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      showSuccess();
    });
  }

  if (document.getElementById("headerCartCount")) {
    try {
      var cart = JSON.parse(localStorage.getItem("courseCart") || "[]");
      document.getElementById("headerCartCount").textContent = cart.length;
    } catch (err) {}
  }
})();
