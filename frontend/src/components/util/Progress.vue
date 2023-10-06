<template>
    <div id="progress-bar">
        <ol id="progress-steps">
            <li class="progress-step" style="width: 25%">
                <span class="count highlight-index"></span>
                <span class="description">Mod directory</span>
            </li>
            <li class="progress-step" style="width: 25%">
                <span class="count" :class="current > 0 ? 'highlight-index' : ''"></span>
                <span class="description">Executable</span>
            </li>
            <li class="progress-step" style="width: 25%">
                <span class="count" :class="current > 1 ? 'highlight-index' : ''"></span>
                <span class="description">First Repository</span>
            </li>
        </ol>
    </div>
</template>
<script lang="ts" setup>
interface Props {
    current: number;
}
defineProps<Props>();
</script>

<style lang="scss" scoped>
@mixin rounded-corners($radius) {
    -moz-border-radius: $radius;
    -webkit-border-radius: $radius;
    -o-border-radius: $radius;
    border-radius: $radius;
}
.off-screen {
    height: 1px;
    left: -50000px;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 1px;
}

// PROGRESS BAR
#progress-bar {
    position: relative;
    padding-top: 5px;
    margin-bottom: 1.5em;
    color: #4d483f;
    #progress-steps {
        height: 8px;
        width: 100%;
        margin: 0;
        padding: 0;
        display: block;
        @include rounded-corners(4px);
        background-color: #fff;
        position: relative;
        list-style-type: none;
        counter-reset: item;
    }
    .progress-step {
        // Width set by JS
        width: 16.66%;
        height: 8px;
        float: left;
        margin: 0;
        padding: 0;
        position: relative;
    }
    .count:before {
        content: counter(item) ' ';
        counter-increment: item;
        display: block;
        width: 14px;
        height: 18px;
        background-color: #fff;
        @include rounded-corners(50%);
        position: absolute;
        right: -10px;
        top: -6px;
        padding: 2px 0 0 6px;
        font-size: 14px;
        font-weight: bold;
        z-index: 999;
    }
    .highlight-index:before {
        background-color: var(--c-surf-2);
        color: #fff;
    }
    .highlight-index {
        background-color: var(--c-surf-2);
        display: block;
        height: 100%;
        @include rounded-corners(4px);
    }
    .description {
        display: block;
        text-align: center;
        right: -32%;
        position: absolute;
        bottom: 20px;
        font-size: 0.9em;
    }
    .bolded-step {
        font-weight: normal !important;
    }
}
</style>
