pipeline {
    agent { 
        label 'master'
    }
    environment {
        GIT_REPO = 'https://github.com/connectable-project/connectable.git'
        GIT_CREDENTIALS = 'github_conn_http'
    }
    stages {
        stage("Git Checkout") {
            steps {
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
        stage("Build Frontend") {
            steps {
                    sh "docker-compose build --force-rm --no-cache connfrontend"
            }
        }
        stage("Build Backend") {
            steps {
                    sh "docker-compose build --force-rm --no-cache connbackend"
            }
        }
    }
    post {
        always {
            script {
                sh "docker system prune -f && docker volume prune -f"
            }
        }
    }
}
