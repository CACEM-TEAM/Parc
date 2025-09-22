<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { Car, Home, BarChart3, ClipboardList, Menu, X } from 'lucide-vue-next'
import { ref } from 'vue'

// État pour le menu mobile
const isMobileMenuOpen = ref(false)

// Fonction pour fermer le menu mobile
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fonction pour basculer le menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div id="app">
    <!-- Navigation iOS -->
    <nav class="ios-navbar">
      <div class="ios-container">
        <div class="d-flex justify-content-between align-items-center">
          <!-- Logo/Brand -->
          <router-link to="/" class="ios-navbar-brand" @click="closeMobileMenu">
            <Car class="brand-icon" />
            <span class="brand-text">ParcAuto</span>
          </router-link>
          
          <!-- Menu Desktop -->
          <div class="desktop-menu d-flex gap-3">
            <router-link 
              to="/" 
              class="ios-nav-link"
              :class="{ active: $route.path === '/' }"
            >
              <Home class="nav-icon" />
              <span class="nav-text">Accueil</span>
            </router-link>
            <router-link 
              to="/dashboard" 
              class="ios-nav-link"
              :class="{ active: $route.path === '/dashboard' }"
            >
              <BarChart3 class="nav-icon" />
              <span class="nav-text">Dashboard</span>
            </router-link>
            <router-link 
              to="/controle" 
              class="ios-nav-link"
              :class="{ active: $route.path === '/controle' }"
            >
              <ClipboardList class="nav-icon" />
              <span class="nav-text">Contrôle</span>
            </router-link>
          </div>
          
          <!-- Bouton Menu Mobile -->
          <button 
            class="mobile-menu-toggle"
            @click="toggleMobileMenu"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Menu de navigation"
          >
            <Menu v-if="!isMobileMenuOpen" class="menu-icon" />
            <X v-else class="menu-icon" />
          </button>
        </div>
        
        <!-- Menu Mobile -->
        <div 
          class="mobile-menu"
          :class="{ 'mobile-menu-open': isMobileMenuOpen }"
        >
          <div class="mobile-menu-content">
            <router-link 
              to="/" 
              class="mobile-nav-link"
              :class="{ active: $route.path === '/' }"
              @click="closeMobileMenu"
            >
              <Home class="mobile-nav-icon" />
              <span>Accueil</span>
            </router-link>
            <router-link 
              to="/dashboard" 
              class="mobile-nav-link"
              :class="{ active: $route.path === '/dashboard' }"
              @click="closeMobileMenu"
            >
              <BarChart3 class="mobile-nav-icon" />
              <span>Dashboard</span>
            </router-link>
            <router-link 
              to="/controle" 
              class="mobile-nav-link"
              :class="{ active: $route.path === '/controle' }"
              @click="closeMobileMenu"
            >
              <ClipboardList class="mobile-nav-icon" />
              <span>Contrôle</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="ios-container ios-p-lg">
      <router-view />
    </main>

    <!-- Messages globaux -->
    <div v-if="globalMessage" class="ios-message" :class="globalMessage.type">
      {{ globalMessage.text }}
    </div>
  </div>
</template>

<script>
import { healthService } from './services/api'

export default {
  name: 'App',
  data() {
    return {
      globalMessage: null
    }
  },
  async mounted() {
    // Vérifier la santé de l'API au démarrage
    try {
      const health = await healthService.check()
      if (health.success && health.database === 'Connected') {
        console.log('✅ API connectée avec succès')
      } else {
        this.showGlobalMessage('⚠️ Problème de connexion à la base de données', 'warning')
      }
    } catch (error) {
      this.showGlobalMessage('❌ Impossible de se connecter au serveur', 'error')
      console.error('Erreur de connexion API:', error)
    }
  },
  methods: {
    showGlobalMessage(text, type = 'info') {
      this.globalMessage = { text, type }
      setTimeout(() => {
        this.globalMessage = null
      }, 5000)
    }
  }
}
</script>

