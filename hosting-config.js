// Configuration spécifique pour différents hébergeurs
export const hostingConfigs = {
    // Pour SwissTransfer ou hébergeurs similaires
    swisstransfer: {
        buildCommand: 'npm run build',
        outputDir: 'dist',
        staticGeneration: true,
        htaccessRequired: true,
        compressionSupported: true
    },

    // Pour Infomaniak
    infomaniak: {
        buildCommand: 'npm run build',
        outputDir: 'dist',
        staticGeneration: true,
        htaccessRequired: true,
        compressionSupported: true,
        ftpPath: '/sites/valentingassend.com/'
    }
};