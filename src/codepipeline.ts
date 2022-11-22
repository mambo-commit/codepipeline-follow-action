import * as aws_sdk from 'aws-sdk'

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
  let pipelineExecution = codePipeline.listPipelineExecutions(params).promise()

  objectID
    .then(data => data)
    .then(object => {
      pipelineExecution
        .then(function (data) {
            let versionId = object.Versions?.at(0)?.VersionId
            let revisionId = data.pipelineExecutionSummaries?.at(0)?.sourceRevisions?.at(0)?.revisionId
            let actionName = data.pipelineExecutionSummaries?.at(0)?.sourceRevisions?.at(0)?.actionName
            if (versionId == revisionId) {
                console.log('Pipeline execution matches published artifact revision')
                let executionStatus = data.pipelineExecutionSummaries?.at(0)?.status
                console.log(`Status: ${executionStatus}`)
                // console.log(`Action Name: ${actionName}`)
                // console.log(`Revision ID: ${revisionId}`)
                // console.log(`Published object version ID: ${versionId}`)
            }
        })
        .catch(function (err) {
          console.log('error', err)
        })
    })
    .catch(function (err) {
      console.log('error', err)
    })
}
