<template>
    <div>
        <RegionTree :organType="'region'"></RegionTree>
    </div>
</template>
<script>
import RegionTree from './regionTree.vue'
export default {
    components: {
      RegionTree
    },
}
</script>