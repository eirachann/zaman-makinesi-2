import { db } from "./firebase.js";
import {
    doc,
    onSnapshot,
    updateDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const odaKodu = params.get("oda");

// Güvenli element seçimi (Hata vermesini önler)
const odaKoduEl = document.getElementById("odaKodu");
if (odaKoduEl && odaKodu) {
    odaKoduEl.textContent = odaKodu;
}

const oyuncularDiv = document.getElementById("oyuncular");
const baslat = document.getElementById("baslat");
const kopyala = document.getElementById("kopyala");
const hostAyarlar = document.getElementById("hostAyarlar");
const modSelect = document.getElementById("mod");

const benHost = sessionStorage.getItem("isHost") === "true";
const playerId = sessionStorage.getItem("playerId");
let yonlendirildi = false;

if (benHost) {
    if (baslat) baslat.style.display = "block";
    if (hostAyarlar) hostAyarlar.style.display = "block";
} else {
    if (baslat) baslat.style.display = "none";
    if (hostAyarlar) hostAyarlar.style.display = "none";

    const kutu = document.querySelector(".kutu");
    if (kutu) {
        const yazi = document.createElement("p");
        yazi.innerHTML = "⏳ Yöneticinin oyunu başlatması bekleniyor...";
        kutu.appendChild(yazi);
    }
}

// Oda kodunu kopyala
if (kopyala) {
    kopyala.onclick = async function () {
        if (!odaKodu) return;
        await navigator.clipboard.writeText(odaKodu);
        kopyala.textContent = "✅ Kopyalandı!";
        setTimeout(() => {
            kopyala.textContent = "📋 Oda Kodunu Kopyala";
        }, 2000);
    };
}

if (odaKodu) {
    const odaRef = doc(db, "rooms", odaKodu);

    // Host bir oyuncuyu odadan geçici olarak atar (aynı isimle bu odaya tekrar giremez)
    async function oyuncuyuAt(hedefId, hedefIsim) {
        if (!benHost) return;
        if (!confirm(`${hedefIsim} adlı oyuncuyu odadan atmak istediğine emin misin?`)) return;

        try {
            const guncelSnap = await getDoc(odaRef);
            const guncelVeri = guncelSnap.data();

            const kalanOyuncular = (guncelVeri.players || []).filter((o) => o.id !== hedefId);
            const guncelBanliId = [...(guncelVeri.bannedPlayerIds || []), hedefId];
            const guncelBanliIsim = [...(guncelVeri.bannedNames || []), hedefIsim.toLowerCase()];

            await updateDoc(odaRef, {
                players: kalanOyuncular,
                bannedPlayerIds: guncelBanliId,
                bannedNames: guncelBanliIsim
            });
        } catch (err) {
            console.error("Oyuncu atılırken hata oluştu:", err);
        }
    }

    onSnapshot(odaRef, (snapshot) => {
        console.log("Snapshot geldi:", snapshot.data());

        if (!snapshot.exists()) {
            if (oyuncularDiv) oyuncularDiv.innerHTML = "Oda bulunamadı.";
            return;
        }

        const veri = snapshot.data();

        // Ben (host olmayan biri) atıldıysam burada dur, başka hiçbir şey işleme
        if (!benHost && (veri.bannedPlayerIds || []).includes(playerId)) {
            sessionStorage.removeItem("isHost");
            sessionStorage.removeItem("playerId");
            sessionStorage.removeItem("playerName");

            const kutu = document.querySelector(".kutu");
            if (kutu) {
                kutu.innerHTML = `
                    <div class="lobby-header">
                        <h1>🚫 Odadan Çıkarıldın</h1>
                        <p>Yönetici seni bu odadan çıkardı.</p>
                    </div>
                    <button onclick="window.location.href='index.html'">🏠 Ana Sayfaya Dön</button>
                `;
            }
            return;
        }

        if (oyuncularDiv) {
            oyuncularDiv.innerHTML = "";
            if (veri.players && Array.isArray(veri.players)) {
                veri.players.forEach((oyuncu) => {
                    const tac = oyuncu.isHost ? "👑 " : "";
                    const durum = oyuncu.connected ? "🟢" : "⚪";

                    const atmaBtn = (benHost && !oyuncu.isHost)
                        ? `<button class="kick-btn" data-id="${oyuncu.id}" data-isim="${oyuncu.name}">🚫 At</button>`
                        : "";

                    oyuncularDiv.innerHTML += `
                        <div class="oyuncu">
                            <span>${durum} ${tac}${oyuncu.name}</span>
                            ${atmaBtn}
                        </div>
                    `;
                });

                if (benHost) {
                    oyuncularDiv.querySelectorAll(".kick-btn").forEach((btn) => {
                        btn.onclick = () => oyuncuyuAt(btn.dataset.id, btn.dataset.isim);
                    });
                }
            }
        }

        // Host oyunu başlatınca herkes otomatik oyun ekranına geçsin
        if (veri.started && !yonlendirildi) {
            if (!benHost) {
                yonlendirildi = true;
                window.location.href = "game.html?oda=" + odaKodu;
            }
        }
    });

    // Sadece host oyunu başlatabilir
    if (baslat) {
        baslat.onclick = async function () {
            if (!benHost) return;

            try {
                baslat.disabled = true;
                baslat.textContent = "Başlatılıyor...";

                const secilenMod = modSelect ? modSelect.value : "klasik";
                const ticaretAktif = document.getElementById("ticaretCheck")?.checked || false;
                const sabotajciAktif = document.getElementById("sabotajciCheck")?.checked || false;

                const veri = {
                    started: true,
                    status: "playing",
                    isLobbyMode: false,
                    gameState: "starting",
                    mode: secilenMod,
                    settings: {
                        mode: secilenMod,
                        ticaret: ticaretAktif,
                        sabotajci: sabotajciAktif
                    },
                    round: {
                        roundNumber: 1,
                        mode: secilenMod,
                        traveler: null,
                        travelerManual: false,
                        manualTraveler: null,
                        donemId: null,
                        ikinciDonemId: null,
                        sabotajciId: null,
                        sabotajciDonemId: null,
                        zamanSapmasiAktif: false,
                        perPlayerEras: {},
                        status: "yolcu_bekleniyor",
                        timerEndsAt: null,
                        timerRemaining: 120,
                        paused: false,
                        result: null,
                        usedTravelers: []
                    }
                };

                await updateDoc(odaRef, veri);
                yonlendirildi = true;
                window.location.href = "game.html?oda=" + odaKodu;

            } catch (error) {
                console.error("Oyun başlatılırken hata oluştu:", error);
                alert("Oyun başlatılamadı! Hata: " + error.message);
                baslat.disabled = false;
                baslat.textContent = "Oyunu Başlat";
            }
        };
    }
}