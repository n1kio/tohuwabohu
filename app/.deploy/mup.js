module.exports = {
    servers: {
        one: {
            host: 'tohuwabohuapp.com',
            username: 'ubuntu',
            pem: '~/.ssh/aws.pem'
        }
    },

    app: {
        name: 'tohuwabohu',
        path: '../',

        servers: {
            one: {},
        },

        buildOptions: {
            serverOnly: true,
        },

        env: {
            ROOT_URL: 'https://tohuwabohuapp.com/',
            MONGO_URL: 'mongodb://localhost/meteor',
            PORT: 3000
        },

        docker: {
            image: 'abernix/meteord:node-12-binbuild',
            prepareBundle: false,
            buildInstructions: [
            ]
        },

        // Show progress bar while uploading bundle to server
        // You might need to disable it on CI servers
        enableUploadProgressBar: true
    },

    mongo: {
        version: '4.2.5',
        servers: {
            one: {}
        }
    },
};
