import { defineStore } from 'pinia';

export const useDialogStore = defineStore('dialog', {
    state: (): {shown: boolean} => ({
        shown: false
    }),
    actions: {
        toggleDialog () {
            this.shown = !this.shown;
        }
    }
});
