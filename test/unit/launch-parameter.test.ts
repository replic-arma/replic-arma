import { test, assert, describe, expect } from 'vitest';
import { getModDlcString } from '@/util/system/game';
describe('Create Launch Parameter string', () => {
    test('Create Mod string', () => {
        const modDlcString = getModDlcString(
            'C:/Test/Mods',
            ['@My Awesome Mod 1', '@My Awesome Mod 2'],
            ['GM'],
            ['C:/Test/Special/@Special Mod 123']
        );
        expect(modDlcString).toEqual(
            '"-mod=C:/Test/Mods/@My Awesome Mod 1;" "-mod=C:/Test/Mods/@My Awesome Mod 2;" "-mod=GM;" "-mod=C:/Test/Special/@Special Mod 123;"'
        );
    });
});
