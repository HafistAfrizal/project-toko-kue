import "./assets/main.css"
import { createApp } from "vue"
import App from "./App.vue"

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

const app = createApp(App)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error("Global error:", err, info)
}

app.mount("#app")
