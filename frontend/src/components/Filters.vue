<template>

    <div class="filters mb-6 p-4 bg-white rounded-lg shadow-md">

      <label for="period" class="block text-gray-700 font-medium mb-2">Sélectionnez une période :</label>

      <!-- pris en charge du changement de la periode et mise à jour -->
      <select
        id="period"
        v-model="selectedPeriod"
        @change="update"
        class="block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="7d">7 derniers jours</option>
        <option value="30d">30 derniers jours</option>
        <option value="12m">12 derniers mois</option>

      </select>
    </div>

</template>

<script lang="ts">

  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    name: 'Filters',
    setup(props, { emit }) {
      const selectedPeriod = ref<string>('7d'); // la periode selectionné (variable réactive)

      //  mise à jour de la periode
      const update = () => {
        emit('update-period', selectedPeriod.value); 
      };

      return {
        selectedPeriod,
        update,
      };
    },
  });


</script>


