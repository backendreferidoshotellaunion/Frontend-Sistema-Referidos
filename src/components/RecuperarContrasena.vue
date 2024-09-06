<script setup>
import { ref } from "vue";
import { useStoreUsuarios } from "../stores/usuario.js";
import VerificarCodigo from "./validarCodigo.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const useUsuario = useStoreUsuarios();
const loadingCorreo = ref(false);
const msgButton = ref("Recuperar contraseña");
const validacion = ref("");
const email = ref("");
const componenteVerificar = ref(false);

function correoValido() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
}

function validarCorreo() {
  if (email.value.trim() === '' || !correoValido()) {
    validacion.value = "Por favor ingrese un correo electrónico válido";
    setTimeout(() => {
      validacion.value = '';
    }, 4000);
    return false;
  }
  return true;
}

function validarCampo() {
  if (!validarCorreo()) {
    return;
  }
  enviarCodigo();
}

async function enviarCodigo() {
  loadingCorreo.value = true;
  msgButton.value = "";
  try {
    const response = await useUsuario.codigoRecuperar(email.value);


    if (useUsuario.estatus === 400) {
      validacion.value = useUsuario.validacion;
      setTimeout(() => {
        validacion.value = '';
      }, 4000);
    } else if (useUsuario.estatus === 200) {
      useUsuario.correoRecuperar = email.value;
      componenteVerificar.value = true;
    } else {
      validacion.value = useUsuario.validacion;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingCorreo.value = false;
    msgButton.value = "Recuperar contraseña";
  }
}

function home() {
  router.push('/login');
}
</script>

<template>
  <main class="container-fluid">
    <div class="row justify-content-start align-items-center" id="primero">
      <div class="col-auto">
        <img src="https://hotellaunion.com.co/assets/images/hotellaUnionCuriti.webp" alt="Logo Empresa" @click="home"
          style="cursor: pointer; max-width: 160px;" />
      </div>
    </div>
    <section v-if="!componenteVerificar">
      <div class="card col-12 col-md-8 col-lg-6 text-center">
        <div class="card-body">
          <h2 class="card-title">Recuperar contraseña</h2>
          <p class="card-text">Por favor, digite su correo para el proceso de recuperación de contraseña.</p>
          <form @submit.prevent="validarCampo">
            <div class="form-group">
              <input type="text" class="form-control" v-model="email" placeholder="Ej: correo@gmail.com" />
              <p class="text-danger text-center">{{ validacion }}</p>
            </div>
            <button value="Ingresar" type="submit" class="btn">
              <div v-if="loadingCorreo">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              </div>
              {{ msgButton }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <VerificarCodigo v-if="componenteVerificar" />
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background-image: url('../assets/launion.jpg');
  background-size: cover;
  background-position: center; 
}

.card {
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-text {
  font-size: 16px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-control:focus {
  border-color: #aaa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.btn {
  color: rgb(0, 0, 0);
  font-weight: bold;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #fecd31;
  cursor: pointer;
}

.btn:hover {
  background-color: #d5b754;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Responsivo */
@media screen and (max-width: 768px) {

  #primero {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .company-name {
    font-size: 16px;
  }
}

@media screen and (max-width: 480px) {
  .company-name {
    font-size: 14px;
  }
}
</style>
