<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container">
      <!-- Brand -->
      <a class="navbar-brand" href="#">Toko Kue</a>

      <!-- Toggle Button (mobile) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Content -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Menu Tengah -->
        <ul class="navbar-nav mx-auto d-flex justify-content-center">
          <li class="nav-item px-2">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item px-2">
            <router-link class="nav-link" to="/pesan">Pesan Kue</router-link>
          </li>
          <li class="nav-item px-2">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item px-2">
            <router-link class="nav-link" to="/contact">Contact</router-link>
          </li>
        </ul>

        <!-- Keranjang di Kanan -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/keranjang">
              Keranjang 
              <b-icon-cart3 class="mx-1"></b-icon-cart3>
              <span class="badge bg-success ms-2">0</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "MainNavbar",
};
</script>

