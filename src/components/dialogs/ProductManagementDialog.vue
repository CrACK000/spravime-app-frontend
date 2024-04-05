<script setup lang="ts">
import {inject, onMounted, ref} from "vue"
import PanelFormActions from "@/components/template/PanelFormActions.vue"
import InputContainer from "@/components/template/InputContainer.vue";
import InputLabel from "@/components/template/InputLabel.vue";
import TextareaLabel from "@/components/template/TextareaLabel.vue";

const dialogRef = inject('dialogRef') as { value: any }
const productData = () => {
  if (dialogRef.value.data.productData) {
    form.value = dialogRef.value.data.productData as Product
  }
}

const form = ref<Product>({
  title: '',
  description: '',
  price: '',
  image: ''
})

const onFileChange = (e: any) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      form.value.image = e.target.result as string;
    }
  }
  reader.readAsDataURL(file)
}

const submitForm = () => {
  closeDialog(form.value)
}

const closeDialog = (callback: any) => {
  dialogRef.value.close(callback)
}

onMounted(() => {
  productData()
})

</script>

<template>
  <form @submit.prevent="submitForm" class="w-full md:w-96">

    <InputContainer class="mb-4 md:mb-6 p-4 md:p-0">
      <div>
        <div class="flex items-center justify-between gap-x-2">
          <label for="image" class="form-secondary-button">Nahrať obrázok produktu</label>
          <div class="aspect-[4/3] w-16">
            <img v-if="form.image" :src="form.image" alt="Preview" class="max-w-full max-h-full rounded-md"/>
            <div v-else class="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-md flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="text-xs opacity-75 mt-2">
          Minimálny rozmer 640×480 v pomere strán 4/3.
        </div>
        <input type="file" id="image" hidden @change="onFileChange"/>
      </div>
      <InputLabel
        type="text"
        label-key="productTitle"
        label="Názov produktu"
        v-model="form.title"
      />
      <InputLabel
        type="number"
        label-key="productPrice"
        label="Cena produktu"
        v-model="form.price"
        placeholder="€"
      />
      <TextareaLabel
        label-key="productDescription"
        label="Krátky popis"
        v-model="form.description"
      />
    </InputContainer>

    <panel-form-actions class="md:-mx-6 md:-mb-6">
      <template #left>
        <button type="reset" @click="closeDialog" class="form-secondary-button-sm">
          <i class="fa-solid fa-xmark me-1"></i> Zatvoriť
        </button>
      </template>
      <template #right>
        <button type="submit" class="form-button-sm">
          <i class="fa-solid fa-plus me-1"></i>
          Pridať
        </button>
      </template>
    </panel-form-actions>

  </form>
</template>