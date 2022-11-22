import * as aws_sdk from 'aws-sdk'
import {wait} from './wait'

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

  const workFlow = async function () {
    let timeOut = 10
    let ms = 5000
    do {
      if (await excutionRevisionCheck(credentials, bucketName, artifactName)) {
        console.log('Pipeline execution found!')
        do {
          //console.log(`Pipeline current status: ${await getStatus()}`)
          await wait(2000)
        } while (await isRunning(credentials))
        console.log('Pipeline execution status check done')
        break
      }
      await wait(ms)
      timeOut -= 1
      console.log(`Retry attempts left: ${timeOut}`)
    } while (timeOut > 0)
  }

  workFlow()
}

async function excutionRevisionCheck(
  credentials: aws_sdk.Credentials,
  bucketName: string,
  artifactName: string
) {
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
  let pipelineExecutions = codePipeline.listPipelineExecutions(params).promise()
  let versionId = await objectID.then(data => data.Versions?.at(0)?.VersionId)
  let revisionId = await pipelineExecutions.then(
    data =>
      data.pipelineExecutionSummaries?.at(0)?.sourceRevisions?.at(0)?.revisionId
  )
  if (versionId == revisionId) return true
  else return false
}

async function isRunning(credentials: aws_sdk.Credentials) {
  let params
  params = {
    apiVersion: 'latest',
    region: 'us-east-1',
    credentials
  }

  const codePipeline = new aws_sdk.CodePipeline(params)
  params = {
    pipelineName: 'cicd-test',
    maxResults: 1
  }
  let pipelineExecutions = codePipeline.listPipelineExecutions(params).promise()
  let executionStatus =
    (await pipelineExecutions.then(
      data => data.pipelineExecutionSummaries?.at(0)?.status
    )) || 'noresponse'
  let executionDetails = await pipelineExecutions.then(data => data)
  let stopState = [
    'Succeeded',
    'Stopped',
    'Cancelled',
    'Superseded',
    'Failed',
    'noresponse'
  ]
  let isRunning = true
  console.log(
    executionStatus,
    executionDetails.pipelineExecutionSummaries?.at(0)?.lastUpdateTime
  )
  if (stopState.includes(executionStatus)) isRunning = false
  return isRunning
}
