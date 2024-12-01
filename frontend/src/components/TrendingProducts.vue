<template>
  <!-- Produits les plus vendus sous forme de tableau -->
  <div class="trending-products p-6 bg-gray-50 rounded-lg shadow-lg">

      <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Produits les plus vendus</h2>

      <!-- afficher un message  si la liste des produits est vide. -->
      <p v-if="products.length === 0" class="text-center text-gray-500">Aucun produit n'est disponible.</p>


      <!--  sinon afficher le(s) produit(s)  -->
      <table v-if="products.length > 0" class="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md overflow-hidden">

        <thead class="bg-gray-100">

          <tr>

              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Nom du produit
              </th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Nombre de ventes
              </th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Totale de ventes (€)
              </th>

          </tr>

        </thead>

        <tbody>
          <!--  boucle d'affichage des produits -->
          <tr v-for="product in products" :key="product.name" class="border-b hover:bg-gray-50">

              <td class="px-6 py-4 text-sm font-medium text-gray-700"> {{ product.name }} </td>
              <td class="px-6 py-4 text-sm text-gray-600"> {{ product.quantity }} </td>
              <td class="px-6 py-4 text-sm text-gray-600"> {{ formatCurrency(product.totalSales) }} </td>

          </tr>

        </tbody>

      </table>

  </div>

</template>

<script lang="ts">

  import { defineComponent, PropType } from 'vue';

  interface Product {
    name: string;
    quantity: number;     //   quantité vendue pour un produit
    totalSales: number;  //  Somme des ventes réalisées pour une période sélectionnée
  }

  export default defineComponent({
    name: 'TrendingProducts',
    props: {
      products: {
        //  typer la propriété products comme un tableau d'objets de type Product
        type: Array as PropType<Product[]>,
        required: true,
      },
    },
    methods: {
      //   Formate les valeurs numériques en une chaîne représentant un montant en euros 
      formatCurrency(value: number): string {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
      },
    },
  });


</script>


