<script setup>
import { ref, onMounted } from 'vue'
import { useStoreReferido } from '../stores/referido.js'
import { useRouter } from 'vue-router';

let router = useRouter();

const nombre = ref("");
const apellido = ref("");
const cedula = ref("");
const correo = ref("");
const telefono = ref("");
const opinion = ref("");
const metodo = ref("");
const useReferidos = useStoreReferido();
const msgButton = ref("Enviar");
const validacion = ref("");
const showModal = ref(false);
const bordeInput = ref(false);
const loadEnviar = ref(false);
const loadingReferidos = ref(false);
const errores = ref({
    nombre: false,
    apellido: false,
    cedula: false,
    correo: false,
    telefono: false,
    metodo: false,
    visitoHotel: false,
});
const visitoHotel = ref("");
const mostrarOpinion = ref(false);
const selectedMethod = ref("");
const opcionesBase = [
    { nombre: "Referido" },
    { nombre: "Redes sociales" },
    { nombre: "Otro" }
];
const opciones = ref([]);
const referidos = ref([]);

async function getInfoReferidos() {
    loadingReferidos.value = true;
    try {
        const response = await useReferidos.getAll();
        referidos.value = response;
        // Filtrar opciones dinámicamente: si no hay referidos, eliminamos la opción "Referido"
        if (referidos.value.length === 0) {
            opciones.value = opcionesBase.filter(opcion => opcion.nombre !== "Referido");
        } else {
            opciones.value = opcionesBase;
        }
    } catch (error) {
        console.log(error);
    } finally{
        loadingReferidos.value = false;
    }
}

const agregarNuevoReferido = async () => {
    quitarTildesDeFormulario();
    if (!nombre.value || !apellido.value || !cedula.value || !correo.value || !telefono.value || !metodo.value || !visitoHotel.value) {
        errores.value.nombre = !nombre.value;
        errores.value.apellido = !apellido.value;
        errores.value.cedula = !cedula.value;
        errores.value.correo = !correo.value;
        errores.value.telefono = !telefono.value;
        errores.value.metodo = !metodo.value;
        errores.value.visitoHotel = !visitoHotel.value;
        validacion.value = "Por favor, complete todos los campos *";
        setTimeout(() => {
            validacion.value = "";
            bordeInput.value = false;
            errores.value.nombre = false;
            errores.value.apellido = false;
            errores.value.cedula = false;
            errores.value.correo = false;
            errores.value.telefono = false;
            errores.value.metodo = false;
            errores.value.visitoHotel = false;
            return;
        }, 3500);
        return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo.value)) {
        validacion.value = "Por favor, ingrese un correo electrónico válido";
        errores.value.correo = true;
        setTimeout(() => {
            validacion.value = "";
            errores.value.correo = false;
            return;
        }, 5000);
        return;
    }
    if (opinion.value === '') {
        opinion.value = "No aplica";
    }

    if (metodo.value === "Redes sociales" || metodo.value === "Otro") {
        showModal.value = true;
        selectedMethod.value = metodo.value;
    } else {
        loadEnviar.value = true;
        msgButton.value = '';
        // Enviar formulario directamente si se seleccionó "Referido"
        const data = {
            nombre: nombre.value,
            apellido: apellido.value,
            cedula: cedula.value,
            correo: correo.value,
            telefono: telefono.value,
            opinion: opinion.value,
            metodo: metodo.value,
        };

        try {
            const response = await useReferidos.agregar(data);

            if (useReferidos.estatus === 200) {
                loadEnviar.value = false;
                msgButton.value = "Enviar";
                goToFormReferente();
            } else if (useReferidos.estatus === 400) {
                validacion.value = useReferidos.validacion;
                loadEnviar.value = false;
                msgButton.value = "Enviar";
                return;
            }

        } catch (error) {
            console.log('Error al agregar  referido:', error);
            loadEnviar.value = false;
            msgButton.value = "Enviar";
        }
    }
}

const confirmMethod = async () => {
    showModal.value = false;
    loadEnviar.value = true;
    msgButton.value = "";
    // Enviar formulario con los datos seleccionados
    const data = {
        nombre: nombre.value,
        apellido: apellido.value,
        cedula: cedula.value,
        correo: correo.value,
        telefono: telefono.value,
        opinion: opinion.value,
        metodo: selectedMethod.value,
    };

    try {
        const response = await useReferidos.agregar(data);

        if (useReferidos.estatus === 200) {
            loadEnviar.value = false;
            msgButton.value = "Enviar";
            goToMensajeFinal();
        } else if (useReferidos.estatus === 400) {
            loadEnviar.value = false;
            msgButton.value = "Enviar";
            validacion.value = useReferidos.validacion;
            return;
        }
    } catch (error) {
        console.log('Error al agregar  referido:', error);
        loadEnviar.value = false;
        msgButton.value = "Enviar";
    }
}

function cancelMethod() {
    showModal.value = false;
    metodo.value = "";
}

const quitarTildes = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const quitarTildesDeFormulario = () => {
    nombre.value = quitarTildes(nombre.value);
    apellido.value = quitarTildes(apellido.value);
    opinion.value = quitarTildes(opinion.value);

    nombre.value = nombre.value.charAt(0).toUpperCase() + nombre.value.slice(1).toLowerCase();
    apellido.value = apellido.value.charAt(0).toUpperCase() + apellido.value.slice(1).toLowerCase();
}

const mostrarCampoOpinion = () => {
    if (visitoHotel.value === 'Si') {
        mostrarOpinion.value = true;
        opinion.value = "";
    } else {
        opinion.value = "Primera visita";
        mostrarOpinion.value = false;
    }
}

function goToFormReferente() {
    router.push('/formref')
}

function goToMensajeFinal() {
    router.push('/msg')
}

