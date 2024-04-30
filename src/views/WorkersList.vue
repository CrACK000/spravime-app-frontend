<script setup lang="ts">
import { onActivated, onMounted, ref } from "vue"
import { useMeta } from "vue-meta"
import { useRoute, useRouter } from "vue-router"
import { useDialog } from "primevue/usedialog"
import account from "@/plugins/account"
import { FwbDropdown } from "flowbite-vue"
import SkeletonWorkers from "@/components/skeletons/SkeletonWorkers.vue"
import Container from "@/components/template/Container.vue"
import WorkersGrid from "@/components/views/workers/WorkersGrid.vue"
import WorkersNoResults from "@/components/views/workers/WorkersNoResults.vue"
import WorkersList from "@/components/views/workers/WorkersList.vue"
import WorkersListContainer from "@/components/views/workers/WorkersListContainer.vue"
import WorkerFilter from "@/components/dialogs/WorkerFilter.vue"
import Panel from "@/components/template/Panel.vue"
import PaginationContainer from "@/components/pagination/PaginationContainer.vue";
import PaginationArrow from "@/components/pagination/PaginationArrow.vue";
import PaginationPages from "@/components/pagination/PaginationPages.vue";
import PaginationButton from "@/components/pagination/PaginationButton.vue";

useMeta({ title: 'Vyhľadať si firmu alebo spoľahlivého majstra' })

const router  = useRouter()
const route   = useRoute()
const dialog  = useDialog()

const filteredWorkers = ref<User[]>([])
const filterData = ref<FilterWorkersData>({
  sortBy: '',
  orderBy: 'asc',
  list: localStorage.getItem('workerList') ?? 'list'
})
const workerSortByText = ref<string>('')

const perPage = ref(30) // Počet príspevkov na stránku
const currentPage = ref(1) // Aktuálna stránka
const totalPages = ref(0) // Celkový (počet) strán

const loadList = async () => {
  await account.all()
  filteredWorkers.value = account.data.accounts
}

const setSortList = (key: 'grid' | 'list') => {
  localStorage.setItem('workerList', key)
  filterData.value.list = key
}
const setOrderBy = () => {
  filterData.value.orderBy = (filterData.value.orderBy === 'asc') ? 'desc' : 'asc'
  const setQuery = { ...route.query, orderBy: filterData.value.orderBy }

  perPage.value = 30
  currentPage.value = 1
  totalPages.value = 0

  // zoradenia podľa hodnoty route.query.sortBy
  filteredWorkers.value.sort((a, b) => {
    const aValue = getSortByAttribute(a, route.query.sortBy ?? null)
    const bValue = getSortByAttribute(b, route.query.sortBy ?? null)

    if(typeof aValue === 'number' && typeof bValue === 'number') {
      return filterData.value.orderBy === 'asc' ? aValue - bValue : bValue - aValue
    } else {
      return filterData.value.orderBy === 'desc' ? bValue.toString().localeCompare(aValue.toString()) : aValue.toString().localeCompare(bValue.toString())
    }
  })

  if (route.name !== null)
    return router.push({ name: route.name, query: setQuery })
}
const setSortBy = (key: string, text: string) => {
  filterData.value.sortBy = key;
  const setQuery = { ...route.query, sortBy: filterData.value.sortBy };
  workerSortByText.value = `Zoradené podľa ${text}`;

  perPage.value = 30
  currentPage.value = 1
  totalPages.value = 0

  // Zoradenie pracovníkov podľa sortBy hodnôt
  if (filterData.value.sortBy) {
    filteredWorkers.value.sort((a, b) => {
      const aValue = getSortByAttribute(a, filterData.value.sortBy ?? null);
      const bValue = getSortByAttribute(b, filterData.value.sortBy ?? null);

      if(typeof aValue === 'number' && typeof bValue === 'number') {
        return bValue - aValue;  // Zoradenie čísel od najväčšieho po najmenšie
      } else {
        return aValue.toString().localeCompare(bValue.toString());  // Zoradenie reťazcov od A po Z
      }
    })
  }

  if (route.name !== null) {
    return router.push({ name: route.name, query: setQuery });
  }
}
const getSortByAttribute = function(user: User, attribute: any) {
  switch (attribute) {
    case 'title':
      return user.profile.name ?? user.username;
    case 'rating':
      return user.reviews.average_rating || 0;
    case 'review':
      return user.reviews.count_reviews || 0;
    case 'date':
      return user.created_at;
    default:
      return user.profile.name ?? user.username;
  }
}

