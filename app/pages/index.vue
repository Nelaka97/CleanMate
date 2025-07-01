<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          🏠 Apartment Cleaning Tasks
        </h1>
        <p class="text-lg text-gray-600">
          Fair assignment of cleaning tasks for roommates
        </p>
      </div>

      <!-- Assignment Button -->
      <div class="text-center mb-12">
        <button
          @click="assignTasks"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          🎲 Assign Cleaning Tasks
        </button>
      </div>

      <!-- Task Assignments -->
      <div v-if="assignments.length > 0" class="grid md:grid-cols-3 gap-6 mb-8">
        <div
          v-for="assignment in assignments"
          :key="assignment.person"
          class="bg-white rounded-xl shadow-lg p-6 border-l-4"
          :class="{
            'border-blue-500': assignment.person === 'Nelaka',
            'border-green-500': assignment.person === 'Isuru',
            'border-purple-500': assignment.person === 'Shehan'
          }"
        >
          <div class="flex items-center mb-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4"
              :class="{
                'bg-blue-500': assignment.person === 'Nelaka',
                'bg-green-500': assignment.person === 'Isuru',
                'bg-purple-500': assignment.person === 'Shehan'
              }"
            >
              {{ assignment.person.charAt(0) }}
            </div>
            <h3 class="text-xl font-semibold text-gray-800">
              {{ assignment.person }}
            </h3>
          </div>
          
          <div class="space-y-2">
            <div
              v-for="task in assignment.tasks"
              :key="task"
              class="flex items-center p-2 bg-gray-50 rounded-lg"
            >
              <span class="text-sm mr-2">✓</span>
              <span class="text-gray-700">{{ task }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignment History -->
      <div v-if="assignmentHistory.length > 0" class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          📋 Assignment History
        </h3>
        <div class="space-y-3">
          <div
            v-for="(history, index) in assignmentHistory.slice().reverse()"
            :key="index"
            class="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300"
          >
            <div class="text-sm text-gray-500 mb-2">
              {{ formatDate(history.timestamp) }}
            </div>
            <div class="grid md:grid-cols-3 gap-4 text-sm">
              <div v-for="assignment in history.assignments" :key="assignment.person">
                <strong class="text-gray-700">{{ assignment.person }}:</strong>
                <span class="text-gray-600 ml-1">{{ assignment.tasks.join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Apartment Cleaning Tasks'
})

// Reactive data
const assignments = ref([])
const assignmentHistory = ref([])

// Available cleaning tasks
const cleaningTasks = [
  'Vacuum living room',
  'Clean bathroom',
  'Wash dishes',
  'Take out trash',
  'Mop kitchen floor',
  'Clean windows',
  'Dust furniture',
  'Organize common areas',
  'Clean refrigerator'
]

// Roommates
const roommates = ['Nelaka', 'Isuru', 'Shehan']

// Function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Function to assign tasks
const assignTasks = () => {
  const shuffledTasks = shuffleArray(cleaningTasks)
  const tasksPerPerson = Math.ceil(shuffledTasks.length / roommates.length)
  
  const newAssignments = roommates.map((person, index) => {
    const startIndex = index * tasksPerPerson
    const endIndex = Math.min(startIndex + tasksPerPerson, shuffledTasks.length)
    return {
      person,
      tasks: shuffledTasks.slice(startIndex, endIndex)
    }
  })
  
  assignments.value = newAssignments
  
  // Add to history
  assignmentHistory.value.push({
    timestamp: new Date(),
    assignments: [...newAssignments]
  })
  
  // Keep only last 5 assignments in history
  if (assignmentHistory.value.length > 5) {
    assignmentHistory.value = assignmentHistory.value.slice(-5)
  }
}

// Format date for display
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>