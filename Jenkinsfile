node() {
    try {
        String ANSI_GREEN = "\u001B[32m"
        String ANSI_NORMAL = "\u001B[0m"
        String ANSI_BOLD = "\u001B[1m"
        String ANSI_RED = "\u001B[31m"
        String ANSI_YELLOW = "\u001B[33m"

        ansiColor('xterm') {
            stage('Checkout') {
                cleanWs()

                dir('content-plugins'){
                    checkout scm
                    commit_hash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    artifact_version = sh(script: "echo " + params.github_release_tag.split('/')[-1] + "_" + commit_hash + "_" + env.BUILD_NUMBER, returnStdout: true).trim()
                }



                echo "artifact_version: " + artifact_version

                stage('Build') {
                    sh """
                        zip -r content-plugins.zip content-plugins
                    """
                }



                stage('ArchiveArtifacts') {
                    sh """
                        mkdir content-plugins-artifacts
                        cp content-plugins.zip content-plugins-artifacts
                        zip -j  content-plugins-artifacts.zip:${artifact_version}  content-plugins-artifacts/*
                    """
                    archiveArtifacts "content-plugins-artifacts.zip:${artifact_version}"
                    sh """echo {\\"artifact_name\\" : \\"content-plugins-artifacts.zip\\", \\"artifact_version\\" : \\"${artifact_version}\\", \\"node_name\\" : \\"${env.NODE_NAME}\\"} > metadata.json"""
                    archiveArtifacts artifacts: 'metadata.json', onlyIfSuccessful: true
                    currentBuild.description = "${artifact_version}"
                }
            }
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
