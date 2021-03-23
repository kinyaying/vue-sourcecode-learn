<template>
  <div>foo
    <div @click="goFoo">goFoo</div>
    <router-view/>
  </div>
</template>
<script>
export default {
  methods: {
    goFoo(){
      this.$router.push('/foo/test')
    }
  }
}
</script>
<style scoped>
</style>
