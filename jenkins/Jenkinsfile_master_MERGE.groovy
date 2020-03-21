pipeline {
    agent {
        label 'master'
    }
    environment {
        GIT_REPO_PATH = 'connectable-project/connectable'
        GIT_CREDENTIALS = 'github_conn_http'
        GIT_BRANCH = 'new_master'
        SSH_PROD_CREDENTIALS = 'ssh_conn_prod'
        SSH_PROD_IP = '10.128.10.0'
        PROD_ROOT_DIR = 'connectable'
        PROD_ENV_FILE = '.env.prod'
    }
    stages {
        stage("Prepare PROD ENV") {
            steps {
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
                     NEW_RELEASE_DIR = "${PROD_ROOT_DIR}-${BUILD_NUMBER}"
                     OLD_RELEASE_DIRS = sh(
                        script: """
                                ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
                                '
                                OLD_RELEASE_DIRS=\$(basename \$HOME}/${PROD_ROOT_DIR}-*) &&
                                echo \$OLD_RELEASE_DIRS
                                '
                               """,
                        returnStdout: true
                        ).trim()
                    sh """cat >> ${PROD_ENV_FILE} <<OUT
                          MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
                          MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
                          MONGO_USER=${MONGO_USER}
                          MONGO_PASS=${MONGO_PASS}
                          DB_URL=mongodb://${MONGO_USER}:${MONGO_PASS}@mongodb:27017/connectable
                          OUT
                        """
                    sh "scp -i ${SSH_KEYFILE} ${PROD_ENV_FILE} ${SSH_USERNAME}@${SSH_PROD_IP}:~/${PROD_ENV_FILE}"
                    }
                }
            }
        }
        stage("Fetch updates to PROD") {
            steps {
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
                mkdir \$HOME/${NEW_RELEASE_DIR} &&
                git clone https://${GIT_USER}:${GIT_PASS}@github.com/${GIT_REPO_PATH} \$HOME/${NEW_RELEASE_DIR} &&
                cat \$HOME/${PROD_ENV_FILE} >> \$HOME/${NEW_RELEASE_DIR}/${}
                '
                """
                }
            }
        }
        // stage("Check SSH") {
        //     steps {
        //         withCredentials([sshUserPrivateKey(
        //                            credentialsId: "${SSH_PROD_CREDENTIALS}",
        //                            keyFileVariable: 'SSH_KEYFILE',
        //                            usernameVariable: 'SSH_USERNAME'
        //                          ),
        //                          usernamePassword(
        //                             credentialsId: "${GIT_CREDENTIALS}",
        //                             passwordVariable: 'GIT_PASS',
        //                             usernameVariable: 'GIT_USER'
        //                          ),
        //                          file(
        //                             credentialsId: "${PROD_ENV_FILE}",
        //                             variable: 'PROD_ENV_SECRETS'
        //                          )]) {
        //         sh """ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
        //         '
        //         NEW_RELEASE=${PROD_ROOT_DIR}-${BUILD_NUMBER} &&
        //         cd \$HOME/\$NEW_RELEASE &&
        //         docker-compose -f docker-compose-prod.yaml build connfrontend &&
        //         docker-compose -f docker-compose-prod.yaml up --no-deps -d connfrontend &&
        //         docker-compose -f docker-compose-prod.yaml build connbackend &&
        //         docker-compose -f docker-compose-prod.yaml up --no-deps -d connbackend &&
        //         test -d \"\$HOME\$OLD_RELEASE\" && rm -rf \"\$HOME\$OLD_RELEASE\" || echo "No dir: \$OLD_RELEASE\"
        //         '
        //         """
        //         }
        //     }
        // }
    }
}
