<template>
  <Suspense>
    <template #default>
      <rtransition>
        <router-view/>
      </rtransition>
    </template>
    <template #fallback>
      <loader />
    </template>
  </Suspense>
</template>

<style lang="scss">
@import 'styles/global.scss';

</style>
