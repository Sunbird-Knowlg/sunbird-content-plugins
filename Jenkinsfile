package build
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
                if (params.github_release_tag == "") {
                    checkout scm
                    commit_hash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    branch_name = sh(script: 'git name-rev --name-only HEAD | rev | cut -d "/" -f1| rev', returnStdout: true).trim()
                    build_tag = branch_name + "_" + commit_hash
                    println(ANSI_BOLD + ANSI_YELLOW + "Tag not specified, using the latest commit hash: " + commit_hash + ANSI_NORMAL)
       
                } else {
                    def scmVars = checkout scm
                    checkout scm: [$class: 'GitSCM', branches: [[name: "refs/tags/${params.github_release_tag}"]], userRemoteConfigs: [[url: scmVars.GIT_URL]]]
                    build_tag = params.github_release_tag
                    println(ANSI_BOLD + ANSI_YELLOW + "Tag specified, building from tag: " + params.github_release_tag + ANSI_NORMAL)
        
                }
                echo "build_tag: " + build_tag

                stage('Build') {
                    sh """
                        export framework_version_number=${artifact_version}
                        export editorType="contentEditor"
                        export editor_version_number=1.35
                        rm -rf ansible/content-editor.zip
                        rm -rf content-editor
                        npm install
                        cd app
                        bower cache clean
                        bower prune -f 
                        bower install --force -V
                        cd ..
                        grunt jsdoc
                        #grunt compress
                        zip -r ce-docs.zip docs
                        gulp packageCorePlugins
                        npm run plugin-build
                        npm run build                      
                    """
                }
                
                stage('Publish_test_results') {
               cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'coverage/PhantomJS*/cobertura-coverage.xml', conditionalCoverageTargets: '70, 0, 0', failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false 
            }
                
                stage('ArchiveArtifacts') {
                    archiveArtifacts "ce-docs.zip"
                    currentBuild.description = "${build_tag}"
                }
            }
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
