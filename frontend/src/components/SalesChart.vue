<template>

  <div class="sales-chart p-6 bg-white rounded-lg shadow-lg mb-6">

    <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Répartition des ventes par catégorie</h2>

    <div class="flex justify-center items-center">

      <!-- canvas de graphique en secteurs -->
      <canvas id="categoryChart" class="max-w-full h-72"></canvas>

    </div>

  </div>

</template>

<script lang="ts">

  import { defineComponent, onMounted, watch } from 'vue';
  import Chart from 'chart.js/auto';

  export default defineComponent({
    name: 'SalesChart',
    props: {
      categoryData: {
        type: Array,
        required: true,
      },
    },
    methods: {
      renderChart() {
        const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
        new Chart(ctx, {

          type: 'pie',
          data: {
            labels: this.categoryData.map((c: { category: string }) => c.category),
            datasets: [
              {
                label: 'Répartition des ventes',
                // Liste des pourcentages pour chaque catégorie
                data: this.categoryData.map((c: { percentage: number }) => c.percentage),
                backgroundColor: [
                  // couleurs utilisés pour le graphique en secteurs
                  '#FF6384', 
                  '#36A2EB', 
                  '#FFCE56', 
                  '#4BC0C0', 
                  '#9966FF', 
                ],
              },
            ],
          },
        });
      },
    },

    watch: {   //   mettre à jour le graphique dynamiquement.
      categoryData: 'renderChart',
    },

    onMounted() { this.renderChart(); },

  });


</script>


