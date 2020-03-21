pipeline {
    agent { 
        label 'master'
    }
    environment {
        GIT_REPO = 'https://github.com/connectable-project/connectable.git'
        GIT_CREDENTIALS = 'github_conn_http'
        GIT_BRANCH = 'test_ssh'
        SSH_PROD_CREDENTIALS = 'ssh_conn_prod'
        SSH_PROD_IP = '10.128.10.0'
        PROD_ROOT_DIR = 'connectable'
    }
    stages {
        stage("Git Checkout") {
            steps {
                cleanWs()
                script {
                   echo "${GIT_BRANCH}"
                   def scmVars = checkout(
                        scm: [
                            $class: "GitSCM",
                            branches: [[name: "${GIT_BRANCH}"]],
                            userRemoteConfigs: [[
                                credentialsId: "${GIT_CREDENTIALS}",
                                url: "${GIT_REPO}"
                            ]]
                        ]
                    )
                }
            }
        }
        stage("Check CREDS") {
            steps {
                withCredentials([usernamePassword(credentialsId: "${GIT_CREDENTIALS}",
                                                 passwordVariable: 'GIT_PASS',
                                                 usernameVariable: 'GIT_USER'),
                ]) {
                sh """echo ${GIT_USER} >> creds.out
                """
                }
            }
        }
        stage("Check SSH") {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: "${SSH_PROD_CREDENTIALS}", 
                                                   keyFileVariable: 'SSH_KEYFILE',
                                                   usernameVariable: 'SSH_USERNAME'),
                                usernamePassword(credentialsId: "${GIT_CREDENTIALS}", 
                                                 passwordVariable: 'GIT_PASS',
                                                 usernameVariable: 'GIT_USER'),
                ]) {
                sh """ssh -i ${SSH_KEYFILE} -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SSH_PROD_IP} \
                OLD_RELEASE=\$(basename /home/${SSH_USERNAME}/${PROD_ROOT_DIR}-*) && \
                echo \$OLD_RELEASE && \
                rm -rf \$OLD_RELEASE && \
                \'ls /home/${SSH_USERNAME} && \
                echo 'WUT' && \
                ls /home/${SSH_USERNAME}\'
                """
                }
            }
        }
    }
}
ssh serverA "bash -s" < ./ex.bash

                OLD_RELEASE=\$(basename /home/${SSH_USERNAME}/${PROD_ROOT_DIR}-*) && \
                echo \$OLD_RELEASE && \
                rm -rf \$OLD_RELEASE && \
                echo \$hostname && \
