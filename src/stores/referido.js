import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";

const modelo = "referido";
const estatus = ref("");
const validacion = ref("");
const nuevoReferido = ref("");
const referidoID = ref("");
const referidoNombre = ref("");

export const useStoreReferido = defineStore(
  modelo,
  () => {
    const referidos = ref([]);

    const getAll = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        referidos.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getPorId = async (id) => {
      try {
        const response = await axios.get(`${modelo}/buscarId/${id}`);
        referidoID.value = response;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getPorNombre = async (nombre) => {
      try {
        const response = await axios.get(`${modelo}/buscarNombre/${nombre}`);
        referidoNombre.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const agregar = async (data) => {
      try {
        const response = await axios.post(`${modelo}/registro`, data);
        estatus.value = response.status;
        nuevoReferido.value = response.data._id;
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
    };

    const editar = async (id, data) => {
      try {
        const response = await axios.put(`${modelo}/editar/${id}`, data);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const activar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/activar/${id}`);
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const inactivar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/inactivar/${id}`);
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    return {
      getAll,
      getPorId,
      getPorNombre,
      agregar,
      editar,
      activar,
      inactivar,
      referidos,
      estatus,
      validacion,
      nuevoReferido,
      referidoID,
    };
  },
  {
    persist: true,
  }
);
