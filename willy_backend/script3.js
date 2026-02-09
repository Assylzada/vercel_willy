// ===========================================
// 🍭 GLOBAL SCRIPTS (должны быть первыми)
// ===========================================

// 🔐 Проверка токена (для защищённых страниц)
(function authGuard() {
    const token = localStorage.getItem("token");
    const publicPages = ["/auth.html", "/index.html", "/"];

    const currentPath = window.location.pathname;

    if (!token && !publicPages.includes(currentPath)) {
        window.location.href = "/auth.html";
    }
})();

// =========================
// 🎭 Mood / конфеты / эффекты
// =========================
function setMood(type) {
    console.log("Active Mood:", type);
    const body = document.body;

    body.classList.remove("mood-chocolate", "mood-magic", "mood-chaos");
    body.classList.add("mood-" + type);

    if (type === "chaos") {
        spawnCandy();
        showNotification("💥 Oompa-Loompas are running wild!");
    } else if (type === "magic") {
        showNotification("✨ Pure Imagination mode activated...");
    } else if (type === "chocolate") {
        showNotification("🍫 Chocolate river activated!");
    }
}

function spawnCandy() {
    const emojis = ["🍬", "🍭", "🍫", "🍩", "🍪"];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const candy = document.createElement("div");
            candy.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            candy.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}vw;
                font-size: 30px;
                z-index: 10000;
                pointer-events: none;
                transition: transform 3s linear, opacity 2s;
            `;
            document.body.appendChild(candy);

            setTimeout(() => {
                candy.style.transform = "translateY(110vh) rotate(360deg)";
                candy.style.opacity = "0";
            }, 100);

            setTimeout(() => candy.remove(), 3500);
        }, i * 150);
    }
}

function showNotification(msg) {
    const toast = document.createElement("div");
    toast.className = "notification";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// =========================
// 🚀 READY BLOCK
// =========================
$(document).ready(function () {

    // 📊 Scroll Progress Bar
    $(window).on("scroll", function () {
        const winScroll = $(window).scrollTop();
        const height = $(document).height() - $(window).height();
        const scrolled = (winScroll / height) * 100;
        $("#scrollBar").css("width", scrolled + "%");
    });

    // 🌗 Theme Toggle
    $("#themeToggle").on("change", function () {
        $("body").toggleClass("light-mode");
        const isLight = $("body").hasClass("light-mode");
        localStorage.setItem("wonkaTheme", isLight ? "light" : "dark");
    });

    // Load saved theme
    if (localStorage.getItem("wonkaTheme") === "light") {
        $("body").addClass("light-mode");
        $("#themeToggle").prop("checked", true);
    }

    // 🔍 Live Search (Gallery)
    $("#wonkaSearch").on("keyup", function () {
        const value = $(this).val().toLowerCase();
        $(".gallery figure").filter(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

    // 📩 Contact Form → MongoDB (Vercel compatible)
    $("#contactForm").on("submit", async function (e) {
        e.preventDefault();

        $(".error-text").remove();

        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const message = $("#message").val().trim();

        let isValid = true;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            $("<p class='error-text'>Name is required</p>").insertAfter("#name");
            isValid = false;
        }
        if (!emailPattern.test(email)) {
            $("<p class='error-text'>Valid email is required</p>").insertAfter("#email");
            isValid = false;
        }
        if (message.length < 5) {
            $("<p class='error-text'>Message too short</p>").insertAfter("#message");
            isValid = false;
        }

        if (!isValid) return;

        const btn = $(this).find("button[type='submit']");
        btn.prop("disabled", true).text("Sending...");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send");

            showNotification("🎉 Golden Ticket sent successfully!");
            $("#contactForm")[0].reset();
        } catch (err) {
            showNotification("❌ " + err.message);
        } finally {
            btn.prop("disabled", false).text("Send Golden Ticket");
        }
    });
});
