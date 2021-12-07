import { defineStore } from 'pinia';
interface DialogModel {
    name: string;
    state: boolean;
}

export const useDialogStore = defineStore('dialog', {
    state: (): {dialogs: DialogModel[]} => ({
        dialogs: []
    }),
    getters: {
        getDialog (state) {
            return (dialogName: string) => state.dialogs.find(dialog => dialog.name === dialogName);
        }
    },
    actions: {
        toggleDialog (dialogName: string) {
            const dialog = this.dialogs.find(dialog => dialog.name === dialogName);
            if (dialog === undefined) return;
            dialog.state = !dialog.state;
        },
        addDialog (dialogName: string) {
            this.dialogs.push({ name: dialogName, state: false });
        }
    }
});
