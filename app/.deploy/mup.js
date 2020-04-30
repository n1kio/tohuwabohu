module.exports = {
    servers: {
        one: {
            host: '3.126.207.88',
            username: 'ubuntu',
            pem: '~/.ssh/aws.pem'
        }
    },

    app: {
        name: 'freizeit-planer',
        path: '../',

        servers: {
            one: {},
        },

        buildOptions: {
            serverOnly: true,
        },

        env: {
            ROOT_URL: 'http://3.126.207.88/',
            MONGO_URL: 'mongodb://localhost/meteor',
            PORT: 80
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
