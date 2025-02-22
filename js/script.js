document.addEventListener("DOMContentLoaded", function () {
    let balance = 0;
    let remainingClicks = 2000;
    let period = 3;

    function updateUI() {
        document.getElementById("balance").innerText = balance.toLocaleString();
        document.getElementById("clicks-left").innerText = `${remainingClicks}/${period}`;
    }

    document.getElementById("coin").addEventListener("click", function () {
        balance++;
        remainingClicks--;
        if (remainingClicks === 0 && period > 1) {
            period--;
            remainingClicks = 2000;
        }
        updateUI();

        // Efek getaran
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Efek animasi teks "+1"
        let floatingText = document.createElement("div");
        floatingText.innerText = "+1";
        floatingText.classList.add("floating-text");
        floatingText.style.left = `${event.clientX}px`;
        floatingText.style.top = `${event.clientY}px`;
        document.body.appendChild(floatingText);
        setTimeout(() => floatingText.classList.add("fade-out"), 50);
        setTimeout(() => floatingText.remove(), 1000);
    });

    // Fungsi ganti menu
    function switchMenu(menu) {
        document.querySelectorAll(".menu-item").forEach(item => {
            item.classList.remove("active");
        });
        document.getElementById(menu).classList.add("active");

        if (menu === "home") {
            document.getElementById("coin").style.display = "block";
            document.getElementById("upgrade").style.display = "block";
        } else if (menu === "friends") {
            document.getElementById("coin").style.display = "none";
            document.getElementById("upgrade").style.display = "none";
        }
    }

    document.getElementById("home").addEventListener("click", () => switchMenu("home"));
    document.getElementById("friends").addEventListener("click", () => switchMenu("friends"));

    updateUI();
});
