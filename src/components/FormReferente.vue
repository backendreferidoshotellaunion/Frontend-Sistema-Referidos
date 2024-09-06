<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStoreReferido } from '../stores/referido.js';
import { useStoreReferente } from '../stores/referente.js';
import { useRouter } from 'vue-router';

const useReferidos = useStoreReferido();
const useReferentes = useStoreReferente();
const router = useRouter();
const nombre = ref("");
const apellido = ref("");
const cedula = ref("");
const correo = ref("");
const telefono = ref("");
const idReferid = ref(useReferidos.nuevoReferido);
const referente = ref("");
const referidos = ref([]);
const mensajeValidacion = ref("");
const mostrarError = ref(false);
const searchQuery = ref("");
const dropdownVisible = ref(false);
const loadEnviar = ref(false);
const loadingReferidos = ref(false);
const msgButton = ref("Enviar")

async function getInfoReferentes() {
    try {
        const response = await useReferentes.getAll();
    } catch (error) {
        console.log(error);
    }
};

async function getInfoReferidos() {
    loadingReferidos.value = true;
    try {
        const response = await useReferidos.getAll();
        response.sort((a, b) => {
            if (a.nombre < b.nombre) return -1;
            if (a.nombre > b.nombre) return 1;
            return 0;
        });
        referidos.value = response;
    } catch (error) {
        console.log(error);
    } finally {
        loadingReferidos.value = false;
    }
}

const agregarNuevoReferente = async () => {
    if (!referente.value) {
        mostrarError.value = !nombre.value;
        mensajeValidacion.value = "Por favor, seleccione la persona";
        setTimeout(() => {
            mostrarError.value = false;
            mensajeValidacion.value = "";
        }, 3500);
    }

    loadEnviar.value = true;
    msgButton.value = "";

    const data = {
        nombre: nombre.value,
        apellido: apellido.value,
        cedula: cedula.value,
        correo: correo.value,
        telefono: telefono.value,
        idReferido: idReferid.value,
    };

    try {
        const response = await useReferentes.agregar(data);

        if (useReferentes.estatus === 200) {
            loadEnviar.value = false;
            msgButton.value = "Enviar";
            goToMsg();
        } else if (useReferentes.estatus === 400) {
            loadEnviar.value = false;
            msgButton.value = "Enviar";
            return;
        }
    } catch (error) {
        console.log(error);
        loadEnviar.value = false;
        msgButton.value = "Enviar";
    }
};

watch(referente, (newValue) => {
    nombre.value = newValue.nombre;
    apellido.value = newValue.apellido;
    cedula.value = newValue.cedula;
    correo.value = newValue.correo;
    telefono.value = newValue.telefono;
});

function goToMsg() {
    router.push("/msg");
}

onMounted(() => {
    getInfoReferidos();
    getInfoReferentes();
})

// Filtrar lista referidos
const filteredReferidos = computed(() => {
    if (searchQuery.value === '') {
        return referidos.value.filter(referido => referido._id !== idReferid.value);
    } else {
        const query = searchQuery.value.trim().toLowerCase();
        return referidos.value
            .filter(referido => referido._id !== idReferid.value)
            .filter(referido =>
                `${referido.nombre} ${referido.apellido}`.toLowerCase().includes(query)
            );
    }
});


function selectReferido(referido) {
    searchQuery.value = `${referido.nombre} ${referido.apellido}`;
    referente.value = referido;
    dropdownVisible.value = false;
}

function hideDropdown() {
    setTimeout(() => {
        dropdownVisible.value = false;
    }, 200);
}
</script>

