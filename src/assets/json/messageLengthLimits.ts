export const messageLengthLimits = {
    default: {
        content: 2000,
        maxEmbedSum: 6000
    },
    embed: {
        title: 256,
        description: 4096,
        fields: 25,
        fieldName: 256,
        fieldValue: 1024,
        footer: 2048,
        author: 256,
    }
};
