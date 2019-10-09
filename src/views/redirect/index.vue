<script>
export default {
  created() {
    console.log(this.$route);
    const { params, query } = this.$route
    const { path } = params
    // debugger
    this.$router.replace({ path: '/' + path, query })
  },
  render: function (h) {
    return h() // avoid warning message
  }
}
</script>
