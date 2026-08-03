import { db } from "./firebase.js";
import {
    doc,
    onSnapshot,
    updateDoc,
    setDoc,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { donemler } from "./eras.js";

const params = new URLSearchParams(window.location.search);
const odaKodu = params.get("oda");

const playerId = sessionStorage.getItem("playerId");
const benHost = sessionStorage.getItem("isHost") === "true";

document.getElementById("odaKodu").textContent = odaKodu;

const odaRef = doc(db, "rooms", odaKodu);

// Eklenen kartların TÜM odalarda kalıcı olması için tek, paylaşılan bir belgede saklanıyor
// (oda bazlı değil — bir kez eklenen kart bundan sonraki her yeni odada da otomatik çıkar)
const ORTAK_KART_REF = doc(db, "sharedData", "customEras");
let ortakOzelKartlar = [];

const hostLobiBtnContainer = document.getElementById("hostLobiBtnContainer");
if (benHost && hostLobiBtnContainer) {
    hostLobiBtnContainer.innerHTML = `<button id="lobiyeDonBtn">🏠 Lobiye Dön</button>`;
    
    document.getElementById("lobiyeDonBtn").onclick = async () => {
        if (confirm("Odayı tekrar lobiye döndürmek istediğine emin misin? Tüm oyuncular lobiye dönecek.")) {
            try {
                await updateDoc(odaRef, {
                    started: false,
                    status: "lobby",
                    isLobbyMode: true,
                    round: null
                });
                window.location.replace(`lobby.html?oda=${odaKodu}`);
            } catch (err) {
                console.error("Lobiye dönüş hatası:", err);
            }
        }
    };
}

const icerikDiv = document.getElementById("icerik");
const modAdi = document.getElementById("modAdi");

const SURE_SANIYE = 120;
let sonVeri = null;

// Herkesin görebileceği "Tur Geçmişi" butonu (sadece host'a özel değil)
const genelButonlar = document.getElementById("genelButonlar");
if (genelButonlar) {
    genelButonlar.innerHTML = `<button id="gecmisGenelBtn" class="ikincil">📜 Tur Geçmişi</button>`;
    document.getElementById("gecmisGenelBtn").onclick = () => turGecmisiModaliniAc();
}

// Host bir oyuncuyu odadan geçici olarak atar (aynı isimle bu odaya tekrar giremez)
async function oyuncuyuAt(hedefId, hedefIsim) {
    if (!benHost || !sonVeri) return;
    if (!confirm(`${hedefIsim} adlı oyuncuyu odadan atmak istediğine emin misin?`)) return;

    const kalanOyuncular = (sonVeri.players || []).filter((o) => o.id !== hedefId);
    const guncelBanliId = [...(sonVeri.bannedPlayerIds || []), hedefId];
    const guncelBanliIsim = [...(sonVeri.bannedNames || []), hedefIsim.toLowerCase()];

    try {
        await updateDoc(odaRef, {
            players: kalanOyuncular,
            bannedPlayerIds: guncelBanliId,
            bannedNames: guncelBanliIsim
        });
    } catch (err) {
        console.error("Oyuncu atılırken hata oluştu:", err);
    }
}

const TICARET_ESYALARI = [
    "Akıllı Telefon 📱", "Deodorant 🧴", "Kola Şişesi 🥤", 
    "Plastik Çakmak 🔥", "Güneş Gözlüğü 🕶️", "El Feneri 🔦", "Tükenmez Kalem 🖊️"
];

function tumDonemleriGetir() {
    // Eski odalardan kalma oda-bazlı kartlarla (varsa) + artık kalıcı/global kartlarla birleştir
    const odaBazliEski = sonVeri?.customEras || [];
    return [...donemler, ...ortakOzelKartlar, ...odaBazliEski];
}

function donemBul(id) {
    return tumDonemleriGetir().find((d) => d.id === id);
}

function oyuncuBul(veri, id) {
    return (veri.players || []).find((o) => o.id === id);
}

function rastgeleOyuncuSec(veri) {
    const adayHavuzu = (veri.players || []).filter(
        (oyuncu) => !oyuncu.isHost && oyuncu.status !== "waiting" && oyuncu.status !== "spectator"
    );

    let kullanilanlar = veri.round?.usedTravelers || [];
    let adaylar = adayHavuzu.filter(
        (oyuncu) => !kullanilanlar.includes(oyuncu.id)
    );

    if (adaylar.length === 0) adaylar = [...adayHavuzu];
    if (adaylar.length === 0) return null;

    return adaylar[Math.floor(Math.random() * adaylar.length)];
}

function rastgeleEsyalarSec() {
    const kopya = [...TICARET_ESYALARI];
    const secilenler = [];
    for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * kopya.length);
        secilenler.push(kopya.splice(index, 1)[0]);
    }
    return secilenler;
}

// ---------- YAN PANEL VE İZLEYİCİ LİSTESİ ----------
function atmaBtnHTML(p) {
    if (!benHost || p.isHost) return "";
    return `<button class="kick-btn" data-id="${p.id}" data-isim="${p.name}">🚫</button>`;
}

