import { createRouter, createWebHashHistory } from "vue-router";
import Formulario from "../components/Formulario.vue";
import FormularioReferente from "../components/FormReferente.vue";
import Login from "../components/Login.vue";
import Resenas from "../components/resena.vue";
import MensajeFinal from "../components/MensajeFinal.vue";
import recuperarContra from "../components/RecuperarContrasena.vue";
import { useStoreUsuarios } from "../stores/usuario.js";

const checkAuth = () => {
  const useUsuario = useStoreUsuarios();

  const token = useUsuario.token;

  if (!token) return false;
  return true;
};

const auth = (to, from, next) => {
  if (checkAuth()) {
    next(); // Si hay token, permitir acceso a la ruta 
  } else {
    console.log("Por favor inicie sesion")
    next({ path: "/login" }); // Si no hay token, redirigir
  }
};

const routes = [
  { path: "/", component: Formulario },
  { path: "/formref", component: FormularioReferente },
  { path: "/recuperar-contrasena", component: recuperarContra },
  { path: "/resena", beforeEnter: auth, component: Resenas },
  { path: "/msg", component: MensajeFinal },
  { path: "/login", component: Login },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
