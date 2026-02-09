// ===========================================
// 🍭 GLOBAL SETTINGS & AUTH (Vercel-safe)
// ===========================================
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const protectedPages = ["/willy.html", "/factory.html"];
    const currentPage = window.location.pathname;

    if (!token && protectedPages.some(p => currentPage.endsWith(p))) {
        window.location.href = "/index.html";
    }

    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("wonkaTheme") || "dark";

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle && (themeToggle.checked = true);
    }

    themeToggle?.addEventListener("change", () => {
        const isLight = document.body.classList.toggle("light-mode");
        localStorage.setItem("wonkaTheme", isLight ? "light" : "dark");
    });
});

// =========================
// 🍬 WONKA EFFECTS (Global)
// =========================
function setMood(type) {
    const body = document.body;
    body.classList.remove("mood-chocolate", "mood-magic", "mood-chaos");
    body.classList.add("mood-" + type);

    if (type === "chaos") spawnCandy();

    showNotification(
        type === "chaos" ? "💥 Oompa-Loompas are running wild!" :
        type === "magic" ? "✨ Pure Imagination mode activated..." :
        "🍫 Chocolate river activated!"
    );
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
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ffcc00;
        padding: 12px 25px;
        border-radius: 10px;
        z-index: 10001;
        color: #000;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===========================================
// 🛠 JQUERY MAIN BLOCK (API READY FOR VERCEL)
// ===========================================
$(document).ready(function () {

    // ✅ ВАЖНО: относительный API
    const API_BASE = "/api";

    // --- Scroll progress ---
    if (!$("#scrollBar").length) {
        $("body").prepend('<div id="scrollBar" style="position:fixed;top:0;left:0;height:5px;background:gold;z-index:9999;width:0%;"></div>');
    }

    $(window).on("scroll", function () {
        const scrolled = ($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;
        $("#scrollBar").css("width", scrolled + "%");

        $("img[data-src]").each(function () {
            if ($(window).scrollTop() + $(window).height() > $(this).offset().top) {
                $(this).attr("src", $(this).data("src")).removeAttr("data-src");
            }
        });
    });

    // --- Search ---
    $("#wonkaSearch, #shopSearch").on("keyup", function () {
        const value = $(this).val().toLowerCase();
        $(".gallery figure, .product, .shop-item").toggle(function () {
            return $(this).text().toLowerCase().includes(value);
        });
    });

    // --- Contact Form ---
    $("#contactForm").on("submit", async function (e) {
        e.preventDefault();
        const btn = $(this).find("button[type='submit']").prop("disabled", true).text("Sending...");

        try {
            const res = await fetch(`${API_BASE}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: $("#name").val(),
                    email: $("#email").val(),
                    message: $("#message").val()
                })
            });
            if (!res.ok) throw new Error("Server error");

            showNotification("🎉 Message sent to the Factory!");
            this.reset();
        } catch (err) {
            showNotification("❌ " + err.message);
        } finally {
            btn.prop("disabled", false).text("Send Golden Ticket");
        }
    });

    // --- Tickets ---
    let step = 0;
    const steps = $(".form-step");

    $("#registerForm").on("click", ".next", () => {
        if (steps.eq(step).find("input,select")[0].checkValidity()) {
            steps.removeClass("active").eq(++step).addClass("active");
        }
    });

    $("#registerForm").on("click", ".back", () => {
        steps.removeClass("active").eq(--step).addClass("active");
    });

    $("#registerForm").on("submit", async function (e) {
        e.preventDefault();
        const btn = $(this).find("button[type='submit']").prop("disabled", true).text("Processing...");

        try {
            const res = await fetch(`${API_BASE}/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: $("#fullName").val(),
                    passport: $("#passport").val(),
                    email: $("#email").val(),
                    testDate: $("#test_date").val(),
                    city: $("#city").val()
                })
            });
            if (!res.ok) throw new Error("Database error");

            showNotification("✅ Registration successful!");
            this.reset();
            step = 0;
            steps.removeClass("active").eq(0).addClass("active");
        } catch (err) {
            showNotification("❌ " + err.message);
        } finally {
            btn.prop("disabled", false).text("Register");
        }
    });

    // --- Subscribe ---
    $("#popupForm").on("submit", async function (e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: $("#popupEmail").val() })
            });
            if (!res.ok) throw new Error("Failed");
            showNotification("📧 Subscribed successfully!");
            $("#popup").fadeOut();
            this.reset();
        } catch {
            showNotification("❌ Subscription error");
        }
    });
});

// ===========================================
// 🎨 VANILLA JS (UI ONLY)
// ===========================================

// Stars
document.querySelectorAll(".star").forEach((s, i, arr) => {
    s.addEventListener("click", () => {
        arr.forEach((x, j) => x.classList.toggle("active", j <= i));
        document.querySelector("#ratingMessage").textContent = `Rated ${i + 1}/5 — scrumdiddlyumptious! 🍫`;
    });
});
