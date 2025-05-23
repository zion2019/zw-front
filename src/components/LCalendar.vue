<template>
  <div class="l-calendar-input">
    <input :id="inputId"
           type="text"
           readonly=""
           placeholder="请选择日期"
           data-lcalendar="2025-01-01,2055-05-11"
    />
  </div>
</template>

<script >
  import '../assets/css/LCalendar.css';
  import LCalendar from '../assets/js/LCalendar.js';

  export default {
    name: 'LCalendar',
    props: {defaultValue: String},


    data() {
      return {
        inputId: `dateChooser-${Math.random().toString(36).substring(2, 8)}`
      };
    },
    mounted() {
      const calendar = new LCalendar();
      calendar.init({
        trigger: `#${this.inputId}`,
        type: 'date',
        minDate: '2025-01-01',
        maxDate: '2055-12-31',
        defaultValue: this.defaultValue
      });

      // 获取 input 元素并监听 input 事件
      const inputEl = document.getElementById(this.inputId);
      if (inputEl) {
        inputEl.addEventListener('input', () => {
          this.$emit('changeDate',inputEl.value);
        });
      }
    }
  }
</script>