<template>
    <div class="main">
        <div class="container" style="margin-top: 8%;">
            <form @submit.prevent="agregarNuevoReferente">
                <div class="logo-container">
                    <img src="https://hotellaunion.com.co/assets/images/hotellaUnionCuriti.webp" alt="Logo Empresa"
                        style="max-width: 120px;" />
                </div>
                <p class="text-center fw-bold fs-5">Por favor seleccione la persona que le recomendó nuestro servicio</p>
                <div class="container text-center mb-3">
                    <div class="input-group mt-4">
                        <!-- Mostrar indicador de carga mientras se obtienen los referidos -->
                        <div v-if="loadingReferidos" class="spinner-container">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Cargando...
                        </div>

                        <!-- Campo de búsqueda que se muestra después de que se han cargado los referidos -->
                        <input v-else type="text" class="form-control" :class="mostrarError ? 'label-error' : 'label'"
                            v-model="searchQuery" placeholder="Buscar persona..." @focus="dropdownVisible = true"
                            @blur="hideDropdown" @input="searchQuery === '' ? dropdownVisible = true : ''" />
                        <div class="dropdown" v-show="dropdownVisible">
                            <div v-for="referido in filteredReferidos" :key="referido._id" :value="referido"
                                class="dropdown-item" @mousedown.prevent="selectReferido(referido)">
                                {{ referido.nombre }} {{ referido.apellido }}
                            </div>
                        </div>
                    </div>
                </div>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <button type="submit" class="boton-elegante" :disabled="loadEnviar">
                        <div v-if="loadEnviar">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </div>
                        {{ msgButton }}
                    </button>
                </div>
                <h6 class="text-danger text-center fw-bold mt-3">{{ mensajeValidacion }}</h6>
            </form>
        </div>
    </div>
</template>
  
<style scoped>
.main {
    margin: 0;
    min-height: 100vh;
    width: 100%;
    display: flex;
    background-image: url('../assets/launion.jpg');
    background-size: cover;
    background-position: center; 
}

.logo-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

form {
    width: 45%;
    margin: 40px auto;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.8);
    /* Ajusta la opacidad aquí */
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}


.spinner-container {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: black;
    width: 100%;
}

.spinner-container .spinner-border {
    margin-right: 10px;
}


.form-control {
    border: 1px solid black;
}

.input {
    width: 100%;
    height: 45px;
    background-color: #05060f0a;
    border-radius: .5rem;
    padding: 0 1rem;
    border: 2px solid transparent;
    font-size: 1rem;
    transition: border-color .3s cubic-bezier(.25, .01, .25, 1) 0s, color .3s cubic-bezier(.25, .01, .25, 1) 0s, background .2s cubic-bezier(.25, .01, .25, 1) 0s;
}



.input:hover,
.input:focus,
.input-group:hover .input {
    outline: none;
    border-color: #05060f;
}

.input-group:hover .label,
.input:focus {
    color: #05060fc2;
}

.boton-elegante {
    padding: 5px 30px;
    border: 2px solid #2c2c2c;
    background-color: rgba(249, 231, 159);
    color: #000000;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 30px;
    transition: all 0.3s ease;
    outline: none;
    position: relative;
    overflow: hidden;
    font-weight: bold;
}

.boton-elegante::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    transform: scale(0);
    transition: transform 0.5s ease;
}

.boton-elegante:hover::after {
    transform: scale(2);
}

.boton-elegante:hover {
    border-color: #444444;
    background-color: #000000;
    color: #e0e0e0;
}


.label {
    color: black;
}

.label-error {
    width: 100%;
    height: 44px;
    background-color: #05060f0a;
    border-radius: .5rem;
    padding: 0 1rem;
    font-size: 1rem;
    border: 2px solid red;
}

.input-border {
    width: 100%;
    height: 44px;
    background-color: #05060f0a;
    border-radius: .5rem;
    padding: 0 1rem;
    font-size: 1rem;
    border: 2px solid red;
}

.input-group {
    position: relative;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 10;
    max-height: 150px;
    overflow-y: auto;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.dropdown-item {
    padding: 10px;
    cursor: pointer;
}

.dropdown-item:hover {
    background-color: #a7fa88;
}


@media screen and (max-width: 768px) {
    form {
        width: 90%;
        padding: 20px;
    }

    .input {
        height: 40px;
    }

    .boton-elegante {
        padding: 5px 20px;
    }
}

@media screen and (max-width: 480px) {
    form {
        width: 95%;
        padding: 15px;
    }

    .input {
        height: 35px;
    }

    .boton-elegante {
        padding: 5px 15px;
    }
}
</style>
  