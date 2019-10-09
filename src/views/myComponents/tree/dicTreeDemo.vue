<template>
    <div>
        <DicTree :versionType="'standard'"></DicTree>
    </div>
</template>
<script>
import DicTree from './dicTree.vue'
export default {
    components: {
      DicTree
    },
}
</script>