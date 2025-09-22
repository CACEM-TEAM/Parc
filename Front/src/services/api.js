import axios from 'axios'

// Configuration de base d'axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4501/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error)
    if (error.response) {
      // Erreur de réponse du serveur
      return Promise.reject({
        message: error.response.data.error || 'Erreur serveur',
        status: error.response.status,
        data: error.response.data
      })
    } else if (error.request) {
      // Erreur de connexion
      return Promise.reject({
        message: 'Impossible de se connecter au serveur',
        status: 0
      })
    } else {
      // Autre erreur
      return Promise.reject({
        message: 'Erreur inattendue',
        status: 0
      })
    }
  }
)

// Service pour les véhicules
export const vehiculesService = {
  // Récupérer tous les véhicules
  async getAll() {
    const response = await api.get('/vehicules')
    return response.data
  },

  // Récupérer un véhicule par ID
  async getById(id) {
    const response = await api.get(`/vehicules/${id}`)
    return response.data
  },

  // Créer un nouveau véhicule
  async create(vehiculeData) {
    const response = await api.post('/vehicules', vehiculeData)
    return response.data
  },

  // Mettre à jour un véhicule
  async update(id, vehiculeData) {
    const response = await api.put(`/vehicules/${id}`, vehiculeData)
    return response.data
  },

  // Supprimer un véhicule
  async delete(id) {
    const response = await api.delete(`/vehicules/${id}`)
    return response.data
  },

  // Récupérer les contrôles d'un véhicule
  async getControles(id) {
    const response = await api.get(`/vehicules/${id}/controles`)
    return response.data
  },

  // Rechercher des véhicules
  async search(params) {
    const response = await api.get('/vehicules/search', { params })
    return response.data
  },


}

// Service pour les conducteurs
export const conducteursService = {
  // Récupérer tous les conducteurs
  async getAll() {
    const response = await api.get('/conducteurs')
    return response.data
  },

  // Récupérer un conducteur par ID
  async getById(id) {
    const response = await api.get(`/conducteurs/${id}`)
    return response.data
  },

  // Créer un nouveau conducteur
  async create(conducteurData) {
    const response = await api.post('/conducteurs', conducteurData)
    return response.data
  },

  // Mettre à jour un conducteur
  async update(id, conducteurData) {
    const response = await api.put(`/conducteurs/${id}`, conducteurData)
    return response.data
  },

  // Supprimer un conducteur
  async delete(id) {
    const response = await api.delete(`/conducteurs/${id}`)
    return response.data
  },

  // Récupérer les conducteurs disponibles
  async getDisponibles() {
    const response = await api.get('/conducteurs/disponibles/liste')
    return response.data
  }
}

// Service pour les contrôles
export const controlesService = {
  // Récupérer tous les contrôles
  async getAll() {
    const response = await api.get('/controles')
    return response.data
  },

  // Récupérer un contrôle par ID
  async getById(id) {
    const response = await api.get(`/controles/${id}`)
    return response.data
  },

  // Créer un nouveau contrôle
  async create(controleData) {
    const response = await api.post('/controles', controleData)
    return response.data
  },

  // Mettre à jour un contrôle
  async update(id, controleData) {
    const response = await api.put(`/controles/${id}`, controleData)
    return response.data
  },

  // Supprimer un contrôle
  async delete(id) {
    const response = await api.delete(`/controles/${id}`)
    return response.data
  },

  // Récupérer les contrôles d'un véhicule
  async getByVehicule(vehiculeId) {
    const response = await api.get(`/controles/vehicule/${vehiculeId}`)
    return response.data
  },

  // Récupérer les statistiques
  async getStats() {
    const response = await api.get('/controles/stats/globales')
    return response.data
  }
}

// Service pour l'authentification
export const authService = {
  // Connexion
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Inscription
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Vérification du token
  async verify() {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Aucun token trouvé')
    }
    
    const response = await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // Déconnexion
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// Service pour la santé de l'API
export const healthService = {
  // Vérifier la santé de l'API
  async check() {
    const response = await api.get('/health')
    return response.data
  },

  // Test de l'API
  async test() {
    const response = await api.get('/test')
    return response.data
  }
}

export default api 