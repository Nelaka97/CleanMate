<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          🏠 Apartment Cleaning Schedule
        </h1>
        <div class="bg-white rounded-lg shadow-md p-4 inline-block">
          <p class="text-lg text-gray-600 mb-2">
            Today: <span class="font-semibold text-indigo-600">{{ formatDate(today) }}</span>
          </p>
          <p class="text-sm text-gray-500">
            Week {{ weekNumber }} ({{ formatDate(weekStart) }} - {{ formatDate(weekEnd) }})
          </p>
        </div>
      </div>

      <!-- Weekly Schedule Overview -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
          📅 This Week's Task Schedule:
        </h2>

          <p class="text-sm font-semibold text-gray-500 mb-6">({{ formatDate(weekStart) }} - {{ formatDate(weekEnd) }})</p>

        <div class="grid md:grid-cols-7 gap-2 mb-6">
          <div v-for="day in weekDays" :key="day.date" class="text-center p-3 rounded-lg border" :class="{
            'bg-indigo-100 border-indigo-300': isToday(day.date),
            'bg-gray-50 border-gray-200': !isToday(day.date)
          }">
            <div class="font-semibold text-sm text-gray-700">{{ day.name }}</div>
            <div class="text-xs text-gray-500">{{ day.date.getDate() }}</div>
            <div class="mt-2 space-y-1">
              <div v-for="task in getTasksForDay(day.name)" :key="task"
                class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {{ task }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Assignments by Person -->
      <div class="grid lg:grid-cols-3 gap-6 mb-8">
        <div v-for="assignment in assignments" :key="assignment.person"
          class="bg-white rounded-xl shadow-lg p-6 border-l-4" :class="{
            'border-blue-500': assignment.person === 'Nelaka',
            'border-green-500': assignment.person === 'Isuru',
            'border-purple-500': assignment.person === 'Shehan'
          }">
          <div class="flex items-center mb-6">
            <img :src="`/images/${assignment.person.toLowerCase()}.jpg`" :alt="`${assignment.person}'s profile`"
              class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md mr-4" />
            <div>
              <h3 class="text-xl font-semibold text-gray-800">{{ assignment.person }}</h3>
              <p class="text-sm text-gray-500">
                Workload: {{ getWorkloadLevel(assignment.totalComplexity) }}
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="task in assignment.tasks" :key="task.name + task.deadline" class="p-3 rounded-lg border-l-4"
              :class="{
                'bg-red-50 border-red-400': task.complexity === 'hard',
                'bg-yellow-50 border-yellow-400': task.complexity === 'medium',
                'bg-green-50 border-green-400': task.complexity === 'easy'
              }">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-800">{{ task.name }}</h4>
                <span class="text-xs px-2 py-1 rounded-full" :class="{
                  'bg-red-100 text-red-800': task.complexity === 'hard',
                  'bg-yellow-100 text-yellow-800': task.complexity === 'medium',
                  'bg-green-100 text-green-800': task.complexity === 'easy'
                }">
                  {{ task.complexity }}
                </span>
              </div>
              <div class="text-sm text-gray-600 mb-1">
                📅 Due: {{ formatDeadline(task.deadline) }}
              </div>
              <div class="text-xs text-gray-500">
                {{ task.frequency }}
              </div>
              <div v-if="isOverdue(task.deadline)" class="text-xs text-red-600 font-medium mt-1">
                ⚠️ Overdue
              </div>
              <div v-else-if="isDueToday(task.deadline)" class="text-xs text-orange-600 font-medium mt-1">
                📍 Due today
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Summary -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          📊 Weekly Task Summary
        </h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ taskCounts.hard }}</div>
            <div class="text-sm text-red-800">Hard Tasks</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ taskCounts.medium }}</div>
            <div class="text-sm text-yellow-800">Medium Tasks</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ taskCounts.easy }}</div>
            <div class="text-sm text-green-800">Easy Tasks</div>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="bg-gray-800 text-white py-6 mt-12">
        <div class="max-w-6xl mx-auto px-4 text-center">
          <p class="text-sm text-gray-300 mb-2">
            © {{ new Date().getFullYear() }} All rights reserved
          </p>
          <p class="text-sm text-gray-400">
            Developed and maintained by
            <a href="https://github.com/nelaka97" target="_blank" rel="noopener noreferrer"
              class="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium">
              Nelaka Kannangara
            </a>
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Apartment Cleaning Schedule'
})

