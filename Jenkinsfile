pipeline {
    agent { 
        label 'master'
    }
    environment {
        GIT_REPO = 'https://github.com/connectable-project/connectable.git'
        GIT_BRANCH = 'new_master'
        GIT_CREDENTIALS = 'github_conn_http'
    }
    stages {
        stage("Git Checkout") {
            steps {
                cleanWs()
                script {
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
        stage("Test Docker") {
            steps {
                    sh """docker -v"""
                    sh """npm -v"""
                    sh "cd ./backend && docker build ."
            }
        }
    }
}
