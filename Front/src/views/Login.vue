<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <Car class="login-logo" />
        <h1>ParcAuto</h1>
        <p>Connexion à votre espace de gestion</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="ios-form-group">
          <label class="ios-form-label">Email</label>
          <div class="input-with-icon">
            <Mail class="input-icon" />
            <input
              v-model="form.email"
              type="email"
              class="ios-form-input"
              placeholder="votre@email.com"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div class="ios-form-group">
          <label class="ios-form-label">Mot de passe</label>
          <div class="input-with-icon">
            <Lock class="input-icon" />
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="ios-form-input"
              placeholder="Votre mot de passe"
              required
              :disabled="loading"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :disabled="loading"
            >
              <Eye v-if="!showPassword" class="toggle-icon" />
              <EyeOff v-else class="toggle-icon" />
            </button>
          </div>
        </div>

        <div class="login-options">
          <label class="ios-checkbox">
            <input
              v-model="form.remember"
              type="checkbox"
              :disabled="loading"
            />
            <span class="checkmark"></span>
            Se souvenir de moi
          </label>
        </div>

        <button
          type="submit"
          class="ios-button primary login-button"
          :disabled="loading"
        >
          <Loader2 v-if="loading" class="button-icon spinning" />
          <LogIn v-else class="button-icon" />
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="login-footer">
        <p>Comptes de démonstration :</p>
        <div class="demo-accounts">
          <div class="demo-account">
            <strong>Admin :</strong> admin@parcauto.com / password123
          </div>
          <div class="demo-account">
            <strong>Utilisateur :</strong> user@parcauto.com / password123
          </div>
        </div>
      </div>
    </div>

    <!-- Messages d'erreur -->
    <div v-if="error" class="ios-message error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Car, Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-vue-next'
import { authService } from '../services/api'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await authService.login({
      email: form.email,
      password: form.password
    })

    if (response.success) {
      // Stocker le token
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Rediriger vers le dashboard
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.message || 'Erreur lors de la connexion'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  width: 60px;
  height: 60px;
  color: #667eea;
  margin: 0 auto 20px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px;
}

.login-header p {
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 30px;
}

.login-button {
  width: 100%;
  margin-top: 20px;
  height: 50px;
  font-size: 16px;
}

.login-options {
  margin-top: 15px;
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-footer p {
  color: #666;
  margin: 0 0 15px;
  font-size: 14px;
}

.demo-accounts {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
}

.demo-account {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.demo-account:last-child {
  margin-bottom: 0;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 5px;
}

.password-toggle:hover {
  color: #333;
}

.toggle-icon {
  width: 18px;
  height: 18px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding-right: 50px;
}
</style> 