<template>
  
  <div class="product-table p-6 bg-gray-50 rounded-lg shadow-lg">

    <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Liste des Produits</h2>
    
    <!-- le tableau des produits -->
    <table class="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md overflow-hidden">
  
      <thead class="bg-gray-100">

        <tr>

            <!-- tri de la colonne nom du produit -->
            <th
                @click="sortTable('name')"    
                class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                Nom du produit
                <span v-if="sortBy === 'name'">

                  <span v-if="sortOrder === 'asc'">↑</span>
                  <span v-if="sortOrder === 'desc'">↓</span>

                </span>

            </th>

            <!-- tri de la colonne Date de la première vente -->
            <th
              @click="sortTable('firstSaleDate')"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
              Date de la première vente
              <span v-if="sortBy === 'firstSaleDate'">

                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-if="sortOrder === 'desc'">↓</span>

              </span>
            </th>

            <!-- tri de la colonne Prix -->
            <th
              @click="sortTable('price')"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
              Prix (€)
              <span v-if="sortBy === 'price'">

                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-if="sortOrder === 'desc'">↓</span>

              </span>

            </th>

            <!-- tri de la colonne Nombre de ventes -->
            <th
              @click="sortTable('totalSales')"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
              Nombre de ventes
              <span v-if="sortBy === 'totalSales'">

                <span v-if="sortOrder === 'asc'">↑</span>
                <span v-if="sortOrder === 'desc'">↓</span>

              </span>

            </th>

        </tr>

      </thead>

      <tbody>

        <tr v-for="product in sortedProducts" :key="product.id" class="border-b hover:bg-gray-50">

          <td class="px-6 py-4 text-sm font-medium text-gray-700">{{ product.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(product.firstSaleDate) }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ formatPrice(product.price) }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ product.totalSales }}</td>

        </tr>
      </tbody>

    </table>

  </div>

</template>

<script lang="ts">

import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'ProductTable',
  setup() {
    const products = ref<any[]>([]);
    const sortBy = ref<string>('name');
    const sortOrder = ref<'asc' | 'desc'>('asc');

    const fetchProducts = async () => {

      try {
        const response = await fetch(`https://ecommerce-dashboard-i3dx.onrender.com/products`);
        products.value = await response.json();

      } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
      }

    };

    // methode pour le formatage de la date en format plus lisible (example : 28 novembre 2024)
    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    // Formatage du prix de type number en un montant avec la devise Euro (€).
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(price);
    };

    // Le Tri des colonnes
    const sortTable = (column: string) => {
      if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy.value = column;
        sortOrder.value = 'asc';
      }
    };

    //   Trier les produits en fonction de la colonne sélectionnée
    const sortedProducts = computed(() => {
      return [...products.value].sort((a, b) => {
        const aValue = a[sortBy.value];
        const bValue = b[sortBy.value];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return sortOrder.value === 'asc'
          ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
          : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      });
    });

    onMounted(() => {
      fetchProducts();
    });

    return {
      products, sortBy, sortOrder, formatDate, formatPrice, sortedProducts, sortTable,
    };
  },
});


</script>

