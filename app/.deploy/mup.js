module.exports = {
    servers: {
        one: {
            host: '52.59.247.168',
            username: 'ec2-user',
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
            // If you are using ssl, it needs to start with https://
            ROOT_URL: 'http://52.59.247.168/',
            MONGO_URL: 'mongodb://mongodb/meteor',
            MONGO_OPLOG_URL: 'mongodb://mongodb/local',
        },

        docker: {
            image: 'abernix/meteord:node-8.4.0-base',
        },

        // Show progress bar while uploading bundle to server
        // You might need to disable it on CI servers
        enableUploadProgressBar: true
    },

    mongo: {
        version: '3.4.1',
        servers: {
            one: {}
        }
    },
};
