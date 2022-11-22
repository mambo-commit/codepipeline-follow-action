import * as core from '@actions/core'
import {bucketVersion} from './codepipeline'

function run(): void {
  try {
    const bucketName: string = core.getInput('bucketName')
    const artifactName: string = core.getInput('artifactName')
    const accessKeyId: string = core.getInput('accessKeyId')
    const secretAccessKey: string = core.getInput('secretAccessKey')
    console.log(`Waiting for pipeline execution ...`)
    
    bucketVersion(accessKeyId, secretAccessKey, bucketName, artifactName )

    //core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
