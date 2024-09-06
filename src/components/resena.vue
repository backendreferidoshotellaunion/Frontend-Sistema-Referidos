<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStoreReferido } from '../stores/referido.js';
import { useStoreReferente } from '../stores/referente.js';
import { useStoreUsuarios } from '../stores/usuario.js';
import { useStoreNivelReferente } from '../stores/nivel_referente.js';
import { useRouter } from 'vue-router';
import { utils, write } from 'xlsx';
import logoHere from "../assets/logo.png";

const useReferidos = useStoreReferido();
const useReferentes = useStoreReferente();
const useUsuario = useStoreUsuarios();
const useNivelReferente = useStoreNivelReferente();
const cedula = ref("");
const cedulaReferido = ref("");
const router = useRouter();
const searchQuery = ref("");
const validacion = ref("");
const referentes = ref("");
const referidos = ref("");
const nombreReferente = ref("");
const apellidoReferente = ref("");
const cedulaReferente = ref("");
const correoReferente = ref("");
const telefonoReferente = ref("");
const dataReferente = ref([]);
const nivelReferente = ref("");
const nombreReferido = ref("");
const apellidoReferido = ref("");
const cedulaRefido = ref("");
const correoReferido = ref("");
const telefonoReferido = ref("");
const msgNoReferido = ref("");
const mostrarReferidos = ref(false);
const mostrar = ref(false);
const mostrarReferentes = ref(false);
const mostrarDescargas = ref(false);
const mostrarNiveles = ref(false); // Nuevo estado para mostrar niveles
const loadingConfirmacion = ref(false);
const loadIngresar = ref(false);
const loadNivel = ref(false);
const msgButton = ref("Buscar");
const msgAsignarButton = ref("Asignar Nivel");
const msgNivelReferente = ref("");
const nivelesReferente = ref([]); // Datos de niveles
const nivelSeleccionado = ref(null); // Nivel seleccionado
const mostrarConfirmacion = ref(false); // Nuevo estado para mostrar la confirmación
const isLoading = ref(true);
const clienteFiltrado = ref([]);


async function getInfo() {
  try {
    const response = await useReferidos.getAll();
    referidos.value = response;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }

}

async function getInfoReferentes() {
  try {
    const response = await useReferentes.getAll();
  } catch (error) {
    console.log(error);
  }
}

async function getInfoNivelReferente() {
  loadNivel.value = true;
  msgAsignarButton.value = "";
  try {
    const response = await useNivelReferente.getAll();
    nivelesReferente.value = response; // Guarda los niveles obtenidos
    loadNivel.value = false;
    msgAsignarButton.value = "Asignar Nivel";
  } catch (error) {
    console.log(error);
  }
}

const filteredReferidos = computed(() => {
  return referidos.value.reverse().filter(referido => {
    return (referido.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      referido.apellido.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      referido.cedula.includes(searchQuery.value) ||
      referido.correo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      referido.telefono.includes(searchQuery.value) ||
      referido.metodo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      referido.opinion.toLowerCase().includes(searchQuery.value.toLowerCase()));
  });
});

const filteredCount = computed(() => {
  // Solo cuenta los referidos filtrados si searchQuery tiene un valor
  if (searchQuery.value.trim() !== '') {
    return filteredReferidos.value.length;
  }
  return 0; // Si no hay filtro, devolvemos 0
});



async function filtrarPorCedulaReferente() {
  loadIngresar.value = true;
  msgButton.value = "";
  try {
    const response = await useReferentes.getPorCedula(cedula.value);
    if (useReferentes.estatus === 200 && response.length > 0) {
      nombreReferente.value = response[0].nombre;
      apellidoReferente.value = response[0].apellido;
      cedulaReferente.value = response[0].cedula;
      correoReferente.value = response[0].correo;
      telefonoReferente.value = response[0].telefono;
      nivelReferente.value = response[0].idNivelReferente ? response[0].idNivelReferente.nombre : "No asignado";
      mostrarReferidos.value = true;
      msgNoReferido.value = "";
      loadIngresar.value = false;
      msgButton.value = "Buscar";
    } else {
      msgNoReferido.value = "La cédula digitada no tiene referidos";
      nombreReferente.value = "";
      apellidoReferente.value = "";
      cedulaReferente.value = "";
      correoReferente.value = "";
      telefonoReferente.value = "";
      nivelReferente.value = "";
      mostrarReferidos.value = false;
      loadIngresar.value = false;
      msgButton.value = "Buscar";
    }
  } catch (error) {
    console.log(error);
    mostrarReferidos.value = false;
    msgButton.value = "Buscar";
  }
}

