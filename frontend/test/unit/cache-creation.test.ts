import { createModsFromFiles } from '@/util/repository';
import { test, assert, describe, expect } from 'vitest';
describe('Creating Cache from Repository', () => {
    test('Create Mods from files', () => {
        const files = [
            {
                path: '@MyCoolMod\\cool.pbo',
                sha1: 'bbb',
                size: 500
            },
            {
                path: '@MyCoolMod2\\cool.pbo',
                sha1: 'bbb',
                size: 500
            },
            {
                path: '@MyCoolMod\\cool2.pbo',
                sha1: 'bbb',
                size: 250
            },
            {
                path: '@MyCoolMod\\cool3.pbo',
                sha1: 'bbb',
                size: 125
            }
        ];
        const result = [
            {
                name: '@MyCoolMod',
                mod_type: 'mod',
                size: 875,
                files: [
                    {
                        path: '@MyCoolMod\\cool.pbo',
                        sha1: 'bbb',
                        size: 500
                    },
                    {
                        path: '@MyCoolMod\\cool2.pbo',
                        sha1: 'bbb',
                        size: 250
                    },
                    {
                        path: '@MyCoolMod\\cool3.pbo',
                        sha1: 'bbb',
                        size: 125
                    }
                ]
            },
            {
                name: '@MyCoolMod2',
                mod_type: 'mod',
                size: 500,
                files: [
                    {
                        path: '@MyCoolMod2\\cool.pbo',
                        sha1: 'bbb',
                        size: 500
                    }
                ]
            }
        ];
        const modsWithFiles = createModsFromFiles(files);
        assert.isArray(modsWithFiles);
        expect(modsWithFiles).toHaveLength(2);
        expect(modsWithFiles).toEqual(result);
    });
});
