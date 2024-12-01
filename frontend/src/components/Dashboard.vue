<template>
  <!-- Tableau de Bord -->
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">

    <h1 class="text-7xl font-bold text-gray-800 text-center">Tableau de Bord</h1>

    <Filters @update-period="updatePeriod" />

   
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

         <!-- Ventes totales -->
        <div class="bg-gray-500 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">

          <h2 class="text-3xl font-semibold text-center text-white mb-6">
              Ventes totales
          </h2>

          <p class="text-4xl font-bold text-[#FFD700]">
              {{ formattedTotalSalesEUR }}
          </p>

        </div>

        <!-- Produits les plus vendus -->
        <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">

            <TrendingProducts :products="trendingProducts" />

        </div>

    </div>

    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Répartition des ventes par catégorie -->
        <div class="bg-white p-6 rounded-lg shadow-lg">

          <SalesChart :categoryData="categorySales" />

        </div>

        <!-- Histogramme des ventes par produit -->
        <div class="bg-white p-6 rounded-lg shadow-lg">

          <SalesHistogram />

        </div>

    </div>

    <!-- Liste des Produits -->
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <ProductTable />
    </div>

  </div>

</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  // Les composants intégrés au tableau de bord.
  import Filters from './Filters.vue';
  import SalesChart from './SalesChart.vue';
  import TrendingProducts from './TrendingProducts.vue';
  import SalesHistogram from './SalesHistogram.vue';
  import ProductTable from './ProductTable.vue';

  export default defineComponent({
    name: 'Dashboard',
    components: { Filters, SalesChart, TrendingProducts, SalesHistogram, ProductTable },
    setup() {

      const totalSales = ref<number>(0);            // les ventes totales en fonction de la période
      const trendingProducts = ref<any[]>([]);            //  liste des 3 produits les plus vendus
      const categorySales = ref<any[]>([]);              //  répartition des ventes par catégorie


      // Chargement des données statiques des produits les plus vendus
      const loadStaticData = async () => {

        try {
          const productsResponse = await fetch(`/api/analytics/trending_products`);
          trendingProducts.value = await productsResponse.json();  

          //   et des ventes par catégorie
          const categoryResponse = await fetch(`/api/analytics/category_sales`);
          categorySales.value = await categoryResponse.json();  

        } catch (error) {
          console.error(" Erreur lors de la récupération des données:", error);
        }

      };


      //  on met à jour les ventes totales en fonction de la période sélectionnée via l'API GET /analytics/total_sales
      const updatePeriod = async (period: string) => {
        const salesResponse = await fetch(`/api/analytics/total_sales?period=${period}`);
        const salesData = await salesResponse.json();
        totalSales.value = salesData.total;  
      };

      //  on formate la variable totalSales en une devise locale (EUR) avec un formatage français (fr-FR)
      const formattedTotalSalesEUR = computed(() =>
        new Intl.NumberFormat(
          'fr-FR', 
        { 
          style: 'currency', 
          currency: 'EUR' 
        })
        .format(totalSales.value)
      );

      onMounted(() => {
        loadStaticData();
      });

      return {
        totalSales, trendingProducts, categorySales, updatePeriod, formattedTotalSalesEUR,
      };
    },
  });

</script>

