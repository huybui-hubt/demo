<template>
  <div class="w-full p-6">
    <div class="header flex items-center mb-12">
      <div class="title text-lg font-semibold">KPI</div>
    </div>

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
            ></td>
            <td
              class="flex items-center border-r border-black px-2"
              :style="{ width: table.header[1].width }"
            ></td>
            <td
              class="flex items-center border-r border-black px-2"
              :style="{ width: table.header[2].width }"
            ></td>
            <td
              class="flex items-center border-r border-black px-2"
              :style="{ width: table.header[3].width }"
            ></td>
            <td
              class="flex items-center border-r border-black px-2"
              :style="{ width: table.header[4].width }"
            ></td>
            <td
              class="flex items-center border-r border-black px-2"
              :style="{ width: table.header[5].width }"
            ></td>
            <td
              class="flex items-center px-2"
              :style="{ width: table.header[6].width }"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const FILTER_DEFAULT = Object.freeze({
  name: '',
  salesman: [],
  businessLine: [],
  startAt: '',
  endAt: '',
})

export default {
  name: 'KPI',
  data() {
    return {
      isLoading: false,
      table: {
        header: [
          { title: 'Business Line', width: '20%' },
          { title: 'Salesman', width: '20%' },
          { title: 'Month', width: '10%' },
          { title: 'Value', width: '20%' },
          { title: 'Created At', width: '10%' },
          { title: 'Updated At', width: '10%' },
          { title: 'Actions', width: '10%' },
        ],
      },
      filter: Object.assign({}, FILTER_DEFAULT),

      units: [],
      totalUnits: 0,
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
  methods: {
    async loadData() {
      this.isLoading = true

      const response = await this.$axios.get('/api/kpi', {
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
  },
}
</script>

<style></style>