function yanPaneliCiz() {
    const panelDiv = document.getElementById("oyuncuListesiPanel");
    if (!panelDiv || !sonVeri || !sonVeri.players) return;

    const aktifler = sonVeri.players.filter(p => p.status === "active" || (!p.status && !p.isHost));
    const bekleyenler = sonVeri.players.filter(p => p.status === "waiting");
    const izleyiciler = sonVeri.players.filter(p => p.status === "spectator");

    let html = `
        <div class="player-group">
            <span class="group-title">Aktif Oyuncular (${aktifler.length})</span>
            ${aktifler.map(p => `
                <div class="player-card ${p.id === playerId ? 'is-me' : ''}">
                    <span>${p.isHost ? '👑 ' : ''}${p.name}</span>
                    ${atmaBtnHTML(p)}
                </div>
            `).join('')}
        </div>
    `;

    if (bekleyenler.length > 0) {
        html += `
            <div class="player-group" style="margin-top: 15px;">
                <span class="group-title">Bekleyenler (${bekleyenler.length})</span>
                ${bekleyenler.map(p => `
                    <div class="player-card ${p.id === playerId ? 'is-me' : ''}">
                        <span>${p.name}</span>
                        <span class="status-badge status-waiting">Bekliyor</span>
                        ${atmaBtnHTML(p)}
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (izleyiciler.length > 0) {
        html += `
            <div class="player-group" style="margin-top: 15px;">
                <span class="group-title">İzleyiciler (${izleyiciler.length})</span>
                ${izleyiciler.map(p => `
                    <div class="player-card ${p.id === playerId ? 'is-me' : ''}">
                        <span>${p.name}</span>
                        <span class="status-badge status-spectator">İzleyici</span>
                        ${atmaBtnHTML(p)}
                    </div>
                `).join('')}
            </div>
        `;
    }

    const ben = oyuncuBul(sonVeri, playerId);
    if (ben && !ben.isHost) {
        const isSpectator = ben.status === "spectator";
        html += `
            <div style="margin-top: auto; padding-top: 15px;">
                <button id="durumDegisBtn" class="ikincil" style="width: 100%; font-size: 0.85rem; padding: 10px;">
                    ${isSpectator ? "🎮 Oyuncu Ol" : "👀 İzleyici Ol"}
                </button>
            </div>
        `;
    }

    panelDiv.innerHTML = html;

    const durumBtn = document.getElementById("durumDegisBtn");
    if (durumBtn) {
        durumBtn.onclick = statusDegistir;
    }

    if (benHost) {
        panelDiv.querySelectorAll(".kick-btn").forEach((btn) => {
            btn.onclick = (e) => {
                e.stopPropagation();
                oyuncuyuAt(btn.dataset.id, btn.dataset.isim);
            };
        });
    }
}

async function statusDegistir() {
    if (!sonVeri || !sonVeri.players) return;
    const ben = oyuncuBul(sonVeri, playerId);
    if (!ben || ben.isHost) return;

    const yeniStatus = ben.status === "spectator" ? "active" : "spectator";
    
    const guncelOyuncular = sonVeri.players.map(p => {
        if (p.id === playerId) {
            return { ...p, status: yeniStatus };
        }
        return p;
    });

    await updateDoc(odaRef, {
        players: guncelOyuncular
    });
}

// ---------- KART EKLEME VE GEÇMİŞ MODALLERİ ----------

function kartEklemeModaliniAc() {
    const eskiModal = document.getElementById("customModal");
    if (eskiModal) eskiModal.remove();

    const modalHTML = `
        <div class="modal-overlay" id="customModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>➕ Yeni Kart / Dönem Ekle</h3>
                    <button class="modal-close" id="kapatModalBtn">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Dönem / Tema Adı</label>
                        <input type="text" id="yeniDonemAdi" placeholder="Örn: Sınav Haftası Kabusu">
                    </div>
                    <div class="form-group">
                        <label>Anahtar Kelimeler (Virgülle ayırın)</label>
                        <input type="text" id="yeniAnahtar" placeholder="Kopya, Kahve, Stres, Uykusuzluk">
                    </div>
                    <div class="form-group">
                        <label>Örnek Cümleler (Her satıra bir tane)</label>
                        <textarea id="yeniCumleler" placeholder="Hocanın arkası dönüktü.\nKahve makinesi bozuldu."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Yasaklı Kelimeler (Virgülle ayırın)</label>
                        <input type="text" id="yeniYasak" placeholder="Not, Çalışmak, Sınav">
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button id="kartKaydetBtn" style="flex: 1;">💾 Kaydet</button>
                        <button id="iptalModalBtn" class="ikincil" style="flex: 1;">İptal</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const closeModal = () => {
        const m = document.getElementById("customModal");
        if (m) m.remove();
    };

    document.getElementById("kapatModalBtn").onclick = closeModal;
    document.getElementById("iptalModalBtn").onclick = closeModal;
    
    document.getElementById("customModal").onclick = (e) => {
        if (e.target.id === "customModal") closeModal();
    };

    document.getElementById("kartKaydetBtn").onclick = async () => {
        const isim = document.getElementById("yeniDonemAdi").value.trim();
        const anahtar = document.getElementById("yeniAnahtar").value.split(",").map(s => s.trim()).filter(Boolean);
        const cumleler = document.getElementById("yeniCumleler").value.split("\n").map(s => s.trim()).filter(Boolean);
        const yasak = document.getElementById("yeniYasak").value.split(",").map(s => s.trim()).filter(Boolean);

        if (!isim || anahtar.length === 0) {
            alert("Lütfen en az bir dönem adı ve anahtar kelime girin.");
            return;
        }

        const yeniKart = {
            id: "custom_" + Date.now(),
            isim: isim,
            anahtarKelimeler: anahtar,
            ornekCumleler: cumleler,
            yasakliKelimeler: yasak
        };

        try {
            // merge:true + arrayUnion → belge daha önce hiç oluşmamışsa bile güvenle çalışır
            await setDoc(ORTAK_KART_REF, {
                list: arrayUnion(yeniKart)
            }, { merge: true });

            alert("Özel kart başarıyla eklendi! Bu kart artık bundan sonraki TÜM odalarda kalıcı olarak çıkacak.");
            closeModal();
            ekraniCiz();
        } catch (err) {
            console.error("Kart kaydedilemedi:", err);
            alert("Kart kaydedilirken bir hata oluştu, tekrar dener misin?");
        }
    };
}

function turGecmisiModaliniAc() {
    const eskiModal = document.getElementById("historyModal");
    if (eskiModal) eskiModal.remove();

    const gecmis = sonVeri.roundHistory || [];

    const modalHTML = `
        <div class="modal-overlay" id="historyModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📜 Tur Geçmişi (${gecmis.length} Tur)</h3>
                    <button class="modal-close" id="kapatHistoryBtn">✕</button>
                </div>
                <div class="modal-body">
                    ${gecmis.length === 0 ? "<p style='text-align:center; color:#9ca3af;'>Henüz tamamlanan tur yok.</p>" : 
                        gecmis.map(g => `
                            <div class="gecmis-item">
                                <div><span>Tur ${g.roundNumber}</span> - Dönem: <strong>${g.donemAdi}</strong></div>
                                <div>Zaman Yolcusu: <strong>${g.travelerName}</strong></div>
                                <div>Sonuç: ${g.result === "dogru" ? "✅ Başarılı" : (g.result === "tamamlandi" ? "🎬 Tamamlandı" : "❌ Başarısız")}</div>
                            </div>
                        `).join('')}
                    <button id="iptalHistoryBtn" class="ikincil" style="margin-top: 10px; width: 100%;">Kapat</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const closeHistory = () => {
        const m = document.getElementById("historyModal");
        if (m) m.remove();
    };

    document.getElementById("kapatHistoryBtn").onclick = closeHistory;
    document.getElementById("iptalHistoryBtn").onclick = closeHistory;
    document.getElementById("historyModal").onclick = (e) => {
        if (e.target.id === "historyModal") closeHistory();
    };
}

// ---------- FIRESTORE İŞLEMLERİ ----------

async function yolcuyuOtomatikSec(veri) {
    if (!benHost || (veri.round && veri.round.traveler)) return;

    const secilen = rastgeleOyuncuSec(veri);
    if (!secilen) return;

    let updateData = {
        isLobbyMode: false,
        "round.traveler": secilen.id,
        "round.status": "donem_bekleniyor"
    };

    if (veri.settings?.ticaret) {
        updateData["round.travelerItems"] = rastgeleEsyalarSec();
    }

    await updateDoc(odaRef, updateData);
}

async function yolcuyuManuelSec(oyuncuId) {
    let updateData = {
        isLobbyMode: false,
        "round.traveler": oyuncuId,
        "round.travelerManual": true,
        "round.status": "donem_bekleniyor"
    };

    if (sonVeri.settings?.ticaret) {
        updateData["round.travelerItems"] = rastgeleEsyalarSec();
    }

    await updateDoc(odaRef, updateData);
}

async function donemSecVeBaslat(donemId, ikinciDonemId = null) {
    let updateData = {
        isLobbyMode: false,
        "round.donemId": donemId,
        "round.status": "oynaniyor",
        "round.timerEndsAt": Date.now() + SURE_SANIYE * 1000,
        "round.timerRemaining": SURE_SANIYE,
        "round.paused": false
    };

    if (ikinciDonemId) {
        updateData["round.ikinciDonemId"] = ikinciDonemId;
    }

    await updateDoc(odaRef, updateData);
}

async function sabotajciAta(sabotajciId, sabotajciDonemId) {
    await updateDoc(odaRef, {
        isLobbyMode: false,
        "round.sabotajciId": sabotajciId,
        "round.sabotajciDonemId": sabotajciDonemId
    });
}

async function zamanSapmasiTetikle() {
    await updateDoc(odaRef, {
        "round.zamanSapmasiAktif": true
    });
}

async function sayaciDuraklat() {
    const kalan = Math.max(0, Math.round((sonVeri.round.timerEndsAt - Date.now()) / 1000));
    await updateDoc(odaRef, {
        "round.status": "duraklatildi",
        "round.timerRemaining": kalan,
        "round.timerEndsAt": null
    });
}

async function sayaciDevamEttir() {
    await updateDoc(odaRef, {
        "round.status": "oynaniyor",
        "round.timerEndsAt": Date.now() + sonVeri.round.timerRemaining * 1000
    });
}

async function sayaciSifirla() {
    const oynuyor = sonVeri.round.status === "oynaniyor";
    await updateDoc(odaRef, {
        "round.timerRemaining": SURE_SANIYE,
        "round.timerEndsAt": oynuyor ? Date.now() + SURE_SANIYE * 1000 : null
    });
}

async function turuSonuclandir(sonuc) {
    const round = sonVeri.round;
    const travelerObj = oyuncuBul(sonVeri, round.traveler);
    const donemObj = donemBul(round.donemId);

    const yeniGecmisKaydi = {
        roundNumber: round.roundNumber,
        travelerName: travelerObj ? travelerObj.name : "Bilinmiyor",
        donemAdi: donemObj ? donemObj.isim : (sonuc === "tamamlandi" ? "Karışık (Geçmiş Günler Gelecek)" : "Bilinmiyor"),
        result: sonuc
    };

    const mevcutGecmis = sonVeri.roundHistory || [];

    await updateDoc(odaRef, {
        "round.status": "sonuc",
        "round.result": sonuc,
        "round.timerEndsAt": null,
        "roundHistory": [...mevcutGecmis, yeniGecmisKaydi]
    });
}

async function sonrakiTur() {
    const onceki = sonVeri.round.traveler;
    let kullanilanlar = [...(sonVeri.round.usedTravelers || [])];

    if (onceki && !kullanilanlar.includes(onceki)) {
        kullanilanlar.push(onceki);
    }

    const guncelOyuncular = (sonVeri.players || []).map((oyuncu) => ({
        ...oyuncu,
        status: oyuncu.status === "spectator" ? "spectator" : "active"
    }));

    const hostHaricAktifOyuncuSayisi = guncelOyuncular.filter(
        (o) => !o.isHost && o.status !== "spectator"
    ).length;

    if (kullanilanlar.length >= hostHaricAktifOyuncuSayisi) {
        kullanilanlar = [];
    }

    await updateDoc(odaRef, {
        isLobbyMode: false,
        players: guncelOyuncular,
        round: {
            roundNumber: sonVeri.round.roundNumber + 1,
            mode: sonVeri.mode,
            traveler: null,
            travelerManual: false,
            travelerItems: [],
            donemId: null,
            ikinciDonemId: null,
            sabotajciId: null,
            sabotajciDonemId: null,
            zamanSapmasiAktif: false,
            status: "yolcu_bekleniyor",
            timerEndsAt: null,
            timerRemaining: SURE_SANIYE,
            paused: false,
            result: null,
            usedTravelers: kullanilanlar
        }
    });
}

// ---------- EKRAN ÇİZİMİ ----------

function sayaciGuncelle() {
    if (!sonVeri || !sonVeri.round) return;

    const el = document.getElementById("sayacYazi");
    if (!el) return;

    const round = sonVeri.round;
    let kalan = round.timerRemaining ?? SURE_SANIYE;

    if (round.status === "oynaniyor" && round.timerEndsAt) {
        kalan = Math.max(0, Math.round((round.timerEndsAt - Date.now()) / 1000));
    }

    const dk = Math.floor(kalan / 60).toString().padStart(2, "0");
    const sn = (kalan % 60).toString().padStart(2, "0");

    el.textContent = `${dk}:${sn}`;
}

function manuelSecimEkraniniAc() {
    if (!sonVeri) return;

    const aktifAdaylar = (sonVeri.players || []).filter(
        (o) => !o.isHost && o.status !== "waiting" && o.status !== "spectator"
    );

    const html = `
        <p class="tur-bilgisi">Tur ${sonVeri.round.roundNumber}</p>
        <p>🎯 Zaman yolcusunu seç:</p>
        <div class="oyuncu-secim-listesi">
           ${aktifAdaylar.map((o) => {
               const kullanildi = (sonVeri.round.usedTravelers || []).includes(o.id);
               return `
               <button class="oyuncu-sec-btn" data-id="${o.id}" ${kullanildi ? "disabled" : ""}>
               ${kullanildi ? "✅ " : ""}${o.name}
               </button>
               `;
           }).join("")}
        </div>
        <button id="vazgecBtn" class="ikincil">Vazgeç</button>
    `;

    icerikDiv.innerHTML = html;

    document.querySelectorAll(".oyuncu-sec-btn").forEach((btn) => {
        btn.onclick = () => yolcuyuManuelSec(btn.dataset.id);
    });

    document.getElementById("vazgecBtn").onclick = ekraniCiz;
}

function ekraniCiz() {
    if (!sonVeri) return;

    const oyunModu = sonVeri.settings?.mode || sonVeri.mode || "klasik";
    modAdi.textContent = oyunModu.toUpperCase();

    if (!sonVeri.round) {
        icerikDiv.innerHTML = "<p>Round verisi bekleniyor...</p>";
        return;
    }

    const benimVerim = oyuncuBul(sonVeri, playerId);
    
    if (benimVerim && benimVerim.status === "spectator") {
        const secilenOyuncu = oyuncuBul(sonVeri, sonVeri.round.traveler);
        const donem = sonVeri.round.donemId ? donemBul(sonVeri.round.donemId) : null;
        
        icerikDiv.innerHTML = `
            <p class="tur-bilgisi">Tur ${sonVeri.round.roundNumber} - 👁️ İzleyici Modundasın</p>
            <div style="background: rgba(148, 163, 184, 0.1); border: 1px solid rgba(148, 163, 184, 0.3); padding: 20px; border-radius: 12px; margin: 15px 0; text-align: center;">
                <h3>👀 Maçı İzliyorsun</h3>
                <p>Şu an aktif bir oyuncu değilsin. Zaman yolcusu: <strong>${secilenOyuncu ? secilenOyuncu.name : "Seçiliyor..."}</strong></p>
                ${donem ? `<p style="margin-top: 10px; color: #a78bfa;">Gizli Dönem: <strong>${donem.isim}</strong></p>` : ""}
            </div>
            <div class="sayac">
                <div class="sayacBaslik">⏳ Kalan Süre</div>
                <span id="sayacYazi">02:00</span>
            </div>
        `;
        sayaciGuncelle();
        return;
    }

    if (benimVerim && benimVerim.status === "waiting") {
        icerikDiv.innerHTML = `
            <p class="tur-bilgisi">Tur ${sonVeri.round.roundNumber} (Devam Ediyor)</p>
            <div style="background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                <h3>⏳ Tur Devam Ediyor</h3>
                <p>Oyuna tur başladıktan sonra katıldınız. Sonraki turda aktif olacaksınız!</p>
            </div>
        `;
        return;
    }

    const round = sonVeri.round;
    const yolcuMu = round.traveler === playerId;
    const secilenOyuncu = oyuncuBul(sonVeri, round.traveler);
    const donem = round.donemId ? donemBul(round.donemId) : null;
    const ikinciDonem = round.ikinciDonemId ? donemBul(round.ikinciDonemId) : null;

    let html = `<p class="tur-bilgisi">Tur ${round.roundNumber} - Mod: ${oyunModu.toUpperCase()}</p>`;

    if (round.status === "yolcu_bekleniyor") {
        const hostHaricAktifVarMi = (sonVeri.players || []).some(o => !o.isHost && o.status !== "waiting" && o.status !== "spectator");
        if (!hostHaricAktifVarMi) {
            html += benHost ? `<p>⚠️ Odada aktif oyuncu yok (İzleyiciler hariç).</p>` : `<p>⏳ Zaman yolcusu seçiliyor...</p>`;
            icerikDiv.innerHTML = html;
            return;
        }
        html += `<p>⏳ Zaman yolcusu seçiliyor...</p>`;
        icerikDiv.innerHTML = html;
        if (benHost && !round.traveler) yolcuyuOtomatikSec(sonVeri);
        return;
    }

    if (round.status === "donem_bekleniyor") {
        if (yolcuMu) {
            let ticaretHtml = "";
            if (sonVeri.settings?.ticaret && round.travelerItems) {
                ticaretHtml = `
                    <div style="margin-top: 10px; background: rgba(59, 130, 246, 0.2); padding: 10px; border-radius: 8px;">
                        <p>🎒 Yanında getirdiğin 3 Eşya:</p>
                        <ul>${round.travelerItems.map(e => `<li>${e}</li>`).join("")}</ul>
                    </div>
                `;
            }

            html += `<div class="rol-karti yolcu">
                        🕰️ Sen Zaman Yolcususun!
                        <p>Yönetici evren/dönem seçiyor...</p>
                        ${ticaretHtml}
                     </div>`;
        } else {
            html += `<div class="bilgilendirme">
                <h2>🕰️ ${secilenOyuncu ? secilenOyuncu.name : "Bir oyuncu"} zaman yolcusu seçildi.</h2>
                <p>Yönetici dönem veya evren seçiyor...</p>
            </div>`;
        }

        if (benHost) {
            let tumSecenekler = tumDonemleriGetir().sort((a, b) => a.isim.localeCompare(b.isim, "tr"));
            let donemSecimHTML = `
                <label for="donemSecici">🌍 ${oyunModu === "kirik_zaman" ? "1. Evren / Dönem" : "Dönem / Evren"}</label>
                <select id="donemSecici">
                    <option value="">-- Seçiniz --</option>
                    ${tumSecenekler.map(d => `<option value="${d.id}">${d.isim}</option>`).join("")}
                </select>
            `;

            if (oyunModu === "kirik_zaman") {
                donemSecimHTML += `
                    <label for="ikinciDonemSecici" style="margin-top:10px;">🌍 2. Evren / Dönem (Kırık Zaman)</label>
                    <select id="ikinciDonemSecici">
                        <option value="">-- İkinciyi Seçiniz --</option>
                        ${tumSecenekler.map(d => `<option value="${d.id}">${d.isim}</option>`).join("")}
                    </select>
                `;
            }

            let sabotajciHTML = "";
            if (sonVeri.settings?.sabotajci) {
                const digerOyuncular = (sonVeri.players || []).filter(o => !o.isHost && o.id !== round.traveler && o.status !== "spectator");
                sabotajciHTML = `
                    <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0;">
                    <label>🕵️ Gizli Sabotajcı Seç:</label>
                    <select id="sabotajciSecici">
                        <option value="">-- Sabotajcı Yok --</option>
                        ${digerOyuncular.map(o => `<option value="${o.id}">${o.name}</option>`).join("")}
                    </select>
                    <label style="margin-top:5px;">🕵️ Sabotajcının Gizli Dönemi:</label>
                    <select id="sabotajciDonemSecici">
                        <option value="">-- Farklı Dönem Seç --</option>
                        ${tumSecenekler.map(d => `<option value="${d.id}">${d.isim}</option>`).join("")}
                    </select>
                `;
            }

            html += `<div class="host-panel">
                        ${oyunModu === "gecmis_gelecek" ? `<p style="font-size:0.8rem; color:#cbd5e1; margin-bottom:8px;">🔮 Bu modda seçtiğin dönem yolcuya DEĞİL, diğer oyunculara verilir — onlar sanki o dönemden bugüne gelmiş gibi davranır, yolcu da onların hangi dönemden geldiğini tahmin etmeye çalışır.</p>` : ""}
                        ${donemSecimHTML}
                        ${sabotajciHTML}
                        <div class="hostButonlar" style="margin-top:10px;">
                            <button id="turuBaslatBtn">▶️ Turu Başlat</button>
                            <button id="manuelSecBtn" class="ikincil">🎯 Yolcuyu Manuel Seç</button>
                        </div>
                        <div class="hostButonlar" style="margin-top:5px;">
                            <button id="kartEkleHostBtn" class="ikincil">➕ Yeni Kart Ekle</button>
                            <button id="gecmisHostBtn" class="ikincil">📜 Tur Geçmişi</button>
                        </div>
                    </div>`;
        }

        icerikDiv.innerHTML = html;

        if (benHost) {
            document.getElementById("turuBaslatBtn").onclick = () => {
                const secilen = document.getElementById("donemSecici").value;
                if (!secilen) {
                    alert("Lütfen en az bir dönem seç.");
                    return;
                }

                let ikinciSecilen = null;
                if (oyunModu === "kirik_zaman") {
                    ikinciSecilen = document.getElementById("ikinciDonemSecici").value;
                    if (!ikinciSecilen) {
                        alert("Kırık Zaman modu için ikinci dönemi de seçmelisin.");
                        return;
                    }
                }

                if (sonVeri.settings?.sabotajci) {
                    const sabId = document.getElementById("sabotajciSecici").value;
                    const sabDonemId = document.getElementById("sabotajciDonemSecici").value;
                    if (sabId && sabDonemId) {
                        sabotajciAta(sabId, sabDonemId);
                    }
                }

                donemSecVeBaslat(secilen, ikinciSecilen);
            };

            document.getElementById("manuelSecBtn").onclick = manuelSecimEkraniniAc;
            document.getElementById("kartEkleHostBtn").onclick = kartEklemeModaliniAc;
            document.getElementById("gecmisHostBtn").onclick = turGecmisiModaliniAc;
        }
        return;
    }

    if (round.status === "oynaniyor" || round.status === "duraklatildi" || round.status === "sonuc") {
        if (yolcuMu) {
            let ticaretHtml = "";
            if (sonVeri.settings?.ticaret && round.travelerItems) {
                ticaretHtml = `
                    <div style="margin-top: 10px; background: rgba(59, 130, 246, 0.2); padding: 10px; border-radius: 8px;">
                        <p>🎒 Yanındaki Eşyalar:</p>
                        <ul>${round.travelerItems.map(e => `<li>${e}</li>`).join("")}</ul>
                    </div>
                `;
            }

            if (oyunModu === "gecmis_gelecek") {
                html += `<div class="rol-karti yolcu">
                            <h2>🕰️ Bugünün İnsanısın!</h2>
                            <p>Günlük/modern hayatından sıradan şeyler anlat (dün ne yaptın, ne yiyorsun,
                            telefonunla ne yapıyorsun vs). Diğer herkes SENİN çağına, kendi (sana bilinmeyen)
                            döneminden gelmiş gibi davranıyor — onların tepkilerinden hangi dönemden geldiklerini
                            tahmin etmeye çalış!</p>
                            ${ticaretHtml}
                         </div>`;
            } else {
                html += `<div class="rol-karti yolcu">
                            <h2>🕰️ Sen Zaman Yolcususun!</h2>
                            <p>Nerede/ne zaman olduğunu tahmin etmeye çalış.</p>
                            ${ticaretHtml}
                         </div>`;
            }
        } else {
            let sabotajciBilgi = "";
            if (round.sabotajciId === playerId) {
                const sabDonem = donemBul(round.sabotajciDonemId);
                sabotajciBilgi = `
                    <div style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h3>🕵️ Gizli Rolün: Sabotajcı!</h3>
                        <p>Senin gizli dönemin: <strong>${sabDonem ? sabDonem.isim : "Bilinmiyor"}</strong>. Çaktırmadan bu döneme göre davran!</p>
                    </div>
                `;
            }

            let donemBaslik = donem ? donem.isim : "Bilinmiyor";
            if (ikinciDonem) {
                donemBaslik += ` + ${ikinciDonem.isim} (Kırık Zaman)`;
            }

            const gecmisGelecekBilgilendirme = oyunModu === "gecmis_gelecek" ? `
                <div class="bilgilendirme" style="margin-bottom: 12px;">
                    <p>🔮 Sen bu dönemden/evrenden gelip yolcunun (bugünün) çağına düşmüş gibisin.
                    Yolcunun anlattığı modern şeylere bu döneme uygun tepkiler ver — ama dönemin ismini
                    asla direkt söyleme, yolcu tahmin etsin.</p>
                </div>
            ` : "";

            html += `
            ${sabotajciBilgi}
            ${gecmisGelecekBilgilendirme}
            <div class="bilgi-karti">
                <h2>📜 ${donemBaslik}</h2>
                ${donem ? `
                <div class="kartBolum">
                    <h3>${ikinciDonem ? "1️⃣ " : ""}🔑 Anahtar Kelimeler${ikinciDonem ? ` (${donem.isim})` : ""}</h3>
                    <div class="etiketler">${donem.anahtarKelimeler.map((k) => `<span class="etiket">${k}</span>`).join("")}</div>
                </div>
                <div class="kartBolum">
                    <h3>💬 Örnek Cümleler${ikinciDonem ? ` (${donem.isim})` : ""}</h3>
                    <ul>${donem.ornekCumleler.map((c) => `<li>${c}</li>`).join("")}</ul>
                </div>
                <div class="kartBolum">
                    <h3>🚫 Yasaklı Kelimeler${ikinciDonem ? ` (${donem.isim})` : ""}</h3>
                    <div class="yasakKutusu">${donem.yasakliKelimeler.map((k) => `<span class="yasakEtiket">${k}</span>`).join("")}</div>
                </div>` : ""}
                ${ikinciDonem ? `
                <hr style="border-color: rgba(255,255,255,0.1); margin: 16px 0;">
                <div class="kartBolum">
                    <h3>2️⃣ 🔑 Anahtar Kelimeler (${ikinciDonem.isim})</h3>
                    <div class="etiketler">${ikinciDonem.anahtarKelimeler.map((k) => `<span class="etiket">${k}</span>`).join("")}</div>
                </div>
                <div class="kartBolum">
                    <h3>💬 Örnek Cümleler (${ikinciDonem.isim})</h3>
                    <ul>${ikinciDonem.ornekCumleler.map((c) => `<li>${c}</li>`).join("")}</ul>
                </div>
                <div class="kartBolum">
                    <h3>🚫 Yasaklı Kelimeler (${ikinciDonem.isim})</h3>
                    <div class="yasakKutusu">${ikinciDonem.yasakliKelimeler.map((k) => `<span class="yasakEtiket">${k}</span>`).join("")}</div>
                </div>` : ""}
            </div>`;
        }

        if (round.zamanSapmasiAktif) {
            html += `
            <div style="background: rgba(220, 38, 38, 0.25); border: 2px dashed #ef4444; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
                <h2 style="color: #fca5a5;">⚠️ MAKİNE HATA VERDİ! (ZAMAN SAPMASI)</h2>
                <p>Rollerin akışı aniden değişti!</p>
            </div>`;
        }

        html += `
        <div class="sayac ${round.status === "duraklatildi" ? "duraklatildi" : ""}">
            <div class="sayacBaslik">⏳ Kalan Süre</div>
            <span id="sayacYazi">02:00</span>
        </div>`;

        if (round.status === "sonuc") {
            const sonucEmoji = round.result === "dogru" ? "🎉" : (round.result === "tamamlandi" ? "🎬" : "💀");
            const sonucYazi = round.result === "dogru"
                ? "✅ Doğru tahmin edildi!"
                : (round.result === "tamamlandi" ? "🎬 Tur tamamlandı!" : "❌ Yanlış tahmin edildi.");

            let sabotajciSonuc = "";
            if (sonVeri.settings?.sabotajci && round.sabotajciId) {
                const sabKisi = oyuncuBul(sonVeri, round.sabotajciId);
                const sabDonem = donemBul(round.sabotajciDonemId);
                sabotajciSonuc = `<p>🕵️ Gizli Sabotajcı: <strong>${sabKisi ? sabKisi.name : "-"}</strong> (Rolü: ${sabDonem ? sabDonem.isim : "-"})</p>`;
            }

            html += `
            <div class="sonucKutusu">
                <h2>${sonucEmoji}</h2>
                <p class="sonuc-yazisi">${sonucYazi}</p>
                ${sabotajciSonuc}
            </div>`;

            if (benHost) {
                html += `
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button id="sonrakiTurBtn">➡️ Sonraki Tur</button>
                        <button id="gecmisHostBtn2" class="ikincil">📜 Geçmiş</button>
                    </div>
                `;
            } else {
                html += `<p>⏳ Yöneticinin sonraki turu başlatması bekleniyor...</p>`;
            }
        } else if (benHost) {
            html += `<div class="host-panel">`;

            if (round.status === "oynaniyor") {
                html += `<button id="duraklatBtn">⏸️ Duraklat</button>`;
            } else {
                html += `<button id="devamBtn">▶️ Devam Et</button>`;
            }

            html += `<button id="sifirlaBtn" class="ikincil">🔄 Süreyi Sıfırla</button>`;

            if (oyunModu === "zaman_sapmasi" && !round.zamanSapmasiAktif) {
                html += `<button id="hataVerBtn" style="background: #dc2626;">🚨 Makine Hata Verdi (Sapma)</button>`;
            }

            html += `<hr>`;
            html += `<button id="dogruBtn">✅ Doğru Tahmin Edildi</button>`;
            html += `<button id="yanlisBtn">❌ Yanlış / Tahmin Edilemedi</button>`;

            html += `<div style="display: flex; gap: 10px; margin-top: 5px;">
                        <button id="kartEkleHostBtn" class="ikincil">➕ Kart Ekle</button>
                        <button id="gecmisHostBtn" class="ikincil">📜 Tur Geçmişi</button>
                     </div>`;
            html += `</div>`;
        } else {
            html += `<p>⏳ Yöneticinin turu yönetmesi bekleniyor...</p>`;
        }

        icerikDiv.innerHTML = html;
        sayaciGuncelle();

        if (benHost) {
            const duraklatBtn = document.getElementById("duraklatBtn");
            if (duraklatBtn) duraklatBtn.onclick = sayaciDuraklat;

            const devamBtn = document.getElementById("devamBtn");
            if (devamBtn) devamBtn.onclick = sayaciDevamEttir;

            const sifirlaBtn = document.getElementById("sifirlaBtn");
            if (sifirlaBtn) sifirlaBtn.onclick = sayaciSifirla;

            const hataVerBtn = document.getElementById("hataVerBtn");
            if (hataVerBtn) hataVerBtn.onclick = zamanSapmasiTetikle;

            const dogruBtn = document.getElementById("dogruBtn");
            if (dogruBtn) dogruBtn.onclick = () => turuSonuclandir("dogru");

            const yanlisBtn = document.getElementById("yanlisBtn");
            if (yanlisBtn) yanlisBtn.onclick = () => turuSonuclandir("yanlis");

            const sonrakiTurBtn = document.getElementById("sonrakiTurBtn");
            if (sonrakiTurBtn) sonrakiTurBtn.onclick = sonrakiTur;

            const kartEkleBtn = document.getElementById("kartEkleHostBtn");
            if (kartEkleBtn) kartEkleBtn.onclick = kartEklemeModaliniAc;

            const gecmisBtn = document.getElementById("gecmisHostBtn") || document.getElementById("gecmisHostBtn2");
            if (gecmisBtn) gecmisBtn.onclick = turGecmisiModaliniAc;
        }
    }
}

// ---------- DİNLEYİCİLER ----------

// Paylaşılan/global kartları canlı takip et — biri kart eklediğinde herkes anında görsün
onSnapshot(ORTAK_KART_REF, (snapshot) => {
    ortakOzelKartlar = snapshot.exists() ? (snapshot.data().list || []) : [];
    if (sonVeri) {
        ekraniCiz();
    }
});

let sonEkranImzasi = null;

onSnapshot(odaRef, (snapshot) => {
    if (!snapshot.exists()) {
        icerikDiv.innerHTML = "<p>Oda bulunamadı.</p>";
        return;
    }

    const veri = snapshot.data();

    // Ben (host olmayan biri) atıldıysam burada dur, oyun ekranına devam etme
    if (!benHost && (veri.bannedPlayerIds || []).includes(playerId)) {
        sessionStorage.removeItem("isHost");
        sessionStorage.removeItem("playerId");
        sessionStorage.removeItem("playerName");

        icerikDiv.innerHTML = `
            <div style="text-align:center;">
                <h2>🚫 Odadan Çıkarıldın</h2>
                <p>Yönetici seni bu odadan çıkardı.</p>
                <button onclick="window.location.href='index.html'" style="margin-top:15px;">🏠 Ana Sayfaya Dön</button>
            </div>
        `;
        return;
    }

    // Sadece oda gerçek anlamda lobi modundaysa güvenli bir şekilde lobiye at
    if (veri.status === "lobby") {
        window.location.replace(`lobby.html?oda=${odaKodu}`);
        return;
    }

    sonVeri = veri;

    // Kenar çubuğu (bağlantı noktaları dahil) her snapshot'ta güncellenir —
    // bu kısım kalp atışı yüzünden sık tetiklense de sorun yaratmaz.
    yanPaneliCiz();

    // Ana ekran (dönem/sabotajcı seçim kutuları dahil) SADECE round/mod/ayarlar
    // gerçekten değiştiğinde yeniden çizilir. Aksi halde kalp atışı her birkaç
    // saniyede bir host'un henüz kaydetmediği <select> seçimlerini sıfırlıyordu.
    const yeniImza = JSON.stringify({ round: veri.round, mode: veri.mode, settings: veri.settings });
    if (yeniImza !== sonEkranImzasi) {
        sonEkranImzasi = yeniImza;
        ekraniCiz();
    }
});

setInterval(sayaciGuncelle, 250);