// Task definitions with frequency and complexity
const taskDefinitions = [
  { name: 'Clean Bathroom', frequency: 'weekly', complexity: 'hard', days: ['Sunday'] },
  { name: 'Clean Kitchen', frequency: 'twice a week', complexity: 'hard', days: ['Sunday', 'Wednesday'] },
  { name: 'Trash Clean', frequency: 'thrice a week', complexity: 'easy', days: ['Sunday', 'Wednesday', 'Friday'] },
  { name: 'Mop kitchen Floor', frequency: 'weekly', complexity: 'medium', days: ['Sunday'] },
  { name: 'Clean Common Areas', frequency: 'twice a week', complexity: 'easy', days: ['Sunday', 'Wednesday'] },
  { name: 'Clean Refrigerator', frequency: 'weekly', complexity: 'medium', days: ['Sunday'] }
]

// Roommates
const roommates = ['Nelaka', 'Isuru', 'Shehan']

// Reactive data
const today = ref(new Date())
const assignments = ref([])
const taskCounts = ref({ hard: 0, medium: 0, easy: 0 })

// Computed properties
const weekStart = computed(() => {
  const date = new Date(today.value)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(date.setDate(diff))
})

const weekEnd = computed(() => {
  const date = new Date(weekStart.value)
  return new Date(date.setDate(date.getDate() + 6))
})

const weekNumber = computed(() => {
  const start = new Date(today.value.getFullYear(), 0, 1)
  const diff = today.value - start
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))
})

const weekDays = computed(() => {
  const days = []
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart.value)
    date.setDate(date.getDate() + i)
    days.push({
      name: dayNames[i],
      date: date
    })
  }
  return days
})

// Helper functions
const isToday = (date) => {
  return date.toDateString() === today.value.toDateString()
}

const isDueToday = (deadline) => {
  return deadline.toDateString() === today.value.toDateString()
}

const isOverdue = (deadline) => {
  return deadline < today.value && !isDueToday(deadline)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const formatDeadline = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const getTasksForDay = (dayName) => {
  return taskDefinitions
    .filter(task => task.days.includes(dayName))
    .map(task => task.name.split(' ').slice(0, 2).join(' '))
}

const getWorkloadLevel = (complexity) => {
  if (complexity >= 8) return 'Heavy'
  if (complexity >= 5) return 'Medium'
  return 'Light'
}

const getComplexityScore = (complexity) => {
  switch (complexity) {
    case 'hard': return 3
    case 'medium': return 2
    case 'easy': return 1
    default: return 1
  }
}

// Generate weekly tasks with deadlines
const generateWeeklyTasks = () => {
  const tasks = []

  taskDefinitions.forEach(taskDef => {
    taskDef.days.forEach(dayName => {
      const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayName)
      const deadline = new Date(weekStart.value)
      deadline.setDate(deadline.getDate() + dayIndex)

      tasks.push({
        ...taskDef,
        deadline
      })
    })
  })

  return tasks
}

// Fair assignment algorithm considering complexity and rotation
const assignTasksFairly = () => {
  const tasks = generateWeeklyTasks()
  const weekOffset = weekNumber.value % roommates.length

  // Sort tasks by complexity (hardest first) and then by deadline
  tasks.sort((a, b) => {
    const complexityOrder = { 'hard': 3, 'medium': 2, 'easy': 1 }
    if (complexityOrder[a.complexity] !== complexityOrder[b.complexity]) {
      return complexityOrder[b.complexity] - complexityOrder[a.complexity]
    }
    return a.deadline - b.deadline
  })

  // Initialize assignments
  const roommateAssignments = roommates.map((person, index) => ({
    person,
    tasks: [],
    totalComplexity: 0,
    index: (index + weekOffset) % roommates.length
  }))

  // Assign tasks fairly
  tasks.forEach((task, taskIndex) => {
    // Find the person with the least workload, considering rotation
    const sortedByWorkload = roommateAssignments
      .sort((a, b) => {
        if (a.totalComplexity !== b.totalComplexity) {
          return a.totalComplexity - b.totalComplexity
        }
        return (a.index + taskIndex) % roommates.length - (b.index + taskIndex) % roommates.length
      })

    const assignee = sortedByWorkload[0]
    assignee.tasks.push(task)
    assignee.totalComplexity += getComplexityScore(task.complexity)
  })

  // Count tasks by complexity
  let hardCount = 0, mediumCount = 0, easyCount = 0
  tasks.forEach(task => {
    if (task.complexity === 'hard') hardCount++
    else if (task.complexity === 'medium') mediumCount++
    else easyCount++
  })

  taskCounts.value = { hard: hardCount, medium: mediumCount, easy: easyCount }

  return roommateAssignments.sort((a, b) => a.person.localeCompare(b.person))
}

// Initialize assignments on component mount
onMounted(() => {
  assignments.value = assignTasksFairly()
})
</script>