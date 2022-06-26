<template>
    <div class="add-button" @click="isOpen = true">
        <mdicon name="plus" role="button"></mdicon>
        <span v-t="'modset.add'"></span>
    </div>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span v-t="'repository.add'"></span>
                <mdicon role="button" @click="isOpen = false" name="close" size="35" />
            </div>
            <div class="replic-dialog__content">
                <loader v-if="loading" />
                <div class="txt">
                    <label for="repoName" v-t="'repository.autoconfig'"></label>
                    <div class="txt__input-wrapper">
                        <input
                            class="txt__input"
                            type="text"
                            name="repoName"
                            v-model="autoConfigModel"
                            :disabled="loading"
                        />
                    </div>
                </div>
                <button class="button" @click="addModset" :disabled="loading" v-t="'submit'"></button>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRepoStore } from "@/store/repo";
import { useRouteStore } from "@/store/route";
const routeStore = useRouteStore();
const autoConfigModel = ref('');
const isOpen = ref(false);
const loading = ref(false);
const errorMsg = ref('');
const repoStore = useRepoStore();
function addModset() {
    loading.value = true;
}
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &:deep(&__heading) {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        font-size: 20pt;
        margin-block-end: 2rem;
        span:not(:first-child) {
            cursor: pointer;
        }
    }
    &:deep(&__content) {
        display: grid;
        row-gap: 1rem;
    }
}
</style>