const resetFilter = () => {
  filterData.value = {
    sortBy: '',
    orderBy: 'asc',
    list: String(localStorage.getItem('workerList'))
  }

  perPage.value = 30
  currentPage.value = 1
  totalPages.value = 0

  workerSortByText.value = ''
  loadList()

  if (route.name !== null)
    return router.push({ name: route.name, query: {} })
}
const showFilter = () => {
  dialog.open(WorkerFilter, {
    props: {
      header: 'Filtrovanie',
      contentClass: 'px-0 pb-0 md:px-6 md:pb-6',
      modal: true,
    },
    data: {
      query: route.query
    },
    onClose: (opt: any) => {
      if (opt.data) {
        if (!opt.data.cancelable) {
          console.log(opt.data)
          submitFilter(opt.data)
        }
      }
    }
  })
}

const removeDiacritics = (str: any) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
const submitFilter = (data: any) => {
  const { search, type, section, address, verify } = data

  perPage.value = 30
  currentPage.value = 1
  totalPages.value = 0

  let query: any = {}

  if (search !== '') query.search = search
  if (type !== 'none') query.type = type
  if (section !== 0) query.section = section
  if (address !== '') query.address = address
  if (verify !== false) query.verify = verify

  // Aktualizujeme query parametre trasy
  if (route.name !== null) {
    const originalQuery: any = { ...route.query };
    ['search', 'type', 'section', 'address', 'verify'].forEach((key) => {
      delete originalQuery[key]
    })

    router.replace({ name: route.name, query: { ...originalQuery, ...query } })
  }

  const searchFragments = search.toLowerCase().split(' ').map(removeDiacritics); // Remove diacritics from search
  const addressFragments = address.toLowerCase().split(' ').map(removeDiacritics); // Remove diacritics from address

  filteredWorkers.value = account.data.accounts.filter((worker: User) => {

    const usernameLowerCased = (removeDiacritics(worker.username ?? "")).toLowerCase(); // username
    const emailLowerCased = (removeDiacritics(worker.email ?? "")).toLowerCase(); // email
    const nameLowerCased = (removeDiacritics(worker.profile.name ?? "")).toLowerCase(); // Convert to lower case and remove diacritics from name
    const descriptionLowerCased = (removeDiacritics(worker.profile.description ?? "")).toLowerCase(); // Same for description
    const sloganLowerCased = (removeDiacritics(worker.profile.slogan ?? "")).toLowerCase(); // Same for slogan
    const addressLowerCased = (removeDiacritics(worker.profile.address ?? "")).toLowerCase(); // Same for address

    const isSearchMatch = searchFragments.some((fragment: any) =>
      usernameLowerCased.includes(fragment) ||
      emailLowerCased.includes(fragment) ||
      nameLowerCased.includes(fragment) ||
      descriptionLowerCased.includes(fragment) ||
      sloganLowerCased.includes(fragment)
    )

    const isAddressMatch = addressFragments.some((fragment: any) => addressLowerCased.includes(fragment))
    const isSectionMatch = section == 0 || (worker.profile.sections ?? []).includes(section)
    const isTypeMatch = type === 'none' || worker.profile.type === type
    const isVerified = !verify || worker.verify

    return isSearchMatch && isAddressMatch && isSectionMatch && isTypeMatch && isVerified
  })
}

const paginate = (items: any) => {
  totalPages.value = Math.ceil(items.length / perPage.value);
  return items.slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value);
}

onActivated(async () => {
  if (!Object.keys(route.query).length) {
    await resetFilter()
  }
})
onMounted(async () => {
  if (!localStorage.getItem('workerList')) {
    setSortList('list')
  }
  if (!filteredWorkers.value.length) {
    await loadList()
  }
})
</script>

