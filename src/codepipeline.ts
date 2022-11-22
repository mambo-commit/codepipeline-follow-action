import * as aws_sdk from 'aws-sdk'
import { wait } from './wait'

export function bucketVersion(
  accessKeyId: string,
  secretAccessKey: string,
  bucketName: string,
  artifactName: string
): void {
  const credentials = new aws_sdk.Credentials({
    accessKeyId,
    secretAccessKey
  })

  let params
  params = {
    apiVersion: 'latest',
    region: 'us-east-1',
    credentials
  }

  const s3Client = new aws_sdk.S3(params)

  const codePipeline = new aws_sdk.CodePipeline(params)

  params = {
    Bucket: bucketName,
    Prefix: artifactName,
    MaxKeys: 1
  }
  let objectID = s3Client.listObjectVersions(params).promise()

  params = {
    pipelineName: 'cicd-test',
    maxResults: 1
  }
  let pipelineExecutions = codePipeline.listPipelineExecutions(params).promise();

  const excutionRevisionCheck = async function () {
    let versionId = await objectID.then(data => data.Versions?.at(0)?.VersionId)
    let revisionId = await pipelineExecutions.then(data => data.pipelineExecutionSummaries?.at(0)?.sourceRevisions?.at(0)?.revisionId)
    if (versionId == revisionId)
        return true 
    else
        return false
  }

  const getStatus = async function () {
    return await pipelineExecutions.then(data => data.pipelineExecutionSummaries?.at(0)?.status) || 'noresponse'
  }

  const isRunning = async function () {
    let executionStatus = await pipelineExecutions.then(data => data.pipelineExecutionSummaries?.at(0)?.status) || 'noresponse'
    let stopState = ['Succeeded', 'Stopped', 'Cancelled', 'Superseded', 'Failed']
    let isRunning = true
    if (stopState.includes(executionStatus))
        isRunning = false
    return isRunning
  }

  const workFlow = async function () {
    let timeOut = 3
    let ms = 5000
    do {
        await wait(ms)
        if (await excutionRevisionCheck()){  
            let status
            do {
                status = await getStatus()   
                console.log(`Pipeline current status: ${status}`)
                await wait(3000)
            } while (await isRunning());
            break
        }
        timeOut -= 1
    }while(timeOut > 0)
  }

  workFlow()

}
