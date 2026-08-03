// Zaman Makinesi - Donem ve Evren bilgi kartlari verisi
// Her kayit: id, isim, anahtarKelimeler, ornekCumleler, yasakliKelimeler
export const donemler = [
    {
        id: "tas-devri",
        isim: "TAŞ DEVRİ",
        anahtarKelimeler: ["Ateş", "Av", "Kabile", "Kemik", "Barınak"],
        ornekCumleler: ["Bugün yiyecek bulmazsak zorlanacağız.", "Herkes gün batmadan geri dönsün.", "Ateşi canlı tutun."],
        yasakliKelimeler: ["Mamut", "Mağara"]
    },
    {
        id: "antik-misir",
        isim: "ANTİK MISIR",
        anahtarKelimeler: ["Çöl", "Hasat", "Tapınak", "Rahip", "Nehir"],
        ornekCumleler: ["Bu yıl su erken yükseldi.", "Tanrılar bizi korusun.", "Kuraklık geliyor."],
        yasakliKelimeler: ["Firavun", "Piramit", "Mumya"]
    },
    {
        id: "antik-yunan",
        isim: "ANTİK YUNAN",
        anahtarKelimeler: ["Meydan", "Bilgelik", "Tapınak", "Yarış", "Tartışma", "Filozof"],
        ornekCumleler: ["Bunu uzun uzun konuşmalıyız.", "Kazanan büyük saygı görecek.", "Oha gördün mü karşısına aslan getirdiler.", "Tanrılar bizi izliyor."],
        yasakliKelimeler: ["Zeus", "Olimpos", "Gladyatör", "Sparta"]
    },
    {
        id: "viking-cagi",
        isim: "VİKİNG ÇAĞI",
        anahtarKelimeler: ["Deniz", "Ahşap", "Balta", "Yolculuk", "Ganimet"],
        ornekCumleler: ["Rüzgar bugün lehimize.", "Silahını yanında tut.", "Şerefli bir ölüm için savaşa gidiyorum.", "Herkes gemiye binsin."],
        yasakliKelimeler: ["Odin", "Valhalla", "Korsan"]
    },
    {
        id: "orta-cag-avrupasi",
        isim: "ORTA ÇAĞ AVRUPASI",
        anahtarKelimeler: ["Surlar", "Taht", "Soylu", "Köy", "Zırh"],
        ornekCumleler: ["Kapılar gün batınca kapanacak.", "Biz de bir an önce cennetten arsa almalıyız.", "Tanrı bizi korusun.", "Aforoz edildiğini duydum."],
        yasakliKelimeler: ["Şövalye", "Kral", "Orta çağ"]
    },
    {
        id: "hacli-seferleri",
        isim: "HAÇLI SEFERLERİ",
        anahtarKelimeler: ["Yolculuk", "Kuşatma", "Inanç", "Aslan yürekli Richard", "Selahaddin Eyyubi"],
        ornekCumleler: ["Kudüs'ü kurtarın günahlarınız silinsin.", "Doğu'nun zenginliği elçilerin anlattığından da fazlaymış.", "Her yeri yağmalıyorlar kaçın!"],
        yasakliKelimeler: ["Papa", "Haçlı"]
    },
    {
        id: "istanbul-un-fethi",
        isim: "İSTANBUL'UN FETHİ",
        anahtarKelimeler: ["Kuşatma", "Surlar", "Nöbet", "Ordu", "Gülle"],
        ornekCumleler: ["Bu duvarlar düşündüğümüzden sağlam.", "Kapılar daha ne kadar dayanır, bilemiyorum.", "Gece sessiz olalım."],
        yasakliKelimeler: ["Fatih", "1453", "Gemileri karadan yürütmek"]
    },
    {
        id: "cografi-kesifler",
        isim: "COĞRAFİ KEŞİFLER",
        anahtarKelimeler: ["Harita", "Pusula", "Rota", "Ümit burnu", "Ufuk"],
        ornekCumleler: ["Bu yolu daha önce kimse kullanmamış.", "Ufukta kara göründü.", "Rüzgar yön değiştirdi.", "Yeni bir kıta bulduk."],
        yasakliKelimeler: ["Amerika", "Kristof kolomb"]
    },
    {
        id: "ronesans",
        isim: "RÖNESANS",
        anahtarKelimeler: ["Resim", "Heykel", "Fikir", "Sanat", "Deney"],
        ornekCumleler: ["Yeni bir yöntem buldum.", "Kral tavana resim yapmamı istedi.", "Sabit dur heykelini yapıyorum"],
        yasakliKelimeler: ["Leonardo da Vinci", "Mona lisa", "Reform"]
    },
    {
        id: "fransiz-ihtilali",
        isim: "FRANSIZ İHTİLALİ",
        anahtarKelimeler: ["Pasta-ekmek", "Eşitlik", "Hümanizm", "Değişim", "Darbe"],
        ornekCumleler: ["Herkes meydanda toplansın.", "Halk açlıktan kırılıyor, kraliyet ailesi ziyafet veriyor!", "Insanlar oldukça öfkeli.", "Yeni kurallar istiyoruz."],
        yasakliKelimeler: ["Giyotin", "Fransa"]
    },
    {
        id: "sanayi-devrimi",
        isim: "SANAYİ DEVRİMİ",
        anahtarKelimeler: ["Fabrika", "Buhar", "Işçi", "Üretim", "Duman"],
        ornekCumleler: ["Bugün yine çok çalışacağız.", "Makineyi durdurun.", "Üretim hızlandı.", "Haklarımızı koruyacak bir topluluk olmalı."],
        yasakliKelimeler: ["Sanayi", "Tren", "Ingiltere"]
    },
    {
        id: "vahsi-bati",
        isim: "VAHŞİ BATI",
        anahtarKelimeler: ["Kasaba", "At", "Han", "Düello", "Şerif"],
        ornekCumleler: ["Bugün kasaba çok sessiz.", "Atını iyi bağla.", "Akşam handa buluşalım.", "Burada herkes birbirini tanır."],
        yasakliKelimeler: ["Kovboy", "Western", "Amerika"]
    },
    {
        id: "kurtulus-savasi",
        isim: "KURTULUŞ SAVAŞI",
        anahtarKelimeler: ["Direniş", "Cephe", "Millet", "Bağımsızlık", "Mücadele"],
        ornekCumleler: ["Henüz pes etmedik.", "Geldikleri gibi giderler. (AUUUUUUUU)", "Ya istiklal ya ölüm!", "15 yaşında cepheye geldim, vatana can feda."],
        yasakliKelimeler: ["Atatürk", "Sakarya"]
    },
    {
        id: "birinci-dunya-savasi",
        isim: "BİRİNCİ DÜNYA SAVAŞI",
        anahtarKelimeler: ["Siper", "Cephe", "Topçu", "Itilaf/ittifak"],
        ornekCumleler: ["Arşidük vurulmuş, ortalık karışacak.", "Boğazları kapatın.", "Dört imparatorluk birden çöktü."],
        yasakliKelimeler: ["1914", "Çanakkale savaşı", "Osmanlı"]
    },
    {
        id: "ikinci-dunya-savasi",
        isim: "İKİNCİ DÜNYA SAVAŞI",
        anahtarKelimeler: ["Alarm", "Sığınak", "Bombardıman", "Müttefik", "Cephe"],
        ornekCumleler: ["Sirenleri duydunuz mu?", "O havadaki şey ne?", "Türkiye tarafsız kalmış."],
        yasakliKelimeler: ["Hitler", "Nazi", "Japonya", "Atom bombası", "Sabun"]
    },
    {
        id: "soguk-savas",
        isim: "SOĞUK SAVAŞ",
        anahtarKelimeler: ["Casus", "Füze", "Sığınak", "Şüphe", "Tehdit"],
        ornekCumleler: ["Kimseye fazla güvenme.", "Dışarıdaki hareketlilik normal değil.", "Planlarımız gizli kalmalı.", "Iki süper güç, sıfır temas."],
        yasakliKelimeler: ["SSCB", "ABD", "Berlin duvarı", "Demir perde", "Komünizm", "Kapitalizm"]
    },
    {
        id: "korsanlar-cagi",
        isim: "KORSANLAR ÇAĞI",
        anahtarKelimeler: ["Mürettebat", "Hazine", "Liman", "Harita", "Okyanus"],
        ornekCumleler: ["Rotayı değiştir.", "Ganimeti paylaşmayacağız.", "Haritayı dikkatli saklayın.", "Liman güvenli görünmüyor."],
        yasakliKelimeler: ["Siyah inci", "Jack sparrow", "One piece"]
    },
    {
        id: "feodal-japonya",
        isim: "FEODAL JAPONYA",
        anahtarKelimeler: ["Onur", "Efendi", "Klan", "Bahçe", "Kılıç"],
        ornekCumleler: ["Sözümü tutmak zorundayım.", "Klan sancakları açıldı.", "Katanaları serbest bırakın.", "Okçular çatılara çıksın.", "Gölgelerden yaklaşın.", "Imparator sadece bir kukla."],
        yasakliKelimeler: ["Samuray", "Ninja", "Şogun"]
    },
    {
        id: "antik-cin",
        isim: "ANTİK ÇİN",
        anahtarKelimeler: ["Hanedan", "Bilgelik", "Imparatorluk", "Bahçe", "Çay"],
        ornekCumleler: ["Sabır en büyük erdemdir.", "Yasak şehirde hareketlilik var.", "Imparator, göğün oğludur.", "Sarayda entrika dönüyor.", "Terrakotta ordusu hazır.", "Konfüçyus un öğretisine kulak ver."],
        yasakliKelimeler: ["Çin seddi", "Ejderha"]
    },
    {
        id: "maya-aztek-uygarligi",
        isim: "MAYA-AZTEK UYGARLIĞI",
        anahtarKelimeler: ["Takvim", "Tapınak", "Adak", "Tören", "Mısır"],
        ornekCumleler: ["Tanrıları memnun etmeliyiz.", "Güneş kan istiyor.", "Obsidyen bıçakları bileyin.", "Yabancılar kıyıya yaklaşıyor (ispanyol istilası).", "Yıldızlar hizalandı, kehanet doğru."],
        yasakliKelimeler: ["Kakao", "Insan kurban"]
    },
    {
        id: "harry-potter",
        isim: "HARRY POTTER",
        anahtarKelimeler: ["Asa", "Iksir", "Ders", "Baykuş", "Yasak orman"],
        ornekCumleler: ["Mektubum sonunda geldi.", "Hey! Bizim binamızda ne işin var?", "Bu karışımı dikkatle hazırla.", "Merlin aşkına, bu da ne?"],
        yasakliKelimeler: ["Hogwarts", "Voldemort", "Severus snape", "Bina isimleri", "Bilindik karakter isimleri"]
    },
    {
        id: "star-wars",
        isim: "STAR WARS",
        anahtarKelimeler: ["Galaksi", "Isyan", "Görev", "Pilot", "Imparatorluk"],
        ornekCumleler: ["Yeni bir umut olabilir.", "Güç seninle olsun.", "TIE savaşçıları geliyor!", "Asilere yardım et.", "Droidi güvenceye al."],
        yasakliKelimeler: ["Jedi", "Darth vader", "Işın kılıcı", "Yoda", "Anakin skywalker"]
    },
    {
        id: "marvel",
        isim: "MARVEL",
        anahtarKelimeler: ["Takım", "Güç", "Tehdit", "Şehir", "Görev"],
        ornekCumleler: ["Şehir yine tehlikede.", "Multiverse kırılıyor.", "Vibranyum sevkiyatını durdurun.", "Wakanda sonsuza dek!"],
        yasakliKelimeler: ["Shield", "Thanos", "Avengers/yenilmezler", "Kahraman isimleri"]
    },
    {
        id: "dc-evreni",
        isim: "DC EVRENİ",
        anahtarKelimeler: ["Adalet", "Kahraman", "Şehir", "Suç", "Maske"],
        ornekCumleler: ["Metropolis tehlikede.", "Arkham da isyan var.", "Korku gazı yayılıyor.", "Atlantis savaşa hazır."],
        yasakliKelimeler: ["Adalet birliği", "Joker", "Batman", "Superman"]
    },
    {
        id: "yuzuklerin-efendisi",
        isim: "YÜZÜKLERİN EFENDİSİ",
        anahtarKelimeler: ["Yolculuk", "Orman", "Kardeşlik", "Dağ", "Görev"],
        ornekCumleler: ["Nazgul yaklaşıyor.", "Göz bizi izliyor.", "Miğfer dibi kuşatıldı.", "Ak ağaç çiçek açtı."],
        yasakliKelimeler: ["Gondor", "Frodo", "Yüzük", "Mordor", "Gollum", "Kıymetlimiz"]
    },
    {
        id: "hobbit",
        isim: "HOBBİT",
        anahtarKelimeler: ["Hazine", "Han", "Cüce", "5 ordu", "Dağ"],
        ornekCumleler: ["Gloin baltasını biledi.", "Troller taş kesildi.", "Warglar izimizi buldu.", "Arken taşı kayıp.", "Smaug uyandı."],
        yasakliKelimeler: ["Bilbo", "Ejderha", "Hobbit"]
    },
    {
        id: "game-of-thrones",
        isim: "GAME OF THRONES",
        anahtarKelimeler: ["Taht", "Hanedan", "Kuzey", "Sadakat", "Kale"],
        ornekCumleler: ["Kış yaklaşıyor.", "Borçlar her zaman ödenir.", "Duvar da nöbet başladı.", "Ateş ve kan!"],
        yasakliKelimeler: ["Stark", "Lannister", "Demir taht", "Khaalesi", "Ejderha"]
    },
    {
        id: "the-walking-dead",
        isim: "THE WALKING DEAD",
        anahtarKelimeler: ["Kamp", "Erzak", "Sessizlik", "Isırık", "Nöbet"],
        ornekCumleler: ["Sesini biraz alçalt.", "Kapıları iyice kapatın.", "Kimse tek başına dışarı çıkmasın.", "Yaşayanlar daha tehlikeli.", "Biz hayatta kalanlarız."],
        yasakliKelimeler: ["Zombi", "Walker", "Rick"]
    },
    {
        id: "jurassic-park",
        isim: "JURASSIC PARK",
        anahtarKelimeler: ["Çit", "Laboratuvar", "Ada", "İz", "Araştırma"],
        ornekCumleler: ["Bu ayak izleri hiç normal değil.", "Çitlerde elektrik yok.", "Kımıldama, gözleri harekete duyarlı.", "Doğa bir yolunu bulur.", "Raptorlar kapıyı açabiliyor."],
        yasakliKelimeler: ["T-rex", "Dinozor"]
    },
    {
        id: "avatar-pandora-dunyasi",
        isim: "AVATAR (PANDORA DÜNYASI)",
        anahtarKelimeler: ["Orman", "Kabile", "Ruh", "Bağ", "Doğa"],
        ornekCumleler: ["Doğa bizimle konuşuyor.", "Burada her canlının yeri var.", "Birbirimize bağlanmalıyız.", "Eywa bizi duydu.", "Kutsal ağacı koruyun."],
        yasakliKelimeler: ["Pandora", "Na'vi", "Mavi ten"]
    },
    {
        id: "matrix",
        isim: "MATRIX",
        anahtarKelimeler: ["Kod", "Gerçeklik", "Seçim", "Sistem", "Uyanış"],
        ornekCumleler: ["Gördüğün her şeye inanma.", "Kırmızı hapı seç.", "Ajanlar geliyor, sisteme sızdılar.", "Yeşil kodları takip et.", "Seçilmiş kişi sensin."],
        yasakliKelimeler: ["Neo", "Kahin", "Morpheus", "Trinity"]
    },
    {
        id: "karayip-korsanlari",
        isim: "KARAYİP KORSANLARI",
        anahtarKelimeler: ["Mürettebat", "Liman", "Pusula", "Lanet", "Rum"],
        ornekCumleler: ["Yelkenleri fora edin.", "Ay ışığında kemiklerimiz görünüyor.", "Ölü adamlar masal anlatmaz.", "Parlay kuralları geçerli.", "Rumu kim bitirdi?"],
        yasakliKelimeler: ["Davy jones", "Jack sparrow", "Siyah inci", "Karayip"]
    },
    {
        id: "aclik-oyunlari",
        isim: "AÇLIK OYUNLARI",
        anahtarKelimeler: ["Arena", "Ittifak", "Sponsor", "Hayatta kalmak", "Eğitim"],
        ornekCumleler: ["Top patladı, biri elendi.", "Isyan ateşi parladı.", "Umut, korkudan güçlüdür."],
        yasakliKelimeler: ["Mıntıka", "Alaycı kuş", "Katniss", "Panem"]
    },
    {
        id: "squid-game",
        isim: "SQUID GAME",
        anahtarKelimeler: ["Numara", "Oyun", "Süre", "Ödül", "Kural"],
        ornekCumleler: ["Elendiniz.", "Gözetleme kuleleri aktif.", "Domuz kumbara doluyor.", "Kartı çevir, oyuna gir.", "VIP'ler adaya ulaştı."],
        yasakliKelimeler: ["Kırmızı ışık yeşil ışık", "Şeker", "456"]
    },
    {
        id: "minecraft",
        isim: "MINECRAFT",
        anahtarKelimeler: ["Blok", "Kazma", "Fırın", "Gece", "Kaynak"],
        ornekCumleler: ["Yeni bir barınak yapabiliriz.", "Aşağına doğru kazma!", "Açlıktan ölmek üzereyim.", "Karanlık çöküyor, yatağı koy.", "Sandıklar dolu depo yapalım."],
        yasakliKelimeler: ["Enderman", "Nether", "Creeper"]
    },
    {
        id: "attack-on-titan",
        isim: "ATTACK ON TITAN",
        anahtarKelimeler: ["Duvar", "Devriye", "Keşif", "Tehdit", "Özgürlük"],
        ornekCumleler: ["Enseye nişan al.", "Kalbini feda et.", "Tetikleri çek, bıçakları tazele.", "Bodrumdaki sırrı çözmeliyiz."],
        yasakliKelimeler: ["Titan", "Eren", "Mikasa", "Maria, Rose, sheena duvarları", "Eldia", "Karakter isimleri"]
    },
    {
        id: "scooby-doo",
        isim: "SCOOBY-DOO",
        anahtarKelimeler: ["Malikane", "Ipucu", "Gizem", "Şüpheli", "Iz"],
        ornekCumleler: ["Gözlüğümü kaybettim göremiyorum.", "Korkunç bir hayalet, kaçın!", "Büyük bir sandviç hazırlayalım.", "Tuzak hazır, köşeye sıkıştırın.", "Şimdi maskeyi çıkaralım.", "Eğer o çocuklar olmasaydı..."],
        yasakliKelimeler: ["Gizem makinesi", "Scooby", "Shaggy", "Karakter isimleri"]
    },
    {
        id: "shrek",
        isim: "SHREK",
        anahtarKelimeler: ["Bataklık", "Şato", "Yolculuk", "Yaratık", "Misafir"],
        ornekCumleler: ["Bataklığımdan defolun!", "Sihirli iksiri iç.", "Ogrların katmanları vardır.", "Lord Farquaad emir verdi."],
        yasakliKelimeler: ["Eşek", "Fiona", "Yeşil", "Zencefil adam", "Çizmeli kedi"]
    },
    {
        id: "karlar-ulkesi-frozen",
        isim: "KARLAR ÜLKESİ - FROZEN",
        anahtarKelimeler: ["Kar", "Buz", "Krallık", "Kız kardeş", "Kış"],
        ornekCumleler: ["Güçlerini gizle, hissetme.", "Kız kardeşimi bulmalıyım.", "Ormanın ruhları uyandı.", "Sıcak sarılmaları severim.", "Arendelle kapılarını açtı."],
        yasakliKelimeler: ["Elsa", "Anna", "Sven", "Olaf", "Kardan adam"]
    },
    {
        id: "alice-harikalar-diyarinda",
        isim: "ALICE HARİKALAR DİYARINDA",
        anahtarKelimeler: ["Tavşan", "Çay", "Bahçe", "Kartlar", "Bilmece"],
        ornekCumleler: ["Az önce konuşan bir hayvan gördüm.", "Zaman geriye doğru akıyor.", "Hepimiz burada deliyiz.", "Bir bardak çay daha?", "Beyaz gülleri kırmızıya boyayın.", "Kim benim turtalarımı çaldı?"],
        yasakliKelimeler: ["Alice", "Kupa kraliçesi", "Çılgın şapkacı", "Gülümseyen kedi"]
    },
];
