<template>
  <div class="calendar__wrapper">
    <div class="calendar-toggle" @click="toggleCalendar">
      📅 {{ formattedDateRange }}
    </div>

    <transition name="fade">
      <div v-if="isCalendarVisible" class="calendar">
        <div class="calendar__opts">
          <select v-model="selectedMonth" @change="updateCalendar">
            <option
              v-for="(month, index) in months"
              :key="index"
              :value="index"
            >
              {{ month }}
            </option>
          </select>

          <select v-model="selectedYear" @change="updateCalendar">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div class="calendar__body">
          <div class="calendar__days">
            <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
          </div>

          <div class="calendar__dates">
            <div
              v-for="(date, index) in calendarDates"
              :key="index"
              :class="[
                'calendar__date',
                {
                  'calendar__date--grey': date.isGrey,
                  'calendar__date--today': isToday(date),
                  'calendar__date--selected': isSelected(date),
                },
              ]"
              @click="selectDate(date, index)"
            >
              <span>{{ date.day }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const emit = defineEmits(["selectedDate", "selectedMonth", "selectedYear"]);

const months = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];
const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const years = [2024];

const isCalendarVisible = ref(false);
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());
const calendarDates = ref([]);
const selectedDate = ref(null);

onMounted(() => {
  updateYearsArray(years);
});

function toggleCalendar() {
  isCalendarVisible.value = !isCalendarVisible.value;
  updateCalendar();
}

const formattedDateRange = computed(() => {
  const startDate = new Date(selectedYear.value, selectedMonth.value, 1);
  const endDate = new Date(selectedYear.value, selectedMonth.value + 1, 1);
  return `${startDate.toLocaleDateString("uk-UA", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })} - ${endDate.toLocaleDateString("uk-UA", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })}`;
});

function updateYearsArray(years, baseYear = 2024) {
  const currentYear = new Date().getFullYear();

  for (let year = baseYear; year <= currentYear; year++) {
    if (!years.includes(year)) {
      years.push(year);
    }
  }

  return years;
}

function isToday(date) {
  const today = new Date();
  return (
    today.getDate() === date.day &&
    today.getMonth() === selectedMonth.value &&
    today.getFullYear() === selectedYear.value
  );
}

function isSelected(date) {
  return (
    selectedDate.value &&
    selectedDate.value.day === date.day &&
    selectedDate.value.month === selectedMonth.value &&
    selectedDate.value.year === selectedYear.value &&
    !date.isGrey
  );
}

function selectDate(date, index) {
  if (!date.isGrey) {
    selectedDate.value = {
      day: date.day,
      month: selectedMonth.value,
      year: selectedYear.value,
    };
  }

  emit(
    "selectedDate",
    selectedDate.value,
    selectedMonth.value,
    selectedYear.value
  );
}

function getMonthInfo(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const startDay = (firstDay.getDay() + 6) % 7;

  const dates = [];
  for (let i = startDay; i > 0; i--) {
    dates.push({ day: new Date(year, month, -i + 1).getDate(), isGrey: true });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push({ day, isGrey: false });
  }
  const nextDays = 7 - (dates.length % 7);
  if (nextDays < 7) {
    for (let i = 1; i <= nextDays; i++) {
      dates.push({ day: i, isGrey: true });
    }
  }

  return dates;
}

function updateCalendar() {
  calendarDates.value = getMonthInfo(selectedYear.value, selectedMonth.value);
  emit("selectedMonth", selectedYear.value, selectedMonth.value);
}
</script>

