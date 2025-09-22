import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Controle from '../views/Controle.vue'
import VehicleDetail from '../views/VehicleDetail.vue'
import VehicleForm from '../views/VehicleForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/controle',
      name: 'controle',
      component: Controle,
    },
    {
      path: '/controle/:id',
      name: 'ControleDetail',
      component: () => import('../views/ControleDetail.vue')
    },
    {
      path: '/vehicle/:id',
      name: 'vehicle-detail',
      component: VehicleDetail,
    },
    {
      path: '/vehicle/add',
      name: 'vehicle-add',
      component: VehicleForm,
    },
    {
      path: '/vehicle/edit/:id',
      name: 'vehicle-edit',
      component: VehicleForm,
    },
    // Redirection par défaut
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router
