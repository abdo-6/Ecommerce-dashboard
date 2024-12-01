<template>

  <div class="sales-histogram p-6 bg-white rounded-lg shadow-lg mb-6">

    <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Histogramme des ventes par produit</h2>

    <div class="flex justify-center items-center">

      <!-- canvas de l'histogramme pour illustrer les ventes par produit. -->
      <canvas ref="chartCanvas" class="w-full h-192 max-w-6xl"></canvas>

    </div>

  </div>

</template>

<script lang="ts">

  import { defineComponent, ref, onMounted } from 'vue';
  import { Chart } from 'chart.js';
  import { BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

  //  enregistrement des éléments nécessaires pour Chart.js
  Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

  export default defineComponent({
    name: 'SalesHistogram',
    setup() {
      const chartCanvas = ref<HTMLCanvasElement | null>(null);

      const loadSalesData = async () => {

        const response = await fetch(`/api/products`);
        const products = await response.json();

        const chartData = {
          labels: products.map((product: { name: string }) => product.name),
          datasets: [{
            label: 'Ventes',
            data: products.map((product: { totalSales: number }) => product.totalSales),
            backgroundColor: '#42A5F5', //   couleur des barres
            borderColor: '#1E88E5',    //    bordure des barres
            borderWidth: 1
          }]
        };

        const chartOptions = {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Ventes par produit'
            },
            legend: {
              position: 'top'
            }
          }
        };

        if (chartCanvas.value) {
          new Chart(chartCanvas.value, {
            type: 'bar',
            data: chartData,   
            options: chartOptions
          });
        }
      };

      onMounted(() => { loadSalesData(); });  

      return {
        chartCanvas
      };
      
    }
  });


</script>