async function filtrarPorCedulaReferido() {
  loadIngresar.value = true;
  msgButton.value = "";
  try {
    const response = await useReferentes.getPorCedulaReferido(cedulaReferido.value);

    if (useReferentes.estatus === 200) {
      nombreReferido.value = response.idReferido.nombre;
      apellidoReferido.value = response.idReferido.apellido;
      cedulaRefido.value = response.idReferido.cedula;
      correoReferido.value = response.idReferido.correo;
      telefonoReferido.value = response.idReferido.telefono;
      dataReferente.value = response;
      mostrar.value = true;
      mostrarReferentes.value = true;
      validacion.value = "";
      loadIngresar.value = false;
      msgButton.value = "Buscar";
    } else {
      validacion.value = "La cédula digitada no tiene embajador";
      nombreReferente.value = "";
      apellidoReferente.value = "";
      cedulaReferente.value = "";
      correoReferente.value = "";
      telefonoReferente.value = "";
      mostrar.value = false;
      mostrarReferentes.value = false;
      loadIngresar.value = false;
      msgButton.value = "Buscar";
    }
  } catch (error) {
    console.log(error);
    mostrarReferentes.value = false;
    mostrar.value = false;
    validacion.value = "",
      msgButton.value = "Buscar";
  }
}

function mostrarTablaNiveles() {
  mostrarNiveles.value = !mostrarNiveles.value;
  if (mostrarNiveles.value) {
    getInfoNivelReferente();
  }
}

function mostrarModalConfirmacion() {
  if (nivelSeleccionado.value) {
    mostrarConfirmacion.value = true; // Mostrar el modal de confirmación
  } else {
    msgNivelReferente.value = "Seleccione un nivel de embajador";
    setTimeout(() => {
      msgNivelReferente.value = "";
    }, 4000);
  }
}

async function confirmarAsignacion() {
  loadingConfirmacion.value = true;
  if (nivelSeleccionado.value) {
    const data = {
      idNivelReferente: nivelSeleccionado.value._id
    };

    try {
      const response = await useReferentes.editarRefNivEmb(cedula.value, data);
      if (useReferentes.estatus === 200) {
        loadingConfirmacion.value = false;
        filtrarPorCedulaReferente();
        mostrarNiveles.value = false;
        mostrarConfirmacion.value = false; // Cerrar el modal de confirmación
        msgNivelReferente.value = "Se editó correctamente el nivel de embajador";
        setTimeout(() => {
          msgNivelReferente.value = "";
        }, 5000);
      } else if (useReferentes.estatus === 400) {
        loadingConfirmacion.value = false;
      }
    } catch (error) {
      console.log(error);
      loadingConfirmacion.value = false;
    }
  }
}

// Cerrar el modal de confirmación
function cancelarAsignacion() {
  mostrarConfirmacion.value = false;
}

// Descargar datos

