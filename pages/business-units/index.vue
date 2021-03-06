<template>
  <div class="w-full p-6">
    <Header @create="onCreateNewBranch"></Header>

    <div class="toolbar flex items-center mb-12">
      <div
        class="search flex border border-gray-300 px-2 py-1 rounded-full mr-4"
      >
        <svg
          class="search-icon w-6 h-6 text-gray-400 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          v-model="filter.name"
          class="outline-none"
          type="text"
          placeholder="Search by name..."
        />
      </div>

      <select
        v-model="filter.status"
        class="border border-gray-300 p-1 outline-none mr-4"
        @change="loadData"
      >
        <option disabled value="">Status</option>
        <option
          v-for="option in options.status"
          :key="'option-' + option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>

      <button
        class="flex items-center bg-gray-300 px-4 py-1 rounded mr-4 outline-none"
        @click="refreshFilter"
      >
        <svg
          class="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        <span>Refresh</span>
      </button>
      <button
        class="flex items-center bg-gray-300 px-4 py-1 rounded mr-4 outline-none"
        @click="clearFilter"
      >
        <svg
          class="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          ></path>
        </svg>
        <span>Clear</span>
      </button>
    </div>

    <div class="list-item border border-black">
      <table class="text-left w-full">
        <thead class="bg-gray-300 flex w-full">
          <tr class="flex w-full">
            <th
              v-for="(header, index) in table.header"
              :key="'header' + index"
              :style="{ width: header.width }"
              class="flex items-center text-left px-2 h-12 border-r border-black last:border-r-0"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>

        <tbody
          class="bg-grey-light flex flex-col overflow-y-scroll w-full h-96"
        >
          <tr
            v-for="unit in formatedUnits"
            :key="'unit-' + unit.id"
            class="flex w-full h-12 group odd:bg-gray-100 hover:bg-gray-200"
          >
            <td
              class="flex items-center border-r border-black px-2"
              :style="{ width: table.header[0].width }"
            >
              <span v-if="!unit.isClone">{{ unit.name }}</span>
            </td>
            <td
              class="flex items-center border-r border-black px-2"
              :style="{ width: table.header[1].width }"
            >
              <div
                v-if="!unit.isClone"
                class="flex justify-between items-center"
              >
                <div
                  class="w-10 h-6 flex items-center bg-gray-300 cursor-pointer rounded-full p-1 duration-300 ease-in-out"
                  :class="{ 'bg-green-400': Boolean(unit.status) }"
                  @click="onChangeBranchStatus(unit)"
                >
                  <div
                    class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
                    :class="{ 'translate-x-4': Boolean(unit.status) }"
                  ></div>
                </div>
              </div>
            </td>
            <td
              class="flex items-center px-2"
              :style="{ width: table.header[2].width }"
            >
              <svg
                v-if="!unit.isClone"
                class="edit-icon w-6 h-6 text-transparent group-hover:text-gray-500 mx-auto cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                @click="onEditBranch(unit)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination flex items-center justify-end w-full h-12 mt-10">
      <div class="rows-per-page flex items-center">
        <span class="text-sm mr-2">Rows per page</span>
        <select v-model="filter.limit" class="border border-gray-300 px-2 py-1">
          <option
            v-for="(option, index) in options.pagination.rowsPerpage"
            :key="'rows-per-page-' + index"
            :value="option.value"
          >
            {{ option.value }}
          </option>
        </select>
      </div>

      <div class="text-sm mx-2 text-right">{{ currentUnits }}</div>

      <button class="mr-2" @click="goToPrevPage">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>
      <button @click="goToNextPage">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>

    <Drawer :active="drawer.visible" @hide="drawer.visible = false">
      <template #header>
        <div class="text-lg font-bold">{{ drawer.title }}</div>
      </template>
      <template #body>
        <div class="flex flex-col mb-8">
          <span class="mb-1">Name</span>
          <input
            v-model="currentUnit.name"
            class="border border-black px-2 py-1"
            type="text"
          />
        </div>
        <div class="flex flex-col mb-8">
          <span class="mb-1">Is Active</span>
          <div class="inline-flex justify-between items-center">
            <div
              class="w-10 h-6 flex items-center bg-gray-300 cursor-pointer rounded-full p-1 duration-300 ease-in-out"
              :class="{ 'bg-green-400': Boolean(currentUnit.status) }"
              @click="onChangeCurrentUnitStatus()"
            >
              <div
                class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
                :class="{ 'translate-x-4': Boolean(currentUnit.status) }"
              ></div>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded"
            @click="isCreate ? onSaveNewBranch() : onUpdateBranchInfo()"
          >
            {{ isCreate ? 'Create' : 'Save' }}
          </button>
        </div>
      </template>
      <template #footer></template>
    </Drawer>
  </div>
