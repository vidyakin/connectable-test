pipeline {
    agent {
        label 'master'
    }
    environment {
        GIT_REPO_PATH = 'connectable-project/connectable'
        GIT_CREDENTIALS = 'github_conn_http'
        SSH_PROD_CREDENTIALS = 'ssh_conn_prod'
        SSH_PROD_IP = '10.128.10.0'
        PROD_ROOT_DIR = 'connectable'
        PROD_ENV_FILE = '.env.prod'
        CLOUDFLARE_TOKEN = 'cloudflare_token'
    }
    stages {
        stage("Prepare PROD ENV") {
            steps {
                cleanWs()
                script {
                withCredentials([sshUserPrivateKey(
                                   credentialsId: "${SSH_PROD_CREDENTIALS}",
                                   keyFileVariable: 'SSH_KEYFILE',
                                   usernameVariable: 'SSH_USERNAME'
                                 ),
                                 usernamePassword(
                                    credentialsId: 'mongodb_admin',
                                    passwordVariable: 'MONGO_INITDB_ROOT_PASSWORD',
                                    usernameVariable: 'MONGO_INITDB_ROOT_USERNAME'
                                 ),
                                 usernamePassword(
                                    credentialsId: "mongodb_app",
                                    passwordVariable: 'MONGO_PASS',
                                    usernameVariable: 'MONGO_USER'
                                 )
                ]) {
                    sh """
                    echo "MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}" >> ${PROD_ENV_FILE}
                    echo "MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}" >> ${PROD_ENV_FILE}
                    echo "MONGO_USER=${MONGO_USER}" >> ${PROD_ENV_FILE}
                    echo "MONGO_PASS=${MONGO_PASS}" >> ${PROD_ENV_FILE}
                    echo "DB_URL=mongodb://${MONGO_USER}:${MONGO_PASS}@mongodb:27017/connectable" >> ${PROD_ENV_FILE}
                    """
                    sh "scp -i ${SSH_KEYFILE} ${PROD_ENV_FILE} ${SSH_USERNAME}@${SSH_PROD_IP}:~/${PROD_ENV_FILE}"
                    }
                }
            }
        }
        stage("Fetch PROD updates ") {
            steps {
                withCredentials([sshUserPrivateKey(
                                   credentialsId: "${SSH_PROD_CREDENTIALS}",
                                   keyFileVariable: 'SSH_KEYFILE',
                                   usernameVariable: 'SSH_USERNAME'
                                 )]) {
                sh """ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
                '
                sudo cp -r "\$HOME/${PROD_ROOT_DIR}" "\$HOME/${PROD_ROOT_DIR}-bak" &&
                cd \$HOME/${PROD_ROOT_DIR} &&
                git checkout . &&
                git checkout new_master &&
                git pull origin new_master &&
                cat \$HOME/${PROD_ENV_FILE} >> \$HOME/${PROD_ROOT_DIR}/${PROD_ENV_FILE}
                '
                """
                }
            }
        }
        stage("Deploy PROD changes") {
            steps {
                withCredentials([sshUserPrivateKey(
                                   credentialsId: "${SSH_PROD_CREDENTIALS}",
                                   keyFileVariable: 'SSH_KEYFILE',
                                   usernameVariable: 'SSH_USERNAME'
                                 )]) {
                sh """ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
                '
                cd \$HOME/${PROD_ROOT_DIR} &&
                docker-compose -f docker-compose-prod.yaml build connfrontend &&
                docker-compose -f docker-compose-prod.yaml up --no-deps -d connfrontend &&
                docker-compose -f docker-compose-prod.yaml build connbackend &&
                docker-compose -f docker-compose-prod.yaml up --no-deps -d connbackend &&
                '
                """
                }
            }
        }
    }
    post {
        success {
            script {
                withCredentials([sshUserPrivateKey(
                                   credentialsId: "${SSH_PROD_CREDENTIALS}",
                                   keyFileVariable: 'SSH_KEYFILE',
                                   usernameVariable: 'SSH_USERNAME'
                                 ),
                                 usernamePassword(
                                    credentialsId: "${GIT_CREDENTIALS}",
                                    passwordVariable: 'GIT_PASS',
                                    usernameVariable: 'GIT_USER'
                                 ),
                                 string(
                                   credentialsId: "${CLOUDFLARE_TOKEN}",
                                   variable: 'CF_TOKEN',
                                   usernameVariable: 'SSH_USERNAME'
                                 )]) {
                sh """curl -X POST "https://api.cloudflare.com/client/v4/zones/3eb26a729ba17d1d214910633e1204cb/purge_cache" \
                     -H "Authorization: Bearer ${CF_TOKEN}" \
                     -H "Content-Type:application/json" \
                     --data '{"purge_everything":true}'
                """
                }
            }
        }
        failure {
            script {
                withCredentials([sshUserPrivateKey(
                                   credentialsId: "${SSH_PROD_CREDENTIALS}",
                                   keyFileVariable: 'SSH_KEYFILE',
                                   usernameVariable: 'SSH_USERNAME'
                                 ),
                                 usernamePassword(
                                    credentialsId: "${GIT_CREDENTIALS}",
                                    passwordVariable: 'GIT_PASS',
                                    usernameVariable: 'GIT_USER'
                                 )]) {
                sh """ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
                '
                sudo cp -r "\$HOME/${PROD_ROOT_DIR}-bak" "\$HOME/${PROD_ROOT_DIR}" &&
                cd \$HOME/${PROD_ROOT_DIR} &&
                docker kill connbackend connfrontend &&
                docker-compose -f docker-compose-prod.yaml up connfrontend connbackend
                '
                """
                }
            }
        }
    }
}
