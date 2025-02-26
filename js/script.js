// Wait until the HTML document is fully loaded before running the code
document.addEventListener("DOMContentLoaded", function () {
    // Set event listeners for menu items first to ensure they always work
    const noearn = document.getElementById("noearn");
    const home = document.getElementById("home");
    const friends = document.getElementById("friends");
    if (noearn) noearn.addEventListener("click", () => switchMenu("noearn"));
    if (home) home.addEventListener("click", () => switchMenu("home"));
    if (friends) friends.addEventListener("click", () => switchMenu("friends"));

    // Initialize Telegram Web App
    const telegram = window.Telegram.WebApp;
    telegram.ready(); // Ensure Web App is ready

    // Get user data from Telegram
    const user = telegram.initDataUnsafe.user;
    const userId = user?.id; // Telegram user ID, unique per account
    if (!userId) {
        console.error("User ID not found!");
        return;
    }

    // Function to load data based on userId
    function loadUserData() {
        const prefix = `user_${userId}_`; // Prefix for storing data per account
        minerBalance = localStorage.getItem(prefix + "minerBalance") ? parseInt(localStorage.getItem(prefix + "minerBalance")) || 0 : 0;
        dailyMaxClicks = localStorage.getItem(prefix + "dailyMaxClicks") ? parseInt(localStorage.getItem(prefix + "dailyMaxClicks")) || 210 : 210;
        dailyClicksUsed = localStorage.getItem(prefix + "dailyClicksUsed") ? parseInt(localStorage.getItem(prefix + "dailyClicksUsed")) || 0 : 0;
        lastClickDate = localStorage.getItem(prefix + "lastClickDate") || getUTCResetDate();
        totalAdsWatched = localStorage.getItem(prefix + "totalAdsWatched") ? parseInt(localStorage.getItem(prefix + "totalAdsWatched")) || 0 : 0;
        remainingAds = localStorage.getItem(prefix + "remainingAds") ? parseInt(localStorage.getItem(prefix + "remainingAds")) || 10 : 10;
        adWatchCount = localStorage.getItem(prefix + "adWatchCount") ? parseInt(localStorage.getItem(prefix + "adWatchCount")) || 0 : 0;
    }

    // Function to save data based on userId
    function saveUserData() {
        const prefix = `user_${userId}_`;
        localStorage.setItem(prefix + "minerBalance", minerBalance);
        localStorage.setItem(prefix + "dailyMaxClicks", dailyMaxClicks);
        localStorage.setItem(prefix + "dailyClicksUsed", dailyClicksUsed);
        localStorage.setItem(prefix + "lastClickDate", lastClickDate);
        localStorage.setItem(prefix + "totalAdsWatched", totalAdsWatched);
        localStorage.setItem(prefix + "remainingAds", remainingAds);
        localStorage.setItem(prefix + "adWatchCount", adWatchCount);
    }

    // Function to determine the daily reset date at 00:00 UTC
    function getUTCResetDate() {
        const now = new Date();
        const utcNow = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0, // 00:00 UTC
            0, 0, 0
        ));
        if (now.getUTCHours() >= 0) {
            utcNow.setUTCDate(utcNow.getUTCDate() + 1); // Move to the next day if past 00:00 UTC
        }
        return utcNow.toISOString().split('.')[0] + 'Z'; // Format "YYYY-MM-DDTHH:MM:SSZ"
    }

    // Function to check and perform daily reset at 00:00 UTC
    function checkDailyReset() {
        const prefix = `user_${userId}_`;
        loadUserData(); // Load data per account

        const currentUTCReset = getUTCResetDate();
        const lastReset = localStorage.getItem(prefix + "lastClickDate") || '';

        if (currentUTCReset > lastReset) {
            // Daily reset because it's past 00:00 UTC
            dailyClicksUsed = 0;
            dailyMaxClicks = 210;
            lastClickDate = currentUTCReset;
            remainingAds = 10; // Reset remaining daily ads
            adWatchCount = 0; // Reset ad watch count
            localStorage.setItem(prefix + "dailyClicksUsed", dailyClicksUsed);
            localStorage.setItem(prefix + "dailyMaxClicks", dailyMaxClicks);
            localStorage.setItem(prefix + "lastClickDate", lastClickDate);
            localStorage.setItem(prefix + "remainingAds", remainingAds);
            localStorage.setItem(prefix + "adWatchCount", adWatchCount);
            saveUserData(); // Save data per account
        }

        updateClickStatus(); // Update UI after reset
    }

    // Function to switch displayed pages
    function switchMenu(menu) {
        const noearnContent = document.getElementById("noearn-content");
        const homeContent = document.getElementById("home-content");
        const friendsContent = document.getElementById("friends-content");
        if (!noearnContent || !homeContent || !friendsContent) {
            console.error("One of the content elements not found!");
            return;
        }
        noearnContent.classList.add("hidden");
        homeContent.classList.add("hidden");
        friendsContent.classList.add("hidden");
        const selectedContent = document.getElementById(menu + "-content");
        if (!selectedContent) {
            console.error(`Content ${menu}-content not found!`);
            return;
        }
        selectedContent.classList.remove("hidden");
        document.querySelectorAll(".menu-item").forEach(item => {
            item.classList.remove("active");
        });
        const menuItem = document.getElementById(menu);
        if (!menuItem) {
            console.error(`Menu item ${menu} not found!`);
            return;
        }
        menuItem.classList.add("active");
    }

    // Function to update the remaining ads text
    function updateAdCounter() {
        const adCounter = document.getElementById("ad-counter");
        if (!adCounter) {
            console.error("Element #ad-counter not found!");
            return;
        }
        if (remainingAds > 0) {
            adCounter.innerText = remainingAds + " Ads left";
            adCounter.classList.remove("no-ads");
        } else {
            adCounter.innerText = "No ads available";
            adCounter.classList.add("no-ads");
        }
        saveUserData(); // Save data per account
    }

    // Function to update balance text on Home
    function updateBalance() {
        const balance = document.getElementById("balance");
        if (!balance) {
            console.error("Element #balance not found!");
            return;
        }
        balance.innerText = totalAdsWatched;
        saveUserData(); // Save data per account
    }

    // Function to update history on Home page
    function updateHistory() {
        const adsWatched = document.getElementById("ads-watched-count");
        const friendsInvited = document.getElementById("friends-invited-count");
        if (!adsWatched || !friendsInvited) {
            console.error("One of the history elements not found!");
            return;
        }
        adsWatched.innerText = totalAdsWatched;
        friendsInvited.innerText = 0;
        saveUserData(); // Save data per account
    }

    // Function to update miner balance text on Miner page
    function updateMinerBalance() {
        const minerBalanceElement = document.getElementById("miner-balance");
        if (!minerBalanceElement) {
            console.error("Element #miner-balance not found!");
            return;
        }
        minerBalanceElement.innerText = minerBalance;
        saveUserData(); // Save data per account
    }

    // Function to update click status and progress bar on Miner page
    function updateClickStatus() {
        checkDailyReset(); // Ensure daily reset is checked each time this function is called
        const clickStatus = document.getElementById("click-status");
        if (!clickStatus) {
            console.error("Element #click-status not found!");
            return;
        }
        const handIcon = clickStatus.querySelector(".hand-icon");
        let clickText = clickStatus.querySelector("span");
        if (!handIcon || !clickText) {
            clickStatus.innerHTML = `<img src="assets/tap.png" alt="Hand Pointer" class="hand-icon"><span>${dailyMaxClicks}</span>`;
            clickText = clickStatus.querySelector("span");
        } else {
            clickText.textContent = dailyMaxClicks;
        }
        const progress = (dailyClicksUsed / dailyMaxClicks) * 100;
        const progressBar = document.getElementById("progress-bar");
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            if (dailyClicksUsed >= dailyMaxClicks) {
                progressBar.classList.add("full");
            } else {
                progressBar.classList.remove("full");
            }
        }
        saveUserData(); // Save data per account after update
    }

    // Function to add extra daily clicks from other features
    function addExtraClicks(amount) {
        if (isNaN(amount) || amount <= 0) {
            console.error("The additional click amount must be a positive number!");
            return;
        }
        dailyMaxClicks += amount;
        saveUserData();
        updateClickStatus();
        alert(`You have added ${amount} daily clicks. Total clicks now: ${dailyMaxClicks}`);
    }

    // Function to load and display rewarded video ad from AdMob
    function loadRewardedAd(callback) {
        if (typeof adsbygoogle !== 'undefined') {
            adsbygoogle.push({
                google_ad_client: "pub-5249886246065987", // Replace with your AdMob Publisher ID
                google_ad_slot: "4779364593", // Replace with your Rewarded Ad Unit ID
                format: "rewarded-video",
                onAdClosed: function (result) {
                    callback(result && result.isEarned);
                },
                onAdFailedToLoad: function (error) {
                    console.error("Ad failed to load:", error);
                    callback(false);
                }
            });
        } else {
            console.error("AdMob SDK not found!");
            callback(false);
        }
    }

    // Event listener for the "Watch Ad" button on Home page
    document.getElementById("watch-ad")?.addEventListener("click", function () {
        const watchAd = document.getElementById("watch-ad");
        if (!watchAd) {
            console.error("Element #watch-ad not found!");
            return;
        }
        const currentDate = new Date().toDateString();
        if (currentDate !== localStorage.getItem(`user_${userId}_lastAdDate`)) {
            adWatchCount = 0;
            localStorage.setItem(`user_${userId}_lastAdCount`, 0);
            localStorage.setItem(`user_${userId}_lastAdDate`, currentDate);
        }
        const maxAdsPerDay = 5;
        if (remainingAds > 0 && adWatchCount < maxAdsPerDay) {
            remainingAds--;
            totalAdsWatched++;
            adWatchCount++;
            localStorage.setItem(`user_${userId}_lastAdCount`, adWatchCount);
            loadRewardedAd(function (success) {
                if (success) {
                    addExtraClicks(10);
                    saveUserData();
                    updateAdCounter();
                    updateBalance();
                    updateHistory();
                    alert("Ad watched! You earned +10 Additional Clicks (Optional).");
                } else {
                    alert("Ad failed to load. Please try again later.");
                }
            });
        } else if (remainingAds <= 0) {
            alert("No ads left to watch today.");
        } else {
            alert(`Daily ad watch limit (${maxAdsPerDay} times) has been reached. Try again tomorrow!`);
        }
    });

    // Event listener for additional ad watch option on Miner page
    document.getElementById("watch-ad-option")?.addEventListener("click", function () {
        if (remainingAds > 0) {
            remainingAds--;
            totalAdsWatched++;
            loadRewardedAd(function (success) {
                if (success) {
                    addExtraClicks(10);
                    saveUserData();
                    updateAdCounter();
                    updateBalance();
                    updateHistory();
                    alert("Ad watched! You earned +10 Additional Clicks (Optional).");
                } else {
                    alert("Ad failed to load. Please try again later.");
                }
            });
        } else {
            alert("No ads left to watch today.");
        }
    });

    // Event listener for Daily Challenge (Free) on Miner page
    document.getElementById("daily-challenge-btn")?.addEventListener("click", function () {
        completeDailyChallenge();
    });

    // Event listener for Daily Bonus (Free) on Miner page
    document.getElementById("daily-bonus-btn")?.addEventListener("click", function () {
        claimDailyBonus();
    });

    // Event listener for Social Sharing on Miner page
    document.getElementById("share-btn")?.addEventListener("click", function () {
        shareAchievement();
    });

    // Event listener for clicking the coin on Miner page
    document.getElementById("coin")?.addEventListener("click", function (event) {
        const coin = document.getElementById("coin");
        const shineBg = document.getElementById("shine-background");
        if (!coin || !shineBg) {
            console.error("Element #coin or #shine-background not found!");
            return;
        }
        checkDailyReset(); // Ensure daily reset is checked before clicking
        if (dailyClicksUsed >= dailyMaxClicks) {
            alert("You have reached the daily click limit (" + dailyMaxClicks + " clicks) for today. Use additional features to add clicks or try again tomorrow.");
            return;
        }

        dailyClicksUsed += 1;
        minerBalance += 1;
        saveUserData();
        updateMinerBalance();
        updateClickStatus();

        coin.classList.remove("clicked");
        void coin.offsetWidth;
        coin.classList.add("clicked");

        if (navigator.vibrate) {
            navigator.vibrate(10); // Provide a 10ms vibration on supported devices
        }

        // Create floating text "+1" when the coin is clicked
        let floatingText = document.createElement("div");
        floatingText.innerText = "+1";
        floatingText.classList.add("floating-text");
        floatingText.style.left = `${event.clientX}px`;
        floatingText.style.top = `${event.clientY}px`;
        document.body.appendChild(floatingText);

        // Animation for floating text
        setTimeout(() => {
            floatingText.style.transform = "translateY(-200px)";
            floatingText.style.opacity = "0";
            floatingText.style.color = "#ff9900";
        }, 50);
        setTimeout(() => floatingText.remove(), 1550);
    });

    // Function for Daily Challenge (Free)
    function completeDailyChallenge() {
        if (dailyClicksUsed >= 50 && dailyMaxClicks > dailyClicksUsed) {
            addExtraClicks(10);
            alert("Congratulations! You completed the Daily Challenge and earned +10 Additional Clicks.");
        } else {
            alert("Click at least 50 times today to complete the Daily Challenge.");
        }
    }

    // Function for Daily Bonus (Free)
    function claimDailyBonus() {
        const prefix = `user_${userId}_`;
        const lastBonusDate = localStorage.getItem(prefix + "lastBonusDate") || "";
        const currentDate = new Date().toDateString();
        if (lastBonusDate !== currentDate) {
            addExtraClicks(10);
            localStorage.setItem(prefix + "lastBonusDate", currentDate);
            alert("Congratulations! You earned the Daily Bonus +10 Additional Clicks.");
        } else {
            alert("You have already claimed the Daily Bonus today. Try again tomorrow!");
        }
    }

    // Function for Social Sharing
    function shareAchievement() {
        addExtraClicks(10);
        alert("Thank you for sharing! You earned +10 Additional Clicks.");
    }

    // Call initial functions
    switchMenu('home');
    checkDailyReset(); // Ensure daily reset is checked when the game loads
    updateAdCounter();
    updateBalance();
    updateHistory();
    updateMinerBalance();
    updateClickStatus();
});

// Global variables (initialized in loadUserData)
let minerBalance, dailyMaxClicks, dailyClicksUsed, lastClickDate, totalAdsWatched, remainingAds, adWatchCount;