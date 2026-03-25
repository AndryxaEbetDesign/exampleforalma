(function () {
  var heroTitleEl = document.querySelector("[data-hero-title]");
  var heroSubtitleEl = document.querySelector("[data-hero-subtitle]");
  var heroCtaBtn = document.querySelector("[data-hero-cta]");
  var heroTabs = document.querySelectorAll(".hero-tab");

  var heroVariants = {
    A: {
      title: "Фракционный CO2: кожа ровнее, по протоколу",
      subtitle: "Контроль глубины + повторяемая серия для предсказуемого результата.",
      cta: { type: "demo", label: "Запросить демо" },
    },
    B: {
      title: "Точность, которую видно на каждом визите",
      subtitle: "Консистентный результат без угадываний.",
      cta: { type: "protocols", label: "Получить клинические протоколы" },
    },
    C: {
      title: "Комфорт пациенту. Контроль врачу. Ясно бизнесу.",
      subtitle: "Фракционный CO2 для стабильных циклов процедур.",
      cta: { type: "payback", label: "Рассчитать окупаемость" },
    },
  };

  function setHeroVariant(variantKey) {
    var v = heroVariants[variantKey];
    if (!v) return;

    heroTabs.forEach(function (t) {
      t.classList.toggle("is-active", t.getAttribute("data-hero-variant") === variantKey);
      t.setAttribute("aria-selected", t.getAttribute("data-hero-variant") === variantKey ? "true" : "false");
    });

    if (heroTitleEl) heroTitleEl.textContent = v.title;
    if (heroSubtitleEl) heroSubtitleEl.textContent = v.subtitle;

    if (heroCtaBtn) {
      heroCtaBtn.textContent = v.cta.label;
      heroCtaBtn.dataset.heroCta = v.cta.type;
    }
  }

  heroTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-hero-variant");
      setHeroVariant(key);
    });
  });

  if (heroCtaBtn) {
    heroCtaBtn.addEventListener("click", function () {
      var type = heroCtaBtn.dataset.heroCta || "demo";
      openModalFor(type);
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Modal
  var modal = document.getElementById("cta-modal");
  var modalTitle = document.getElementById("modal-title");
  var modalSub = document.getElementById("modal-sub");
  var ctaForm = document.getElementById("cta-form");

  var modalState = {
    intent: "launch",
  };

  var closeBtns = document.querySelectorAll("[data-close-modal='true']");
  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeModal();
    });
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  function openModalFor(intent) {
    modalState.intent = intent || "launch";
    var config = getIntentConfig(modalState.intent);
    if (modalTitle) modalTitle.textContent = config.title;
    if (modalSub) modalSub.textContent = config.sub;
    if (modal) modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
  }

  function getIntentConfig(intent) {
    if (intent === "protocols") {
      return {
        title: "Запрос клинических протоколов",
        sub: "Отправим пакет протоколов под вашу серию.",
      };
    }
    if (intent === "payback") {
      return {
        title: "Расчёт окупаемости",
        sub: "Поделитесь вводными — сопоставим логику окупаемости для вашей серии.",
      };
    }
    if (intent === "demo") {
      return {
        title: "Запрос демо",
        sub: "Предложим формат демонстрации под ваш рабочий процесс.",
      };
    }
    return {
      title: "План запуска клиники",
      sub: "Без обязательств. Сопоставим вашу серию и требования к запуску.",
    };
  }

  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModalFor(btn.getAttribute("data-open-modal"));
    });
  });

  if (ctaForm) {
    ctaForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var formData = new FormData(ctaForm);
      var name = formData.get("name") || "";
      var email = formData.get("email") || "";
      var role = formData.get("role") || "";
      var region = formData.get("region") || "";
      var goal = formData.get("goal") || "";

      // Placeholder inbox: replace with the real sales email for production.
      var to = "sales@clinic-demo.com";

      var intent = modalState.intent || "launch";
      var intentRu =
        intent === "protocols"
          ? "клинические протоколы"
          : intent === "payback"
          ? "расчёт окупаемости"
          : intent === "demo"
          ? "демо"
          : "план запуска";

      var subject = "Фракционный CO2 — " + intentRu;

      var body = [
        "Имя: " + name,
        "Рабочая почта: " + email,
        "Роль: " + role,
        "Город / регион: " + region,
        "",
        "Тема: " + intentRu,
        "Цель: " + goal,
        "",
        "Микротекст: Без обязательств. Вернёмся с следующими шагами.",
      ].join("\n");

      var mailto = "mailto:" + encodeURIComponent(to) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      closeModal();
      window.location.href = mailto;
    });
  }
})();

