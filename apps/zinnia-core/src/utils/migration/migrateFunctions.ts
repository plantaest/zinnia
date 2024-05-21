import { UserConfig } from '@/types/persistence/UserConfig';

export const migrateFunctions: Record<string, Function> = {
  // Change 0.1.x to a proper version
  'migrate_0.1.0_to_0.1.x': (oldUserConfig: any): UserConfig => {
    const userConfig: UserConfig = structuredClone(oldUserConfig);

    // Update schemaVersion
    userConfig.schemaVersion = '0.1.x';

    // Update userConfig structure
    // userConfig.hello = 'Hello World!';

    return userConfig;
  },
};
