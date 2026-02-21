const categories = [
    {
        id: 'kecap', name: 'Kecap & Saus', emoji: '🍶', products: [
            { name: 'Kecap Kuda', price: 14000 }, { name: 'Kecap ABC', price: 8500 }, { name: 'Kecap Bango', price: 10000 },
            { name: 'Kecap Saori', price: 10000 }, { name: 'Sambal ABC', price: 6500 }, { name: 'Sambal Instan', price: 1500 },
            { name: 'Terasi ABC (1 pack)', price: 7500 }
        ]
    },
    {
        id: 'bumbu', name: 'Bumbu & Rempah', emoji: '🧄', products: [
            { name: 'Bumbu Racik', price: 2000 }, { name: 'Desaku Bawang Putih', price: 1000 }, { name: 'Desaku Kunyit', price: 1000 },
            { name: 'Desaku Ketumbar', price: 1000 }, { name: 'Ladaku', price: 1000 }, { name: 'Marinasi Desaku', price: 1500 },
            { name: 'Magic Lezat', price: 5000 }, { name: 'Royco', price: 5000 }, { name: 'Bubuk Jinten', price: 1000 },
            { name: 'Santan Bubuk', price: 1500 }, { name: 'Santan Cair Kara', price: 5500 }, { name: 'Santan Junior Bubuk', price: 2000 },
            { name: 'Indofood Bumbu Soto Ayam', price: 5500 }, { name: 'Indofood Bumbu Gule', price: 5500 },
            { name: 'Indofood Bumbu Semur', price: 5500 }, { name: 'Micin Sasa Besar (85g)', price: 5000 }, { name: 'Micin Sasa Kecil (14g)', price: 1000 }
        ]
    },
    {
        id: 'tepung', name: 'Tepung & Bahan Olahan', emoji: '🌾', products: [
            { name: 'Tepung Sajiku Serbaguna', price: 2500 }, { name: 'Tepung Bakwan Crispy', price: 2000 },
            { name: 'Tepung Sajiku Ayam Goreng', price: 2500 }, { name: 'Tepung Sajiku Golden Crispy', price: 2000 },
            { name: 'Tepung Beras Sriti', price: 4000 }, { name: 'Tepung Beras Rose Brand', price: 8000 },
            { name: 'Tepung Terigu Segitiga Biru', price: 6500 }, { name: 'Tepung Tapioka', price: 5000 }, { name: 'Tepung Ketan', price: 11000 }
        ]
    },
    {
        id: 'mie', name: 'Mie Instan & Sejenis', emoji: '🍜', products: [
            { name: 'Indomie Goreng', price: 3500 }, { name: 'Indomie Soto Ayam', price: 3500 }, { name: 'Indomie Rendang', price: 3500 },
            { name: 'Mie Sedap Goreng', price: 3500 }, { name: 'Mie Sedap Soto Ayam', price: 3500 }, { name: 'Mie Sedap Curry Special', price: 3500 },
            { name: 'Intermi Goreng', price: 2000 }, { name: 'Intermie Pedas', price: 2000 },
            { name: 'Mie Sukses Goreng', price: 4000 }, { name: 'Mie Sukses Kuah', price: 4000 },
            { name: 'Mie Burung Dara Ijo', price: 3500 }, { name: 'Mie Burung Dara Kuning', price: 3000 },
            { name: 'Spix Mie Goreng', price: 1000 }, { name: 'Mi Boykie', price: 1000 }
        ]
    },
    {
        id: 'pasta', name: 'Pasta Gigi & Sikat Gigi', emoji: '🪥', products: [
            { name: 'Odol Pepsodent', price: 9000 }, { name: 'Odol Ciptadent', price: 7100 }, { name: 'Odol Close Up', price: 15000 },
            { name: 'Sikat Gigi Formula', price: 3200 }, { name: 'Sikat Gigi Pepsodent', price: 3300 },
            { name: 'Sikat Gigi Ciptadent', price: 3300 }, { name: 'Sikat Gigi Kodomo', price: 3500 }
        ]
    },
    {
        id: 'shampo', name: 'Shampo & Perawatan Rambut', emoji: '🧴', products: [
            { name: 'Sampo Zinc (1 renteng)', price: 6000 }, { name: 'Sampo Dove (1 renteng)', price: 10000 },
            { name: 'Sampo Clear (1 renteng)', price: 10500 }, { name: 'Sampo Rejoice (1 renteng)', price: 9500 },
            { name: 'Sampo Botol Emeron 170ml', price: 17500 }, { name: 'Sampo Botol Zinc 170ml', price: 20000 },
            { name: 'Sampo Botol Pantene 170ml', price: 25000 }, { name: 'Sampo Botol Rejoice 150ml', price: 23000 }
        ]
    },
    {
        id: 'sabun', name: 'Sabun & Perawatan Badan', emoji: '🧼', products: [
            { name: 'Sabun Batang Nuvo', price: 4000 }, { name: 'Sabun Batang Shinzui 80g', price: 5000 },
            { name: 'Sabun Batang Shinzui 60g', price: 3700 }, { name: 'Sabun Batang Give', price: 3500 },
            { name: 'Sabun Batang Lux', price: 4600 }, { name: 'Sabun Batang Lifebuoy', price: 3500 },
            { name: 'Fresh Care', price: 13000 }, { name: 'Minyak Kayu Putih', price: 7500 },
            { name: 'Cotton Buds Yukko', price: 4500 }, { name: 'Cotton Buds Biru', price: 3500 },
            { name: 'Cotton Buds Mitzuko', price: 3500 }, { name: 'Cotton Buds Medisoft', price: 4000 }
        ]
    },
    {
        id: 'pembalut', name: 'Pembalut & Popok', emoji: '🍼', products: [
            { name: 'Pembalut Protex Ungu', price: 6500 }, { name: 'Protex Comfort Night', price: 7500 },
            { name: 'Protex Naturals', price: 6500 }, { name: 'Charm Safe Night 350mm', price: 9000 },
            { name: 'Charm Safe Night 290mm', price: 6000 }, { name: 'Charm Extra Maxi', price: 10200 },
            { name: 'Pampers Merries XL', price: 2500 }, { name: 'Pampers Mamy Poko Pants', price: 2500 },
            { name: 'Pampers Merries Celana M', price: 2000 }, { name: 'Pampers Sweety', price: 2000 }
        ]
    },
    {
        id: 'deterjen', name: 'Deterjen & Pembersih Rumah', emoji: '🫧', products: [
            { name: 'Sunlight Cuci Piring (15g)', price: 5000 }, { name: 'Sunlight Cuci Piring (370g)', price: 8000 },
            { name: 'So Klin Pemutih Botol', price: 4500 }, { name: 'Daia 245g', price: 5000 }, { name: 'Daia 495g', price: 10000 },
            { name: 'So Klin 225g', price: 5000 }, { name: 'So Klin 455g', price: 10000 }, { name: 'Boom 225g', price: 5000 },
            { name: 'Rinso 380g', price: 10000 }, { name: 'Wipol 190g', price: 5000 }, { name: 'Super SOL 225ml', price: 5000 },
            { name: 'Super Pell 260g', price: 5000 }, { name: 'So Klin Lantai 310ml', price: 5000 },
            { name: 'Pewangi So Klin 60ml', price: 1000 }, { name: 'Pewangi So Klin 320ml', price: 5000 },
            { name: 'Molto Pewangi 250ml', price: 5000 }, { name: 'Cling Pembersih Dapur 400ml', price: 6000 },
            { name: 'EKONOMI 235ml', price: 3500 }, { name: 'Mama Lemon 105ml', price: 2000 }, { name: 'Mama Lemon 230g', price: 4000 }
        ]
    },
    {
        id: 'minyak', name: 'Minyak Goreng & Lainnya', emoji: '🫙', products: [
            { name: 'Minyak Sunco', price: 40500 }, { name: 'Minyak Rizki', price: 16500 },
            { name: 'Minyak Hemart', price: 11000 }, { name: 'Minyak Fitri', price: 9500 }, { name: 'Minyak GPU', price: 11000 }
        ]
    },
    {
        id: 'airmineral', name: 'Air Mineral & Minuman Botol', emoji: '💧', products: [
            { name: 'Cleo 220ml (mini)', price: 1000 }, { name: 'Cleo 500ml (sedang)', price: 2000 },
            { name: 'Ades Sedang', price: 3500 }, { name: 'Aquaviva 700ml', price: 3000 },
            { name: 'Le Minerale 600ml', price: 3000 }, { name: 'Galon Le Minerale', price: 22000 }, { name: 'Galon Aqua Isi Ulang', price: 4000 }
        ]
    },
    {
        id: 'soda', name: 'Minuman Ringan & Soda', emoji: '🥤', products: [
            { name: 'Sprite 390ml', price: 5000 }, { name: 'Sprite 390ml (tutup kuning)', price: 4500 },
            { name: 'Fanta 250ml', price: 3500 }, { name: 'Coca Cola 250ml', price: 3500 }
        ]
    },
    {
        id: 'kopi', name: 'Kopi, Susu & Minuman Instan', emoji: '☕', products: [
            { name: 'Kopi Top Plus (1 pcs)', price: 1000 }, { name: 'Kopi Good Day (1 pcs)', price: 2000 },
            { name: 'Kopi ABC Plus Gula (1 pcs)', price: 1500 }, { name: 'Kopi Top Kopi Susu Gula Aren (1 pcs)', price: 1500 },
            { name: 'Kopi Top Gula Aren (1 pcs)', price: 1500 }, { name: 'Kopi Kapal Api Mini (1 pcs)', price: 1000 },
            { name: 'Energen Jahe (1 pcs)', price: 2500 }, { name: 'Energen Kacang Hijau (1 pcs)', price: 2500 },
            { name: 'Energen Coklat (1 pcs)', price: 2500 }, { name: 'Energen Vanila (1 pcs)', price: 3000 },
            { name: 'Teh Celup Sosro', price: 3500 }, { name: 'Teh Celup Sariwangi', price: 6000 },
            { name: 'Teh Celup Tong Ji', price: 4500 }, { name: 'Teh Pucuk Harum 350ml', price: 3500 },
            { name: 'Teh Javana 350ml', price: 3000 }, { name: 'Teh Kotak', price: 4000 },
            { name: 'Diamond Milk Bubble Gum', price: 5000 }, { name: 'Diamond Milk Coklat', price: 5000 },
            { name: 'Milku', price: 3500 }, { name: 'ABC Sari Kacang Hijau 100ml', price: 2000 }, { name: 'Mr Jussie', price: 2000 }
        ]
    },
    {
        id: 'gula', name: 'Gula, Garam & Bahan Dasar', emoji: '🧂', products: [
            { name: 'Gula Pasir 1/2 kg', price: 8250 }, { name: 'Gula Pasir 1 kg', price: 16500 },
            { name: 'Garam Kapal Api', price: 2000 }, { name: 'Garam Dua Segitiga', price: 2500 }
        ]
    },
    {
        id: 'snack', name: 'Snack & Cemilan', emoji: '🍿', products: [
            { name: 'Garuda Rosta', price: 1000 }, { name: 'Chocolatos', price: 5000 }, { name: 'My Choco', price: 5000 },
            { name: 'Coco Crepes', price: 5000 }, { name: 'Permen Yupi', price: 500 }, { name: 'Coklat Superstar', price: 1000 },
            { name: 'Wafer Coklat Kelapa', price: 2000 }, { name: 'Waffle Choco Hazelnut', price: 2500 },
            { name: 'Kacang Shanghai Nusa Jaya', price: 4500 }, { name: 'Waffle Nabati Coklat', price: 2000 },
            { name: 'Tiara Snack', price: 2000 }, { name: 'Kerupuk Seblak', price: 2000 },
            { name: 'Happy Tos', price: 2000 }, { name: 'Taro Net 17g', price: 2000 },
            { name: 'Miko Nangka 15g', price: 2000 }, { name: 'Chiki Balls', price: 2000 }
        ]
    },
    {
        id: 'obat', name: 'Obat-obatan & Kesehatan', emoji: '💊', products: [
            { name: 'Obat Nyamuk Bakar King Kong', price: 5000 }, { name: 'Obat Nyamuk Bakar Baygon Max', price: 4000 },
            { name: 'Soffel Losion Anti Nyamuk (1 pcs)', price: 1000 }, { name: 'Autan Losion Anti Nyamuk (1 pcs)', price: 1000 },
            { name: 'Lavenda Losion Anti Nyamuk (1 pcs)', price: 1000 }, { name: 'Obat Decolsin (1 butir)', price: 1000 },
            { name: 'Panadol Paracetamol (1 butir)', price: 1500 }, { name: 'Panadol Cold+Flu (1 butir)', price: 2000 },
            { name: 'Mixagrip', price: 4000 }, { name: 'Entrostop (2 biji)', price: 1500 },
            { name: 'Promag (1 pcs)', price: 8000 }, { name: 'Oskadon', price: 2500 },
            { name: 'Paracetamol Caffeine (4 kaplet)', price: 5500 }, { name: 'Bodrex Flu dan Batuk', price: 2500 }
        ]
    },
    {
        id: 'dapur', name: 'Alat Dapur & Perlengkapan', emoji: '🍳', products: [
            { name: 'Spons Polytex', price: 3000 }, { name: 'Kawat Gosok Panci', price: 2500 }, { name: 'Korek Api', price: 2000 }
        ]
    },
    {
        id: 'plastik', name: 'Plastik & Kemasan', emoji: '🛍️', products: [
            { name: 'Plastik Boyo 1/4', price: 2000 }, { name: 'Plastik Boyo 1/2', price: 2500 },
            { name: 'Plastik Boyo 15', price: 6500 }, { name: 'Plastik Boyo 24', price: 6500 },
            { name: 'Boyo 1 kg', price: 3300 }, { name: 'Plastik Rama Hitam 15', price: 1500 },
            { name: 'Plastik Rama Hitam 28', price: 3500 }, { name: 'Plastik Hitam Lorek', price: 2700 }
        ]
    },
    {
        id: 'rokok', name: 'Rokok', emoji: '🚬', products: [
            { name: 'Rokok Fajar Berlian', price: 10000 }, { name: 'Rokok Dua Dewi', price: 10000 },
            { name: 'Rokok Age Pro', price: 10000 }, { name: 'Rokok Andalan Baru 12', price: 17000 },
            { name: 'Rokok Andalan Baru 16', price: 22000 }, { name: 'Rokok LA', price: 34000 }, { name: 'MILD Hitam 12', price: 21000 }
        ]
    },
    {
        id: 'beras', name: 'Beras', emoji: '🌾', products: [
            { name: 'Beras Rojo Lele 3 kg', price: 43000 }, { name: 'Beras Ayam Bumbu Kuning 3 kg', price: 43500 },
            { name: 'Beras Ikan Koi 5 kg', price: 76000 }, { name: 'Beras Rojo Lele 5 kg', price: 69000 }, { name: 'Beras SPHP 5 kg', price: 62000 }
        ]
    }
];
