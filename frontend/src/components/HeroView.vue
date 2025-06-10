<template>
  <div class="hero-section">
    <div class="hero-overlay">
      <div class="container">
        <h2>
          <strong>Delicious Cake Menu,</strong> <br />
          in Your Gadget
        </h2>
        <p>Ayo segera pilih dan pesan kue favorit kalian</p>
        <button class="btn btn-lg btn-success"> <b-icon-arrow-right></b-icon-arrow-right> Pesan Sekarang</button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroView",
};
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100vw; /* full width layar */
  height: 90vh;
  background-image: url(~@/assets/kue-1.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  color: white;
}

h2 {
  font-size: 2.7rem;
}
</style>
