import * as core from '@actions/core'
import {wait} from './wait'
import {pipelinestatus} from './codepipeline'

function run(): void {
  try {
    const ms: string = core.getInput('milliseconds')
    const pipelineName: string = core.getInput('pipelineName')
    const bucketName: string = core.getInput('bucketName')
    const artifactName: string = core.getInput('artifactName')
    const accessKeyId: string = core.getInput('accessKeyId')
    const secretAccessKey: string = core.getInput('secretAccessKey')
    console.log(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())
    pipelinestatus(pipelineName, accessKeyId, secretAccessKey, bucketName, artifactName )

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
