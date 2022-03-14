<template>
    <ul class="modsets">
        <modset v-for="(modset, i) of modsets" :key="i" :modset="modset" :modsetIndex="modset.id"></modset>
    </ul>
    <mdicon name="plus" class="add-button" role="button" @click="dialogStore.toggleDialog('modsetAdd')"></mdicon>
    <modset-add />
</template>

<script lang="ts">
import ModsetVue from '@/components/Modset.vue';
import ModsetAddVue from '@/components/ModsetAdd.vue';
import { useDialogStore } from '@/store/dialog';
import { useRepoStore } from '@/store/repo';
import { mapState } from 'pinia';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {
        Modset: ModsetVue,
        ModsetAdd: ModsetAddVue,
    },
    computed: {
        ...mapState(useRepoStore, {
            modsets: (store) => store.getModsets(store.currentRepoId),
        }),
    },
})
export default class ModsetListVue extends Vue {
    private dialogStore = useDialogStore();
}
</script>

<style lang="scss" scoped>
.modsets {
    padding: 0;
    display: grid;
    gap: 1rem;
}
</style>