<template>
  <Container>
    <div class="flex flex-col gap-y-6 lg:gap-y-8 mt-8 md:mt-0">

      <Panel>
        <div class="flex items-center justify-between">
          <fwb-dropdown>
            <template #trigger>
              <button type="button" class="px-3 md:px-5 py-2 text-xs md:text-sm text-gray-900 dark:text-gray-300 font-medium flex items-center gap-x-1">
                {{ filterData.sortBy ? workerSortByText : 'Zoradiť podľa' }}
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
                </svg>
              </button>
            </template>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 w-44">
              <li>
                <button type="button" @click="setSortBy('title', 'Názvu')" class="block w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Názvu</button>
              </li>
              <li>
                <button type="button" @click="setSortBy('rating', 'Hodnotenia')" class="block w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Hodnotenia</button>
              </li>
              <li>
                <button type="button" @click="setSortBy('review', 'Recenzií')" class="block w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Recenzií</button>
              </li>
              <li>
                <button type="button" @click="setSortBy('date', 'Najnovších')" class="block w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Najnovších</button>
              </li>
            </ul>
          </fwb-dropdown>
          <div>
            <div class="flex items-center divide-x divide-gray-200 dark:divide-gray-700/40">
              <div class="md:p-1" v-if="Object.keys(route.query).length">
                <button type="button" @click.prevent="resetFilter" v-tooltip.top="'Zrušiť všetky filtre'" class="py-1.5 md:py-2.5 px-2 md:px-3.5 text-gray-900 dark:text-gray-300">
                  <svg class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                  </svg>
                </button>
              </div>
              <div class="md:p-1">
                <button type="button" @click="showFilter" v-tooltip.top="'Zobraziť filter'" class="py-1.5 md:py-2.5 px-2 md:px-3.5 text-gray-900 dark:text-gray-300">
                  <svg class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                  </svg>
                </button>
              </div>
              <div class="md:p-1">
                <button type="button" @click="setOrderBy" v-tooltip.top="`Zoradiť ${filterData.orderBy === 'asc' ? 'vzostupne' : 'zostupne'}`" class="py-1.5 md:py-2.5 px-2 md:px-3.5 text-gray-900 dark:text-gray-300">
                  <svg class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 20V10m0 10-3-3m3 3 3-3m5-13v10m0-10 3 3m-3-3-3 3"/>
                  </svg>
                </button>
              </div>
              <div class="md:p-1">
                <button type="button" @click="setSortList('list')" v-tooltip.top="'Zoznam'" :class="{ 'hidden': filterData.list === 'list' }" class="py-1.5 md:py-2.5 px-2 md:px-3.5 text-gray-900 dark:text-gray-300">
                  <svg class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
                  </svg>
                </button>
                <button type="button" @click="setSortList('grid')" v-tooltip.top="'Boxy'" :class="{ 'hidden': filterData.list === 'grid' }" class="py-1.5 md:py-2.5 px-2 md:px-3.5 text-gray-900 dark:text-gray-300">
                  <svg class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <WorkersGrid v-if="filterData.list === 'grid'" :workers="paginate(filteredWorkers)"/>

      <WorkersListContainer v-if="filterData.list === 'list'">
        <SkeletonWorkers v-if="account.data.accounts_loading"/>
        <WorkersList v-else-if="filteredWorkers.length" :workers="paginate(filteredWorkers)"/>
        <WorkersNoResults v-else :workers="filteredWorkers"/>
      </WorkersListContainer>

      <PaginationContainer v-if="filteredWorkers.length > perPage">
        <PaginationPages>
          <PaginationArrow side="left" text="Späť" :disabled="currentPage <= 1" @click="currentPage--"/>
          <PaginationButton
            v-for="page in totalPages"
            :page="page"
            :key="page"
            :disabled="page === currentPage"
            @click="currentPage = page"
          />
          <PaginationArrow side="right" text="Ďalšie" :disabled="currentPage >= totalPages" @click="currentPage++"/>
        </PaginationPages>
      </PaginationContainer>

    </div>
  </Container>
</template>