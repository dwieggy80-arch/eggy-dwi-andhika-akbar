// Memilih elemen-elemen penting dari HTML
    const form = document.getElementById('form-pengeluaran');
    const namaBarangInput = document.getElementById('nama-barang');
    const hargaBarangInput = document.getElementById('harga-barang');
    const daftarItem = document.getElementById('daftar-item');
    const totalPengeluaranSpan = document.getElementById('total-pengeluaran');
    const tombolReset = document.getElementById('tombol-reset');

    // Mencoba mengambil data dari localStorage. Jika tidak ada, gunakan array kosong.
    let pengeluaran = JSON.parse(localStorage.getItem('pengeluaran')) || [];

    // Fungsi untuk menyimpan data ke localStorage
    function simpanData() {
        localStorage.setItem('pengeluaran', JSON.stringify(pengeluaran));
    }

    // Fungsi untuk menghitung dan menampilkan total pengeluaran
    function updateTotal() {
        const total = pengeluaran.reduce((sum, item) => sum + item.harga, 0);
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        });
        totalPengeluaranSpan.textContent = formatter.format(total);
    }
    
    // Fungsi untuk menampilkan semua item pengeluaran di layar
    function renderItems() {
        // Kosongkan daftar sebelum menampilkan yang baru
        daftarItem.innerHTML = '';
        
        // Jika tidak ada pengeluaran, tampilkan pesan
        if (pengeluaran.length === 0) {
            daftarItem.innerHTML = '<li>Belum ada pengeluaran.</li>';
            updateTotal();
            return;
        }

        pengeluaran.forEach((item, index) => {
            const li = document.createElement('li');
            
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });

            // Membuat tampilan untuk setiap item
            li.innerHTML = `
                ${item.nama} <span>${formatter.format(item.harga)}</span>
                <button class="tombol-hapus" data-index="${index}">X</button>
            `;
            
            // Menambahkan item ke dalam daftar di HTML
            daftarItem.appendChild(li);
        });

        updateTotal();
    }
    
    // Event listener saat form disubmit (tombol 'Tambah' diklik)
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Mencegah halaman refresh

        const nama = namaBarangInput.value.trim();
        const harga = parseInt(hargaBarangInput.value);

        if (nama === '' || isNaN(harga) || harga <= 0) {
            alert('Harap isi nama barang dan harga dengan benar!');
            return;
        }

        // Menambahkan item baru ke dalam array
        pengeluaran.push({ nama, harga });

        // Mengosongkan input field
        namaBarangInput.value = '';
        hargaBarangInput.value = '';
        
        simpanData();
        renderItems();
    });

    // Event listener untuk tombol hapus pada setiap item
    daftarItem.addEventListener('click', function (e) {
        if (e.target.classList.contains('tombol-hapus')) {
            const index = e.target.getAttribute('data-index');
            
            // Menghapus item dari array berdasarkan indexnya
            pengeluaran.splice(index, 1);
            
            simpanData();
            renderItems();
        }
    });
    
    // Event listener untuk tombol reset semua data
    tombolReset.addEventListener('click', function() {
        if (confirm('Apakah kamu yakin ingin menghapus semua catatan?')) {
            pengeluaran = [];
            simpanData();
            renderItems();
        }
    });

    // Tampilkan semua item yang sudah tersimpan saat halaman pertama kali dibuka
    renderItems();
});