</template>

<script>
import Drawer from '@/components/Drawer.vue'
import Header from './-header.vue'

const FILTER_DEFAULT = Object.freeze({
  name: '',
  status: '',
  page: 1,
  limit: 20,
})

export default {
  name: 'BusinessUnits',
  components: { Header, Drawer },
  data() {
    return {
      isLoading: true,
      table: {
        header: [
          { title: 'Name', width: '85%' },
          { title: 'Is Active', width: '10%' },
          { title: 'Edit', width: '5%' },
        ],
      },
      options: {
        status: [
          { text: 'Active', value: 1 },
          { text: 'Inactive', value: 0 },
        ],
        pagination: {
          rowsPerpage: [{ value: 10 }, { value: 20 }, { value: 50 }],
        },
      },
      filter: Object.assign({}, FILTER_DEFAULT),
      units: [],
      totalUnits: 0,

      inputNameHandler: null,
      drawer: {
        visible: false,
        title: '',
      },
      isCreate: false,
      currentUnit: {},
    }
  },
  computed: {
    formatedUnits() {
      if (this.units.length >= 8) return this.units

      const numDiff = 8 - this.units.length
      const cloneUnits = []

      for (let i = 0; i < numDiff; i++) {
        cloneUnits.push({ id: Date.now() + i, isClone: true })
      }

      return [...this.units, ...cloneUnits]
    },
    currentUnits() {
      const { filter } = this

      const firstUnitIndex =
        filter.page === 1 ? 1 : (filter.page - 1) * filter.limit + 1
      const lastUnitIndex =
        filter.page === 1 ? filter.limit : filter.page * filter.limit

      return `${firstUnitIndex}-${lastUnitIndex} of ${this.totalUnits}`
    },
  },
  watch: {
    'filter.name': {
      handler() {
        this.inputNameHandler && clearTimeout(this.inputNameHandler)
        this.inputNameHandler = null

        this.inputNameHandler = setTimeout(() => {
          this.loadData()
        }, 500)
      },
    },
    'filter.page': {
      handler() {
        this.loadData()
      },
    },
    'filter.limit': {
      handler() {
        this.filter.page = 1
        this.loadData()
      },
    },
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true

      const response = await this.$axios.get('/api/branchs', {
        params: this.filter,
      })
      this.isLoading = false

      if (response.status === 200) {
        this.units = response.data.units
        this.totalUnits = response.data?._metaData?.total
      }
    },
    async refreshFilter() {
      await this.loadData()
    },
    async clearFilter() {
      this.filter = Object.assign({}, FILTER_DEFAULT)
      await this.loadData()
    },
    async goToPrevPage() {
      const { filter } = this
      if (filter.page === 1) return

      filter.page--

      await this.loadData()
    },
    async goToNextPage() {
      const { filter, totalUnits } = this
      if (filter.page * filter.limit < totalUnits) {
        filter.page++
        await this.loadData()
      }
    },
    onCreateNewBranch() {
      this.isCreate = true
      this.drawer.title = 'Create business unit'
      this.drawer.visible = true
      this.currentUnit = { name: '', status: 1 }
    },
    onEditBranch(unit) {
      this.isCreate = false
      this.currentUnit = JSON.parse(JSON.stringify(unit))
      this.drawer.title = 'Edit business unit'
      this.drawer.visible = true
    },
    async onChangeBranchStatus(unit) {
      const newStatus = !unit.status

      const response = await this.$axios.put(`/api/branchs/${unit.id}`, {
        status: newStatus,
      })

      if (response.status === 200) {
        unit.status = newStatus
      }
    },
    onChangeCurrentUnitStatus() {
      if (this.isCreate) return

      this.currentUnit.status = !this.currentUnit.status
    },
    async onSaveNewBranch() {
      const { name, status } = this.currentUnit

      await this.$axios.post('/api/branchs', {
        name,
        status,
      })

      this.drawer.visible = false
    },
    async onUpdateBranchInfo() {
      const { id, name, status } = this.currentUnit

      await this.$axios.put(`/api/branchs/${id}`, {
        name,
        status,
      })

      this.drawer.visible = false
    },
  },
}
</script>

<style scoped></style>