async function descargarReferentes() {
  useReferentes.referentes.sort((a, b) => {
    if (a.nombre < b.nombre) return -1;
    if (a.nombre > b.nombre) return 1;
    return 0;
  });

  const referentes = useReferentes.referentes.map(referente => {
    return {
      Nombre_Embajador: referente.nombre,
      Apellidos_Embajador: referente.apellido,
      Cedula_Embajador: referente.cedula,
      Correo_electronico_Embajador: referente.correo,
      Telefono_Embajador: referente.telefono,
      Nombre_Referido: referente.idReferido.nombre,
      Cedula_Referido: referente.idReferido.cedula,
      Correo_Referido: referente.idReferido.correo,
      Telefono_Referido: referente.idReferido.telefono
    };
  });

  const worksheet = utils.json_to_sheet(referentes);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Referentes');

  const blob = new Blob([write(workbook, { bookType: 'xlsx', type: 'buffer' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Embajadores.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}

async function descargarReferidos() {
  useReferidos.referidos.sort((a, b) => {
    if (a.nombre < b.nombre) return -1;
    if (a.nombre > b.nombre) return 1;
    return 0;
  });

  const referidos = useReferidos.referidos.map(referido => {
    return {
      Nombre: referido.nombre,
      Apellido: referido.apellido,
      Cedula: referido.cedula,
      Correo_electronico: referido.correo,
      Telefono: referido.telefono,
      Metodo: referido.metodo,
      Opinion: referido.opinion
    };
  });

  const worksheet = utils.json_to_sheet(referidos);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Referidos');

  const blob = new Blob([write(workbook, { bookType: 'xlsx', type: 'buffer' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Referidos.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}

function home() {
  useUsuario.token = '';
  useUsuario.usuario = '';
  useUsuario.id = '';
  router.push("/login")

}

onMounted(() => {
  getInfo();
  getInfoReferentes();
});
</script>

<template>
  <div class="main">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div class="logo-container">
          <img src="https://hotellaunion.com.co/assets/images/logo-hotellaunion-blanco-134x134.webp" alt=""
            style="max-width: 100px; max-height: 100px;">
          <span class="fw-bold fs-4 text-white">Complejo Turístico Hotel la Unión</span>
        </div>
        <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto gap-3" id="listaBotones">
            <li class="nav-item">
              <button class="btn fw-bold" id="btn" data-bs-toggle="modal" data-bs-target="#modalBuscarReferidos">
                Ver embajador
              </button>
            </li>
            <li class="nav-item">
              <button class="btn fw-bold" id="btn" data-bs-toggle="modal" data-bs-target="#modalBuscarReferentes">
                Ver referido
              </button>
            </li>
            <li class="nav-item">
              <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalDescarga">
                <i class="fas fa-download"></i>
              </button>
            </li>
            <li class="nav-item">
              <button class="btn btn-dark fw-bold" @click="home()">
                <i class="fas fa-right-from-bracket"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="row" style="width: 100%; height: 100%;">
      <div v-if="isLoading" class="text-center fw-bold" style="margin-top: 150px; color: white;">
        <div class="spinner-border" role="status" id="spinner-border" style="color: white;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Por favor espere...</p>
      </div>

      <div v-else class="row">
        <div class="row justify-content-end mb-4" id="contenedorTI">
          <div class="titulo">
            <h1 class="text-center mt-3 text-uppercase fw-bold" id="titulonc">Nuestros clientes</h1>
          </div>
          <input type="text" class="form-control" id="inputBusqueda" v-model="searchQuery"
            placeholder="Buscar cualquier campo...">
        </div>

        <div class="col-md-4 px-5" v-for="(referido, index) in filteredReferidos" :key="index">
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex align-items-center gap-2">
                <i class="fas fa-user-circle" style="font-size: 36px; color: #666;"></i>
                <VMenu class="vmenu">
                  <h5 class="card-title nombre">{{ referido.nombre }} {{ referido.apellido }}</h5>
                  <template #popper>
                    <div class="descripVmenu">{{ referido.nombre }} {{ referido.apellido }}</div>
                  </template>
                </VMenu>
              </div>
              <div class="card-text mt-2 d-flex align-items-center gap-2">
                <i class="fas fa-id-card mr-2"></i>
                <span>{{ referido.cedula }}</span>
              </div>
              <div class="card-text d-flex align-items-center gap-2">
                <i class="fas fa-envelope mr-2"></i>
                <span>{{ referido.correo }}</span>
              </div>
              <div class="card-text d-flex align-items-center gap-2">
                <i class="fas fa-phone mr-2"></i>
                <span>{{ referido.telefono }}</span>
              </div>
              <div class="card-text d-flex align-items-center gap-2">
                <i class="fas fa-bullhorn mr-2"></i>
                <span>{{ referido.metodo }}</span>
              </div>
              <VMenu class="vmenu">
                <div class="d-flex align-items-center gap-2">
                  <i class="fas fa-comment-dots mr-2"></i>
                  <span class="opinion">{{ referido.opinion }}</span>
                </div>
                <template #popper>
                  <div class="descripVmenu">{{ referido.opinion }}</div>
                </template>
              </VMenu>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal buscar referidos del referente/embajador-->
      <div class="modal fade" id="modalBuscarReferidos" tabindex="-1" aria-labelledby="modalBuscarReferidosLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalBuscarReferidosLabel">Buscar información del embajador</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="width: 100%;">

              <!-- Input para buscar por cédula -->
              <p>Digite la cédula del embajador para buscar sus referidos</p>
              <input type="number" class="form-control" v-model="cedula" placeholder="Ingrese la cédula del embajador">
              <div class="container text-center">
                <div class="row justify-content-center">
                  <div class="col-6 p-4">
                    <button value="Buscar" class="btn btn-success btn-sm fw-bold fs-5 text-uppercase"
                      @click="filtrarPorCedulaReferente">
                      <div v-if="loadIngresar">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      </div>
                      {{ msgButton }}
                    </button>
                  </div>
                  <h4 class="text-danger text-center fw-bold">{{ msgNoReferido }}</h4>
                  <div class="row justify-content-center" v-if="mostrarReferidos">
                    <h3 class="mb-3">Embajador</h3>
                    <div class="table-responsive">
                      <table class="mb-4">
                        <tr>
                          <th>Nombre</th>
                          <th>Cédula</th>
                          <th>Correo</th>
                          <th>Teléfono</th>
                          <th>Nivel Embajador</th>
                        </tr>
                        <tr>
                          <td>{{ nombreReferente }} {{ apellidoReferente }}</td>
                          <td>{{ cedulaReferente }}</td>
                          <td>{{ correoReferente }}</td>
                          <td>{{ telefonoReferente }}</td>
                          <td v-if="nivelReferente">{{ nivelReferente }}</td>
                          <td v-else>No asignado</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Botón para asignar nivel -->
                    <div class="text-center mt-3">
                      <button value="Buscar" class="btn btn-primary fw-bold fs-5 text-uppercase"
                        @click="mostrarTablaNiveles">
                        <div v-if="loadNivel">
                          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </div>
                        {{ msgAsignarButton }}
                      </button>
                    </div>

                    <!-- Tabla de niveles -->
                    <div v-if="mostrarNiveles" class="mt-3">
                      <h3 class="mb-3">Niveles Embajador</h3>
                      <div class="table-responsive">
                        <table class="table table-bordered">
                          <thead>
                            <tr>
                              <th>Seleccionar</th>
                              <th>Nivel</th>
                              <th>Requisitos</th>
                              <th>Incentivo</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(nivel, index) in nivelesReferente" :key="index">
                              <td>
                                <input type="radio" :value="nivel" v-model="nivelSeleccionado">
                              </td>
                              <td>{{ nivel.nombre }}</td>
                              <td>{{ nivel.descripcion }}</td>
                              <td>{{ nivel.beneficio }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div class="text-center mt-3">
                        <button class="btn btn-success fw-bold fs-5 text-uppercase"
                          @click="mostrarModalConfirmacion">Enviar</button>
                      </div>


                      <!-- Modal de confirmación de asignación de nivel -->
                      <div v-if="mostrarConfirmacion" class="modal fade show" tabindex="-1"
                        style="display: block; background: rgba(0,0,0,0.5);" aria-modal="true" role="dialog">
                        <div class="modal-dialog modal-dialog-centered">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title">Confirmación</h5>
                              <button type="button" class="btn-close" @click="cancelarAsignacion"
                                aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <p>¿Está seguro que desea asignarle el {{ nivelSeleccionado.nombre }} a {{ nombreReferente
                              }} {{ apellidoReferente }} con la cédula {{ cedula }}?</p>
                            </div>
                            <div class="modal-footer">
                              <button @click="confirmarAsignacion" class="btn btn-success"
                                :disabled="loadingConfirmacion">
                                <span v-if="loadingConfirmacion" class="spinner-border spinner-border-sm" role="status"
                                  aria-hidden="true"></span>
                                <span v-if="!loadingConfirmacion">Sí</span>
                              </button>
                              <button @click="cancelarAsignacion" class="btn btn-danger" :disabled="loadingConfirmacion">
                                No
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <p
                      :class="{ 'text-danger fw-bold fs-5': msgNivelReferente === 'Seleccione un nivel de embajador', 'text-success fw-bold fs-5': msgNivelReferente === 'Se editó correctamente el nivel de embajador' }">
                      {{ msgNivelReferente }}
                    </p>
                    <hr class="my-3">
                    <h3 class="mb-3">Lista de referidos</h3>

                    <!-- Mostrar referidos de la cédula digitada -->
                    <div class="table-responsive">
                      <table>
                        <tr>
                          <th>Nombre</th>
                          <th>Cédula</th>
                          <th>Correo</th>
                          <th>Teléfono</th>
                        </tr>
                        <tr v-for="(referente, index) in useReferentes.referentesCedulas" :key="index">
                          <td>{{ referente.idReferido.nombre }} {{ referente.idReferido.apellido }}</td>
                          <td>{{ referente.idReferido.cedula }}</td>
                          <td>{{ referente.idReferido.correo }}</td>
                          <td>{{ referente.idReferido.telefono }}</td>
                        </tr>
                      </table>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- Mostrar referente del referido -->
      <div class="modal fade" id="modalBuscarReferentes" tabindex="-1" aria-labelledby="modalBuscarReferentesLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalBuscarReferentesLabel">Buscar información del referido</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="width: 100%;">
              <!-- Input para buscar por cédula -->
              <p>Digite la cédula del referido para buscar su embajador</p>
              <input type="number" class="form-control" v-model="cedulaReferido"
                placeholder="Ingrese la cédula del referido">
              <div class="container text-center">

                <div class="row justify-content-center">
                  <div class="col-6 p-4">
                    <button value="Buscar" class="btn btn-success btn-sm fw-bold fs-5 text-uppercase"
                      @click="filtrarPorCedulaReferido">
                      <div v-if="loadIngresar">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      </div>
                      {{ msgButton }}
                    </button>
                  </div>
                </div>
                <h4 class="text-danger text-center fw-bold mt-3">{{ validacion }}</h4>

                <div class="row justify-content-center" v-if="mostrarReferentes">
                  <h3 class="mb-4">Referido</h3>
                  <div class="table-responsive">
                    <table class="mb-4">
                      <tr>
                        <th>Nombre</th>
                        <th>Cédula</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                      </tr>
                      <tr>
                        <td>{{ nombreReferido }} {{ apellidoReferido }}</td>
                        <td>{{ cedulaRefido }}</td>
                        <td>{{ correoReferido }}</td>
                        <td>{{ telefonoReferido }}</td>
                      </tr>
                    </table>
                  </div>


                  <hr class="my-3">
                </div>
                <div class="row justify-content-center" v-if="mostrar">
                  <h3>Embajador</h3>
                  <div class="table-responsive">
                    <table>
                      <tr>
                        <th>Nombre</th>
                        <th>Cédula</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                      </tr>
                      <tr>
                        <td>{{ dataReferente.nombre }} {{ dataReferente.apellido }}</td>
                        <td>{{ dataReferente.cedula }}</td>
                        <td>{{ dataReferente.correo }}</td>
                        <td>{{ dataReferente.telefono }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mostrar referente de la cédula digitada -->


          </div>
        </div>
      </div>
    </div>

    <!-- Modal seleccionar descarga -->
    <div class="modal fade" id="modalDescarga" tabindex="-1" aria-labelledby="modalBuscarReferentesLabel"
      aria-hidden="true">
      <div class="modal-dialog" id="contenidoDescarga">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <p class="fw-bold text-center">Seleccione la lista de datos que desea descargar</p>
          <div class="d-flex justify-content-center gap-5">
            <button @click="descargarReferidos()" id="buttony">Todos los usuarios</button>
            <button @click="descargarReferentes()" id="buttonn">Embajadores</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped>
.main {
  width: 100%;
  min-height: 100vh;
  /* Altura mínima de la ventana completa */
  display: flex;
  flex-direction: column;
  background-image: url('../assets/launion3.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}


.navbar {
  width: 100%;
  background-color: #ce270d !important;
  position: fixed;
  top: 0;
  z-index: 1000;
}

#contenedorTI {
  margin-top: 110px;
}

#btn {
  background-color: #fecd31;
}

#btn:hover {
  background-color: #d5b754;
}



.card {
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #8f8f8f;
  border-radius: 10px;
  overflow: hidden;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

.card-text {
  font-size: 16px;
  margin-bottom: 10px;
}

.card-text:last-child {
  margin-bottom: 0;
}

.form-control {
  border: 1px solid #282727;
}

#spinner-border {
  width: 3rem;
  height: 3rem;
  color: #666;
}

.opinion {
  max-width: 400px;
  max-height: 23px;
  word-wrap: break-word;
  overflow: hidden;
}

.nombre {
  max-width: 400px;
  max-height: 45px;
  word-wrap: break-word;
  overflow: hidden;
}

.vmenu {
  max-height: 50px;
}

.descripVmenu {
  padding: 1rem;
  word-wrap: break-word;
  height: fit-content;
  max-height: 300px;
  max-width: 300px;
}

hr {
  background: rgb(0, 0, 0);
  height: 5px;
  border: 0;
  opacity: 1;
  width: 100%;
}

#logOut:hover {
  background-color: #ffffff;
  border-color: #000000;
}

#logOut:hover i.fas {
  color: #000000;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #eee;
  font-weight: bold;
}

td {
  word-wrap: break-word;
  overflow: hidden;
  max-width: 200px;
}

.modal-dialog {
  max-width: 750px;
  max-height: 800px;
}

#contenidoDescarga {
  max-width: 450px;
}

#modalDescarga {
  font-family: Arial, sans-serif;
  border-radius: 5px;
  padding: 20px;
  margin: 40px auto;
}

#modalDescarga .modal-content {
  padding: 20px;
}

#modalDescarga .modal-header {
  border: none;
  max-height: 20px
}

#buttony,
#buttonn {
  background-color: #4CAF50;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#buttony:hover,
#buttonn:hover {
  background-color: #3e8e41;
}

#inputBusqueda {
  width: 20%;
}

.logo-container {
  width: 50%;
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


/* Estilos media query */

@media screen and (max-width: 989px) and (min-width: 472px) {
  #contenedorTI {
    margin-top: 150px;
  }

  #inputBusqueda {
    width: 50%;
  }
}

@media screen and (max-width: 991px) {
  .logo-container {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .logo-container img {
    max-width: 80px;
    max-height: 80px;
  }

  .custom-toggler {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  #listaBotones {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
  }

  .card{
  min-width: 200px;
  }
}



@media screen and (max-width: 472px) {

  #contenedorTI {
    margin-top: 160px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: end;
  }

  #inputBusqueda {
    margin-top: 10px;
    width: 80%;
  }

  table {
    min-height: 100px;
  }

  th,
  td {
    overflow-x: auto;
    border: 1px solid #ccc;
    padding: 10px;
    min-width: 200px;
    /* Ajusta el valor según necesites */
    word-wrap: break-word;

    /* Permite que las palabras largas se ajusten */
  }
}
</style>