<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

function home() {
    router.push("/")
}

</script>

<template>
    <div class="main">
        <div class="logo-container">
            <img src="https://hotellaunion.com.co/assets/images/hotellaUnionCuriti.webp" alt="Logo Empresa" @click="home"
                style="max-width: 160px;" />
        </div>
        <div class="contenedor-msg" >
            <div class="msg">
                <div class="alert text-center" role="alert">
                    <h4 class="alert-heading">¡Gracias por responder!</h4>
                    <p>Agradecemos el tiempo que te tomaste para responder nuestro formulario. Tu opinión es muy valiosa
                        para nosotros.</p>
                    <hr>
                    <p class="mb-0">Estamos emocionados de haber podido recopilar tus comentarios y los utilizaremos
                        para mejorar nuestros servicios.</p>
                </div>
            </div>
            <div class="row justify-content-center" style="width: 100%;">
                <button class="btn btn-regresar fw-bold " @click="home()">
                    Regresar
                </button>
            </div>
        </div>

    </div>
</template>


<style scoped>
.main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url('../assets/launion.jpg');
    background-size: cover;
    background-position: center; 
}

.logo-container {
    width: 100%;
    display: flex;
    justify-content: start;
    gap: 10px;
}

.contenedor-msg {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 100px;
}

.msg {
    display: flex;
    justify-content: center
}

.alert {
    font-weight: bold;
    background-color: rgba(253, 254, 254, 0.8);
    margin-top: 20px;
    width: 80%;
}

.btn-regresar {
    background-color: rgba(249, 231, 159);
    width: 100%;
    max-width: 200px;
    margin-top: 20px;
}

/* Media Queries */
@media screen and (max-width: 768px) {
    .alert {
        width: 90%;
    }

    .btn-regresar {
        width: 100%;
        max-width: 150px;
    }

    .logo-container {
        margin-top: 40px;
        justify-content: center;
        align-content: center;
    }
}

@media screen and (max-width: 480px) {
    .alert {
        width: 95%;
    }

    .btn-regresar {
        width: 100%;
        max-width: 100px;
    }

    .logo-container {
        margin-top: 40px;
        justify-content: center;
        align-content: center;
    }
}
</style>