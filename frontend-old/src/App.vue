<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">🧁 Toko Kue Manis</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#" @click="currentView = 'user'" :class="{ active: currentView === 'user' }">
                Menu Kue
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click="currentView = 'keranjang'" :class="{ active: currentView === 'keranjang' }">
                Keranjang ({{ keranjang.length }})
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click="currentView = 'admin'" :class="{ active: currentView === 'admin' }">
                Admin
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="loading"></div>
        <p class="mt-2">Memuat data...</p>
      </div>

      <!-- User View - Menu Kue -->
      <div v-else-if="currentView === 'user'">
        <h2 class="mb-4">Menu Kue Tersedia</h2>
        <div v-if="kueList.length === 0" class="alert alert-info">
          Belum ada kue tersedia. Silakan hubungi admin.
        </div>
        <div v-else class="row">
          <div class="col-md-4 mb-4" v-for="kue in kueList" :key="kue.id">
            <div class="card h-100">
              <img :src="kue.gambar || 'https://via.placeholder.com/300x200?text=Kue'" 
                   class="card-img-top" 
                   alt="Kue" 
                   style="height: 200px; object-fit: cover;"
                   @error="handleImageError">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ kue.nama }}</h5>
                <p class="card-text">{{ kue.deskripsi }}</p>
                <p class="card-text"><strong>Rp {{ formatHarga(kue.harga) }}</strong></p>
                <button class="btn btn-primary mt-auto" @click="tambahKeKeranjang(kue)">
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Keranjang View -->
      <div v-else-if="currentView === 'keranjang'">
        <h2 class="mb-4">Keranjang Belanja</h2>
        <div v-if="keranjang.length === 0" class="alert alert-info">
          Keranjang masih kosong. Silakan pilih kue dari menu.
        </div>
        <div v-else>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Nama Kue</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                  <th>Total</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in keranjang" :key="item.id">
                  <td>{{ item.nama }}</td>
                  <td>Rp {{ formatHarga(item.harga) }}</td>
                  <td>
                    <input type="number" v-model.number="item.jumlah" min="1" class="form-control" style="width: 80px;" @change="updateTotal">
                  </td>
                  <td>Rp {{ formatHarga(item.harga * item.jumlah) }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="hapusDariKeranjang(item.id)">
                      Hapus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-md-6">
              <h4>Total: Rp {{ formatHarga(totalHarga) }}</h4>
            </div>
            <div class="col-md-6 text-end">
              <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#orderModal">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin View -->
      <div v-else-if="currentView === 'admin'">
        <h2 class="mb-4">Admin Panel</h2>
        
        <!-- Form Tambah/Edit Kue -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>{{ editMode ? 'Edit Kue' : 'Tambah Kue Baru' }}</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="simpanKue">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nama Kue</label>
                    <input type="text" v-model="formKue.nama" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Harga</label>
                    <input type="number" v-model.number="formKue.harga" class="form-control" required min="0">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Gambar URL</label>
                    <input type="url" v-model="formKue.gambar" class="form-control" placeholder="https://example.com/image.jpg">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Deskripsi</label>
                    <textarea v-model="formKue.deskripsi" class="form-control" rows="3"></textarea>
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary me-2" :disabled="submitting">
                <span v-if="submitting" class="loading me-2"></span>
                {{ editMode ? 'Update' : 'Simpan' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="resetForm" v-if="editMode">
                Batal
              </button>
            </form>
          </div>
        </div>

        <!-- Tabel Kue -->
        <div class="card">
          <div class="card-header">
            <h5>Daftar Kue</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Gambar</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="kue in kueList" :key="kue.id">
                    <td>{{ kue.id }}</td>
                    <td>
                      <img :src="kue.gambar || 'https://via.placeholder.com/50x50?text=Kue'" 
                           alt="Kue" 
                           style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"
                           @error="handleImageError">
                    </td>
                    <td>{{ kue.nama }}</td>
                    <td>{{ kue.deskripsi }}</td>
                    <td>Rp {{ formatHarga(kue.harga) }}</td>
                    <td>
                      <button class="btn btn-warning btn-sm me-2" @click="editKue(kue)">
                        Edit
                      </button>
                      <button class="btn btn-danger btn-sm" @click="hapusKue(kue.id)">
                        Hapus
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Order -->
    <div class="modal fade" id="orderModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Informasi Pemesanan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitOrder">
              <div class="mb-3">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" v-model="orderForm.nama_customer" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Alamat</label>
                <textarea v-model="orderForm.alamat" class="form-control" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Nomor Telepon</label>
                <input type="tel" v-model="orderForm.telepon" class="form-control" required>
              </div>
              <div class="mb-3">
                <strong>Total Pembayaran: Rp {{ formatHarga(totalHarga) }}</strong>
              </div>
              <button type="submit" class="btn btn-success" :disabled="submitting">
                <span v-if="submitting" class="loading me-2"></span>
                Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as bootstrap from 'bootstrap';

export default {
  name: 'App',
  data() {
    return {
      currentView: 'user',
      kueList: [],
      keranjang: [],
      editMode: false,
      loading: false,
      submitting: false,
      formKue: {
        id: null,
        nama: '',
        deskripsi: '',
        harga: '',
        gambar: ''
      },
      orderForm: {
        nama_customer: '',
        alamat: '',
        telepon: ''
      }
    }
  },
  computed: {
    totalHarga() {
      return this.keranjang.reduce((total, item) => total + (item.harga * item.jumlah), 0);
    }
  },
  methods: {
    // Ambil data kue dari API
    async ambilKue() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/api/kue');
        this.kueList = response.data;
      } catch (err) {
        console.error('Error mengambil data kue:', err);
        this.showAlert('Gagal mengambil data kue. Pastikan server backend berjalan.', 'danger');
      } finally {
        this.loading = false;
      }
    },

    // Simpan kue (tambah/edit)
    async simpanKue() {
      this.submitting = true;
      try {
        if (this.editMode) {
          await axios.put(`http://localhost:3000/api/kue/${this.formKue.id}`, this.formKue);
          this.showAlert('Kue berhasil diupdate', 'success');
        } else {
          await axios.post('http://localhost:3000/api/kue', this.formKue);
          this.showAlert('Kue berhasil ditambahkan', 'success');
        }
        this.resetForm();
        this.ambilKue();
      } catch (err) {
        console.error('Error menyimpan kue:', err);
        this.showAlert('Gagal menyimpan kue', 'danger');
      } finally {
        this.submitting = false;
      }
    },

    // Edit kue
    editKue(kue) {
      this.editMode = true;
      this.formKue = { ...kue };
      // Scroll to form
      document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    },

    // Hapus kue
    async hapusKue(id) {
      if (confirm('Yakin ingin menghapus kue ini?')) {
        try {
          await axios.delete(`http://localhost:3000/api/kue/${id}`);
          this.showAlert('Kue berhasil dihapus', 'success');
          this.ambilKue();
        } catch (err) {
          console.error('Error menghapus kue:', err);
          this.showAlert('Gagal menghapus kue', 'danger');
        }
      }
    },

    // Reset form
    resetForm() {
      this.editMode = false;
      this.formKue = {
        id: null,
        nama: '',
        deskripsi: '',
        harga: '',
        gambar: ''
      };
    },

    // Tambah ke keranjang
    tambahKeKeranjang(kue) {
      const existingItem = this.keranjang.find(item => item.id === kue.id);
      if (existingItem) {
        existingItem.jumlah++;
      } else {
        this.keranjang.push({
          ...kue,
          jumlah: 1
        });
      }
      this.showAlert('Kue berhasil ditambahkan ke keranjang', 'success');
    },

    // Hapus dari keranjang
    hapusDariKeranjang(id) {
      this.keranjang = this.keranjang.filter(item => item.id !== id);
      this.showAlert('Item berhasil dihapus dari keranjang', 'info');
    },

    // Update total
    updateTotal() {
      // Method ini dipanggil ketika jumlah item berubah
      this.$forceUpdate();
    },

    // Submit order
    async submitOrder() {
      this.submitting = true;
      try {
        for (const item of this.keranjang) {
          await axios.post('http://localhost:3000/api/orders', {
            kue_id: item.id,
            jumlah: item.jumlah,
            nama_customer: this.orderForm.nama_customer,
            alamat: this.orderForm.alamat,
            telepon: this.orderForm.telepon
          });
        }
        
        this.showAlert('Pesanan berhasil dibuat! Terima kasih.', 'success');
        this.keranjang = [];
        this.orderForm = {
          nama_customer: '',
          alamat: '',
          telepon: ''
        };
        
        // Close modal
        const modal = document.getElementById('orderModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
        
        this.currentView = 'user';
      } catch (err) {
        console.error('Error membuat pesanan:', err);
        this.showAlert('Gagal membuat pesanan', 'danger');
      } finally {
        this.submitting = false;
      }
    },

    // Format harga
    formatHarga(harga) {
      return new Intl.NumberFormat('id-ID').format(harga);
    },

    // Handle image error
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/300x200?text=Gambar+Tidak+Tersedia';
    },

    // Show alert
    showAlert(message, type = 'info') {
      // Simple alert for now, you can implement toast notifications later
      alert(message);
    }
  },
  mounted() {
    this.ambilKue();
  }
}
</script>
