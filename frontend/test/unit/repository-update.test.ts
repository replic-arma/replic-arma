import { test, assert, describe } from 'vitest';
import { patchRepository } from '@/util/repository';
import type { IReplicArmaRepository, Repository } from '@/models/Repository';
describe('Updating a existing Repository', () => {
    const repository: IReplicArmaRepository = {
        id: '1337',
        build_date: '1690726769',
        config_url: '',
        revision: 1,
        name: 'Test',
        downloadDirectoryPath: '',
        open_repository_schema: 1,
        files: [
            {
                path: '@MyCoolMod\\cool.pbo',
                sha1: 'bbb',
                size: 1337
            }
        ],
        collections: [
            {
                id: '1337',
                modsets: {
                    1337: ['@MyCoolMod\\cool.pbo']
                },
                name: 'Test Collection 1'
            }
        ],
        modsets: [
            {
                id: '1337',
                name: 'Test Modset 1',
                mods: [
                    {
                        name: '@MyCoolMod',
                        mod_type: 'mod',
                        files: [
                            {
                                path: '@MyCoolMod\\cool.pbo',
                                sha1: 'bbb',
                                size: 1337
                            }
                        ]
                    }
                ]
            }
        ]
    };
    const repoData: Repository = {
        build_date: '1690726770',
        config_url: '',
        revision: 2,
        name: 'New Test',
        open_repository_schema: 1,
        files: [
            {
                path: '@MyCoolMod\\cool.pbo',
                sha1: 'bbb',
                size: 1337
            }
        ],
        modsets: [
            {
                id: '1337',
                name: 'Test Modset 1',
                mods: [
                    {
                        name: '@MyCoolMod',
                        mod_type: 'mod',
                        files: [
                            {
                                path: '@MyCoolMod\\cool.pbo',
                                sha1: 'bbb',
                                size: 1337
                            }
                        ]
                    }
                ]
            }
        ]
    };
    const res = patchRepository(repository, repoData);
    test('Build date updated', () => {
        assert.equal(res.build_date, repoData.build_date);
    });
    test('Revision updated', () => {
        assert.equal(res.revision, repoData.revision);
    });
    test('Name updated', () => {
        assert.equal(res.name, repoData.name);
    });
});
