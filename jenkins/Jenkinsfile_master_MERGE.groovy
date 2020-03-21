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
                     NEW_RELEASE_DIR = "${PROD_ROOT_DIR}-${BUILD_NUMBER}"
                     LAST_SUCCESSFUL_BUILD_ID = sh(
                        script: "curl http://localhost:8080/job/pilot/lastSuccessfulBuild/buildNumber",
                        returnStdout: true
                        ).trim()
                     OLD_RELEASE_DIR = sh(
                        script: """
                                ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
                                '
                                OLD_RELEASE_DIRS=\$(basename \$HOME}/${PROD_ROOT_DIR}-${LAST_SUCCESSFUL_BUILD_ID}*) &&
                                echo \$OLD_RELEASE_DIRS
                                '
                               """,
                        returnStdout: true
                        ).trim()
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
                cd \$HOME/${NEW_RELEASE_DIR} &&
                cat \$HOME/${PROD_ENV_FILE} >> \$HOME/${NEW_RELEASE_DIR}/${PROD_ENV_FILE}
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
                                 ),
                                 usernamePassword(
                                    credentialsId: "${GIT_CREDENTIALS}",
                                    passwordVariable: 'GIT_PASS',
                                    usernameVariable: 'GIT_USER'
                                 )]) {
                sh """ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
                '
                cd \$HOME/${NEW_RELEASE_DIR}
                docker-compose -f docker-compose-prod.yaml build connfrontend &&
                docker-compose -f docker-compose-prod.yaml up --no-deps -d connfrontend &&
                docker-compose -f docker-compose-prod.yaml build connbackend &&
                docker-compose -f docker-compose-prod.yaml up --no-deps -d connbackend &&
                docker-compose -f docker-compose-prod.yaml build mongodb &&
                docker-compose -f docker-compose-prod.yaml up --no-deps -d mongodb &&
                
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
                                 )]) {
                sh """ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
                'if [ -d \"\$HOME/${OLD_RELEASE_DIR}\" ]; then rm -rf \"\$HOME/${OLD_RELEASE_DIR}\"; fi'
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
                'rm -rf \"\$HOME/${NEW_RELEASE_DIR}\"'
                """
                }
            }
        }
    }
}
