import * as core from '@actions/core'
import {wait} from './wait'
import {bucketVersion} from './codepipeline'

function run(): void {
  try {
    const pipelineName: string = core.getInput('pipelineName')
    const bucketName: string = core.getInput('bucketName')
    const artifactName: string = core.getInput('artifactName')
    const accessKeyId: string = core.getInput('accessKeyId')
    const secretAccessKey: string = core.getInput('secretAccessKey')
    console.log(`Waiting for pipeline execution ...`)
    let timeout = 5
    do {
      wait(parseInt('5000', 10))
      bucketVersion(accessKeyId, secretAccessKey, bucketName, artifactName)
      timeout -= 1
    } while (timeout > 0)
    // core.debug(new Date().toTimeString())
    // core.debug(new Date().toTimeString())
    
    //pipelinestatus(pipelineName, accessKeyId, secretAccessKey, bucketName, artifactName )


    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
