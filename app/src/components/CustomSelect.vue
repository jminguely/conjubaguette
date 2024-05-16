<template>
  <div>
    <label :for="label">{{ label }}</label>
    <div class="cartoon-input">
      <select
        class="block w-full apparence-none outline-none bg-transparent"
        :value="selectedOption"
        @input="$emit('update:selectedOption', Number($event.target.value))"
        :disabled="disabled"
        :id="label"
      >
        <option v-for="(option, i) in options" :key="i" :value="i">{{ option }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectedOption', 'disabled', 'options', 'label']
}
</script>
