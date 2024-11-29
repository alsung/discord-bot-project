pipeline {
    agent any

    // tools {
    //     // Ensure the correct Node.js version is used in the pipeline
    //     nodejs 'NodeJS-22'
    // }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Lint') {
            steps {
                sh 'node -v'
                sh 'npm run lint'
            }
        }
        stage('Deploy') {
            steps {
                // Add deployment steps here
            }
        }
    }
}