<style lang="scss" scoped>
.calendar {
  --side-padding: 20px;
  --border-radius: 34px;
  --accent-br: 15px;

  width: 400px;

  select {
    background-color: #f3f4f6;
    padding: 15px 20px;
  }

  &__opts,
  &__buttons {
    background-color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 15px;
  }

  &__opts {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    padding: 20px var(--side-padding);
  }

  &__body {
    background-image: linear-gradient(to bottom, #f3f4f6, #fff);
  }

  &__days {
    background-color: #fff;
    padding: 0 var(--side-padding) 10px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    & > div {
      text-align: center;
      font: {
        weight: 700;
        size: 1.02rem;
      }
      color: #c5c8ca;
    }
  }

  &__dates {
    padding: 10px var(--side-padding);
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  &__date {
    --height: calc(400px / 6 - var(--side-padding));

    text-align: center;
    height: var(--height);
    line-height: var(--height);

    font: {
      weight: 600;
      size: 1.02rem;
    }
    cursor: pointer;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      background-color: rgba(255, 255, 255, 0);
      width: 100%;
      height: calc(var(--height) * 0.9);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: var(--accent-br);
      transition: background-color 0.3s ease;
    }

    &:not(.calendar__date--selected):not(.calendar__date--grey):hover::before {
      background-color: #ededed;
    }

    &--today {
      color: #1752ff;
      font-weight: bold;

      &::before {
        background-color: rgba(23, 82, 255, 0.2);
      }
    }

    &--grey {
      color: #c5c8ca;
      cursor: not-allowed;
    }

    &--selected {
      color: #ff374b;

      &::before {
        background-color: #ffeaec;
        border-radius: var(--accent-br);
      }
    }

    &--first-date {
      &::before {
        border-top-left-radius: var(--accent-br);
        border-bottom-left-radius: var(--accent-br);
      }
    }

    &--last-date {
      &::before {
        border-top-right-radius: var(--accent-br);
        border-bottom-right-radius: var(--accent-br);
      }
    }

    &--range-start {
      &::after {
        content: "";
        position: absolute;
        bottom: 3px;
        border-radius: 24px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ff374b;
        width: 10px;
        height: 4px;
      }
    }

    &--range-end {
      color: #fff;

      &::before {
        box-shadow: 0 15px 20px -3px rgba(255, 55, 75, 0.35);
        background-color: #ff374b;
        border-radius: var(--accent-br);
        z-index: 1;
      }

      &::after {
        content: "";
        position: absolute;
        height: calc(var(--height) * 0.9);
        background-color: #ffeaec;
        width: 50px;
        top: 50%;
        right: 50%;
        transform: translateY(-50%);
      }
    }

    span {
      position: relative;
      z-index: 1;
    }
  }

  &__buttons {
    padding: 10px var(--side-padding) 20px;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }

  &__button {
    cursor: pointer;

    &--grey {
      background-color: #f3f4f6;
    }

    &--primary {
      background-color: #1752ff;
      color: #fff;
      transition: box-shadow 0.3s cubic-bezier(0.21, 0.68, 0.09, 0.27),
        transform 0.2s linear;

      &:hover {
        box-shadow: 0 20px 30px -13px rgba(23, 82, 255, 0.45);
        transform: translateY(-3px);
      }

      &:active {
        box-shadow: 0 10px 10px -6px rgba(23, 82, 255, 0.45);
        transform: translateY(-1px);
      }
    }
  }
}

body {
  display: grid;
  place-items: center;
  background-color: #eaedf2;
  height: 100vh;
  font: {
    family: "Nunito", sans-serif;
    size: 14px;
  }
  margin: 3vmin;
}

select,
button {
  font: {
    family: inherit;
    weight: 700;
    size: 1.02rem;
  }
  border-radius: 20px;
  outline: none;
  border: 0;
  padding: 15px 20px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select {
  background: {
    image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='960px' height='560px' viewBox='0 0 960 560' enable-background='new 0 0 960 560' xml:space='preserve'%3E%3Cg id='Rounded_Rectangle_33_copy_4_1_'%3E%3Cpath d='M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937 c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937 c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z'/%3E%3C/g%3E%3C/svg%3E");
    size: 24px;
    repeat: no-repeat;
    position: calc(100% - var(--side-padding)) center;
  }
}

.calendar-toggle {
  background-color: black;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  box-shadow: 10px 10px 29px -5px rgba(0, 0, 0, 0.75);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 426px) {
  .calendar {
    width: 300px;
  }

  select {
    background: {
      size: 0px;
    }
  }
}
</style>
