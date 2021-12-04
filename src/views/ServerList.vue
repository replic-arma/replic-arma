<template>
    <ul class="servers">
       <server></server>
    </ul>
</template>

<script lang="ts">
import ServerVue from '@/components/Server.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {
        Server: ServerVue
    }
})
export default class ServerListVue extends Vue {

}
</script>

<style lang="scss" scoped>
.servers {
  padding: 0;
}
</style>
