import { db } from "./firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const isim = document.getElementById("isim");
const olustur = document.getElementById("olustur");
const katil = document.getElementById("katil");

const popup = document.getElementById("popup");
const kapat = document.getElementById("kapat");
const odaKod = document.getElementById("odaKod");
const katilBtn = document.getElementById("katilBtn");

function odaKoduOlustur() {
    const karakterler = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let kod = "";
    for (let i = 0; i < 5; i++) {
        kod += karakterler[Math.floor(Math.random() * karakterler.length)];
    }
    return kod;
}

// Her oyuncuya benzersiz bir id üretir.
function oyuncuIdOlustur() {
    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return "p-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
}

// ODA OLUŞTUR
olustur.onclick = async function () {
    if (isim.value.trim() === "") {
        alert("Lütfen ismini gir.");
        return;
    }

    const yeniOdaKodu = odaKoduOlustur();
    const oyuncuId = oyuncuIdOlustur();

    const hostOyuncu = {
        id: oyuncuId,
        name: isim.value.trim(),
        isHost: true,
        connected: true,
        status: "active", // Host her zaman aktiftir
        lastSeen: Date.now()
    };

    await setDoc(doc(db, "rooms", yeniOdaKodu), {
        host: hostOyuncu.name,
        players: [hostOyuncu],
        started: false,
        mode: "klasik",
        settings: {
            mode: "klasik",
            ticaret: false,
            sabotajci: false
        },
        bannedPlayerIds: [],
        bannedNames: [],
        round: {
            roundNumber: 1,
            traveler: null,
            travelerManual: false,
            manualTraveler: null,
            donemId: null,
            status: "yolcu_bekleniyor",
            timerEndsAt: null,
            timerRemaining: 120,
            paused: false,
            result: null,
            usedTravelers: []
        },
        createdAt: Date.now()
    });

    sessionStorage.setItem("isHost", "true");
    sessionStorage.setItem("playerId", oyuncuId);
    sessionStorage.setItem("playerName", hostOyuncu.name);

    window.location.href = "lobby.html?oda=" + yeniOdaKodu;
};

// POPUP AÇ
katil.onclick = function () {
    popup.style.display = "flex";
};

// POPUP KAPAT
kapat.onclick = function () {
    popup.style.display = "none";
};

// DIŞARI TIKLAYINCA KAPAT
popup.onclick = function (e) {
    if (e.target === popup) {
        popup.style.display = "none";
    }
};

// ODAYA KATIL
katilBtn.onclick = async function () {
    if (isim.value.trim() === "") {
        alert("Lütfen ismini gir.");
        return;
    }

    if (odaKod.value.trim() === "") {
        alert("Oda kodunu gir.");
        return;
    }

    const kod = odaKod.value.trim().toUpperCase();
    const odaRef = doc(db, "rooms", kod);
    const oda = await getDoc(odaRef);

    if (!oda.exists()) {
        alert("Böyle bir oda bulunamadı.");
        return;
    }

    const bannedNames = (oda.data().bannedNames || []).map((n) => n.toLowerCase());

    if (bannedNames.includes(isim.value.trim().toLowerCase())) {
        alert("Yönetici seni bu odadan çıkardığı için bu isimle tekrar katılamazsın.");
        return;
    }

    const oyunBasladiMi = oda.data().started === true;
    const oyuncuId = oyuncuIdOlustur();

    // Oyun başladıysa oyuncu "waiting" (bekleyen) olarak katılır
    const yeniOyuncu = {
        id: oyuncuId,
        name: isim.value.trim(),
        isHost: false,
        connected: true,
        status: oyunBasladiMi ? "waiting" : "active",
        lastSeen: Date.now()
    };

    await updateDoc(odaRef, {
        players: arrayUnion(yeniOyuncu)
    });

    sessionStorage.setItem("isHost", "false");
    sessionStorage.setItem("playerId", oyuncuId);
    sessionStorage.setItem("playerName", yeniOyuncu.name);

    // Oyun başladıysa doğrudan oyuna, başlamadıysa lobiye yönlendir
    if (oyunBasladiMi) {
        window.location.href = "game.html?oda=" + kod;
    } else {
        window.location.href = "lobby.html?oda=" + kod;
    }
};
