export default {
  props: { to: { type: String, required: true } },
  render() {
    const click = () => {
      // 组件中的$router
      this.$router.push(this.to)
      // window.location.hash = '/'
    }
    return <a onClick={click}>{this.$slots.default}</a>
  },
}
