<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    meta: {
      type: Object,
      default: () => {
        return {
          title: '',
          icon: ''
        }
      }
    }
  },
  render(h, context) {
    const { icon, title } = context.props.meta
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
      // debugger
      // vnodes.push(<span><i class={icon}></i></span>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