<style>
/* Styles utilitaires Bootstrap pour la flexbox */
.d-flex {
  display: flex !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.align-items-center {
  align-items: center !important;
}

.gap-3 {
  gap: 1rem !important;
}

/* ===== NAVIGATION MOBILE OPTIMISÉE ===== */

/* Bouton menu mobile */
.mobile-menu-toggle {
  display: none !important;
  background: none !important;
  border: none !important;
  padding: 8px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  color: white !important;
}

.menu-icon {
  width: 24px !important;
  height: 24px !important;
  color: white !important;
  transition: all 0.3s ease !important;
}

.mobile-menu-toggle:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.1) !important;
}

.mobile-menu-toggle:focus {
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3) !important;
}

/* Menu mobile */
.mobile-menu {
  display: none !important;
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: 0 !important;
  background: rgba(0, 0, 0, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
  transform: translateY(-100%) !important;
  opacity: 0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  z-index: 999 !important;
}

.mobile-menu-open {
  transform: translateY(0) !important;
  opacity: 1 !important;
}

.mobile-menu-content {
  padding: 20px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}

.mobile-nav-link {
  display: flex !important;
  align-items: center !important;
  gap: 16px !important;
  padding: 16px 20px !important;
  color: white !important;
  text-decoration: none !important;
  font-weight: 600 !important;
  font-size: 18px !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  background: transparent !important;
  border: 1px solid transparent !important;
}

.mobile-nav-link:hover {
  background: rgba(68, 160, 141, 0.2) !important;
  border-color: rgba(68, 160, 141, 0.3) !important;
  transform: translateX(8px) !important;
}

.mobile-nav-link.active {
  background: rgba(68, 160, 141, 0.3) !important;
  border-color: rgba(68, 160, 141, 0.5) !important;
  box-shadow: 0 4px 12px rgba(68, 160, 141, 0.3) !important;
}

.mobile-nav-icon {
  width: 24px !important;
  height: 24px !important;
  color: white !important;
  transition: all 0.3s ease !important;
}

.mobile-nav-link:hover .mobile-nav-icon {
  transform: scale(1.2) !important;
  color: var(--ios-primary) !important;
}

.mobile-nav-link.active .mobile-nav-icon {
  color: white !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) !important;
}

/* Optimisations pour le texte du brand */
.brand-text {
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
}

.nav-text {
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Tablette et mobile */
@media (max-width: 768px) {
  .desktop-menu {
    display: none !important;
  }
  
  .mobile-menu-toggle {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .mobile-menu {
    display: block !important;
  }
  
  .ios-navbar {
    padding: 12px 0 !important;
  }
  
  .ios-navbar-brand {
    font-size: 20px !important;
  }
  
  .brand-icon {
    width: 24px !important;
    height: 24px !important;
  }
  
  .ios-container {
    padding: 0 16px !important;
  }
}

/* Très petits écrans */
@media (max-width: 480px) {
  .ios-navbar-brand {
    font-size: 18px !important;
  }
  
  .brand-icon {
    width: 22px !important;
    height: 22px !important;
  }
  
  .mobile-menu-content {
    padding: 16px !important;
  }
  
  .mobile-nav-link {
    padding: 14px 16px !important;
    font-size: 16px !important;
  }
  
  .mobile-nav-icon {
    width: 20px !important;
    height: 20px !important;
  }
}

/* Animation d'entrée pour les pages */
.router-view-enter-active {
  transition: all 0.3s ease-out;
}

.router-view-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.router-view-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Animation pour le menu mobile */
@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOutToTop {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}

/* Amélioration de l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .mobile-menu,
  .mobile-nav-link,
  .mobile-menu-toggle {
    transition: none !important;
    animation: none !important;
  }
}

/* Support pour les écrans tactiles */
@media (hover: none) and (pointer: coarse) {
  .mobile-nav-link {
    min-height: 48px !important;
  }
  
  .mobile-menu-toggle {
    min-height: 44px !important;
    min-width: 44px !important;
  }
}
</style>

