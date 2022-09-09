export const config = {
    /* Main config */
    clientToken: process.env.DEV_TOKEN,
    clientPrefix: "!",
    /* Server config */
    clientSecret: process.env.DEV_CLIENT_SECRET,
    database: {
        connectionUrl: process.env.DEV_DB_CONNECTION_URL
    },
    api: {
        server: {
            host: process.env.DEV_API_HOST,
            port: process.env.DEV_API_PORT
        },
        webUrl: process.env.DEV_WEB_URL
    },
    redirectURI: "",
    scope: "identify email guilds guild.join",
    oauthURL: "",
    /* IDs config */
    mainGuildID: "",
    client: {
        user: {
            id: ""
        }
    }
};
