<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-7 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-start gap-6">
      <!-- Store Image -->
      <div
        class="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-gray-100 shadow-sm"
      >
        <img
          :src="store.image"
          alt="Foto Toko"
          class="h-full w-full object-cover object-center"
        />
      </div>

      <!-- Store Info -->
      <div class="flex-1">
        <div class="flex items-start justify-between">
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
              {{ store.name }}
            </h2>
            <span
              class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600"
            >
              {{ store.accountType }}
            </span>
          </div>
          <button
            @click="openModal"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            <span>Edit Profil</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>

        <!-- Store Details -->
        <div class="mt-6 flex flex-wrap gap-6">
          <!-- Alamat -->
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 text-red-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Alamat</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.address }}
              </p>
            </div>
          </div>

          <!-- Pemilik -->
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 text-blue-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Pemilik</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.owner }}
              </p>
            </div>
          </div>

          <!-- Telepon -->
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 text-green-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Telepon</p>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ store.phone }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edit -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900"
      >
        <h3 class="mb-4 text-lg font-semibold">Edit Profil</h3>

        <form @submit.prevent="saveChanges" class="space-y-4">
          <!-- Upload Foto -->
          <div>
            <label class="block text-sm font-medium">Foto Toko</label>
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
            <div v-if="form.image" class="mt-3">
              <img
                :src="form.image"
                alt="Preview Foto"
                class="h-24 rounded-lg object-cover"
              />
            </div>
          </div>

          <!-- Nama Toko -->
          <div>
            <label class="block text-sm font-medium">Nama Toko</label>
            <input
              v-model="form.name"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Tipe Akun -->
          <div>
            <label class="block text-sm font-medium">Tipe Akun</label>
            <input
              v-model="form.accountType"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Alamat -->
          <div>
            <label class="block text-sm font-medium">Alamat</label>
            <input
              v-model="form.address"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Pemilik -->
          <div>
            <label class="block text-sm font-medium">Pemilik</label>
            <input
              v-model="form.owner"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Telepon -->
          <div>
            <label class="block text-sm font-medium">Telepon</label>
            <input
              v-model="form.phone"
              type="text"
              class="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border px-4 py-2 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              class="rounded-lg bg-emerald-500 px-4 py-2 text-sm text-white"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

// data toko utama
const store = reactive({
  name: "Query Burger",
  accountType: "Akun Gratis",
  address: "Komplek Griya Ulin Permai, Jl. Asabri 2",
  owner: "Ridha Lesmana",
  phone: "083132047123",
  image: "/images/brand/brand-01.svg", // default foto toko
});

// modal state
const isModalOpen = ref(false);

// form edit (copy dari store)
const form = reactive({ ...store });

function openModal() {
  Object.assign(form, store); // reset form ke data asli
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function saveChanges() {
  Object.assign(store, form); // simpan perubahan ke store
  closeModal();
}

// handle upload foto toko
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      form.image = ev.target?.result as string; // simpan base64 preview
    };
    reader.readAsDataURL(file);
  }
}
</script>
