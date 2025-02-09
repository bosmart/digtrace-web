pipeline {
    agent any
    stages {
        stage('DjangoProject') {
            steps {
                dir('') {
                    script {
                          docker.withRegistry("http://nexus.domain.bluestar-software.co.uk:8444/", "nexus") {
                        // image will now build using the docker file (tes
                           dockerImage = docker.build('bu/researchimpact')
                           dockerImage.push('latest')
                        }
                    }
               }
           }
        }
      stage('DjangoProjectQuality') {
      when { branch 'BU' }
      steps {
        echo 'Code quality review using sonarqube'
       dir('')  {
          script {
            def scannerHome = tool 'Sonarqube';
            withSonarQubeEnv('Sonarqube') {
              try
              {
                sh script: "${scannerHome}/bin/sonar-scanner -X", label: 'Execute sonar-scanner'
              }
              catch (exc)
              {
                echo 'Sonarqube scanning has failed, mark as unstable but do not halt build'
                currentBuild.result = 'UNSTABLE'
              }
            }
          }
        }
      }
    }
         // --------------------------------------------------
    // quality: check with sonarqube
    // --------------------------------------------------



    }
}