onMounted(() => {
    getInfoReferidos();
})
</script>

<template>
    <div class="main">
        <div v-if="loadingReferidos" class="spinner-container">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Cargando Formulario...
        </div>
        <div v-else class="container">
            <form @submit.prevent="agregarNuevoReferido"
                style="display: flex; flex-direction: column;justify-content: center;">
                <div class="logo-container">
                    <img src="https://hotellaunion.com.co/assets/images/hotellaUnionCuriti.webp" alt="Logo Empresa"
                        style="max-width: 160px;" />
                    <h2 class="text-center"
                        style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                        Formulario de datos</h2>
                </div>


                <label class=" mt-4 label" for="nombre">Digite su nombre
                    <span class="text-danger">*</span></label>
                <input type="text" id="nombre" name="nombre" v-model="nombre" class="input"
                    :class="errores.nombre ? 'input-border' : 'input'"><br>

                <label class=" label" for="apellido">Digite sus apellidos
                    <span class="text-danger">*</span></label>
                <input type="text" id="apellido" name="apellido" v-model="apellido" class="input"
                    :class="errores.apellido ? 'input-border' : 'input'"><br>

                <label class=" label" for="cedula">Digite su cédula o
                    número de documento <span class="text-danger">*</span></label>
                <input type="number" id="cedula" name="cedula" v-model="cedula" class="input"
                    :class="errores.cedula ? 'input-border' : 'input'"><br>

                <label class=" label" for="correo">Digite su correo
                    electrónico <span class="text-danger">*</span></label>
                <input type="text" id="correo" name="correo" v-model="correo" class="input"
                    :class="errores.correo ? 'input-border' : 'input'"><br>

                <label class=" label" for="telefono">Digite su teléfono
                    <span class="text-danger">*</span></label>
                <input type="number" id="telefono" name="telefono" v-model="telefono" class="input"
                    :class="errores.telefono ? 'input-border' : 'input'"><br>

                <label class=" label" for="metodo">Por favor seleccione
                    el método por el que encontró nuestro
                    servicio <span class="text-danger">*</span></label>
                <select v-model="metodo" class="form-select mb-4 input" id="inputGroupSelect03"
                    aria-label="Example select with button addon" :class="errores.metodo ? 'input-border' : 'input'">
                    <option value="" disabled selected>Escoge una opción...</option>
                    <option v-for="opcion in opciones" :key="opcion.nombre" :value="opcion.nombre">{{ opcion.nombre }}
                    </option>
                </select>

                <label class=" label" for="visitoHotel">¿Ha visitado nuestro establecimiento anteriormente? <span
                        class="text-danger">*</span></label>
                <select v-model="visitoHotel" class="form-select mb-4 input" id="inputGroupSelect04"
                    aria-label="Example select with button addon"
                    :class="errores.visitoHotel ? 'input-border' : 'input'" @change="mostrarCampoOpinion">
                    <option value="" disabled selected>Escoge una opción...</option>
                    <option value="Si">Sí</option>
                    <option value="No">No</option>
                </select>

                <div v-if="mostrarOpinion">
                    <label class=" label" for="opinion">Digite su opinión respecto al servicio ofrecido</label>
                    <textarea id="opinion" name="opinion" v-model="opinion" class="input"
                        style="height: 70px;"></textarea><br><br>
                </div>
                <p class="text-danger" style="font-size: 10px;">* campo obligatorio</p>
                <button type="submit" class="boton-elegante" :disabled="loadEnviar">
                    <div v-if="loadEnviar">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </div>
                    {{ msgButton }}
                </button>

                <h6 class="text-danger text-center fw-bold mt-3">{{ validacion }}</h6>
            </form>


            <div v-if="showModal" class="modal text-center">
                <div class="modal-content">
                    <h2>Confirmar método</h2>
                    <p>Estás seguro que deseas seleccionar {{ selectedMethod }}?</p>
                    <button @click="confirmMethod" id="buttony">Sí</button>
                    <button @click="cancelMethod" id="buttonn">No</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    margin: 0;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('../assets/launion.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

}

.spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: white;
    background-color: black;
    width: 200px;
    height: 60px;
}

.spinner-container .spinner-border {
    margin-right: 10px;
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

.logo-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
}



textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #3e3b3b;
}

.input {
    width: 100%;
    height: 44px;
    background-color: #ffffff;
    border-radius: .5rem;
    padding: 0 1rem;
    border: 2px solid #000000;
    font-size: 1rem;
    transition: border-color .3s cubic-bezier(.25, .01, .25, 1) 0s, color .3s cubic-bezier(.25, .01, .25, 1) 0s, background .2s cubic-bezier(.25, .01, .25, 1) 0s;
}

.label {
    display: block;
    margin-bottom: .3rem;
    font-weight: 400;
    transition: color .3s cubic-bezier(.25, .01, .25, 1) 0s;
    font-weight: bold;
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
    /* Lighter border color for subtlety */
    background-color: #000000;
    /* Slightly lighter black for a softer effect */
    color: #e0e0e0;
    /* Softer white text color */
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 300px;
}

.modal-content h2 {
    margin-top: 0;
}

.modal-content button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal-content button:hover {
    background-color: #ccc;
}

#buttony:hover {
    background-color: green;
    color: white;
    font-weight: bold;
}

#buttonn:hover {
    background-color: red;
    color: black;
    font-weight: bold;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
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

.label-error {
    display: block;
    margin-bottom: .3rem;
    font-weight: bold;
    transition: color .3s cubic-bezier(.25, .01, .25, 1) 0s;
    color: red;
}

@media screen and (max-width: 1000px) {
    form {
        width: 80%;
    }

    .logo-container {
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }

    .logo-container img {
        max-width: 120px;
        max-height: 120px;
    }

}
</style>