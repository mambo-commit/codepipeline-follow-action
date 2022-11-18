import {RepositoryNotificationEvents} from 'aws-cdk-lib/aws-codecommit'
import * as aws_sdk from 'aws-sdk'

export function pipelinestatus(
  pipelineName: string,
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

  const codePipeline = new aws_sdk.CodePipeline(params)

  const artifactObject = new aws_sdk.S3(params)

  params =  {
    name: pipelineName
  }

  console.log(`Pipeline name: ${pipelineName}`)
  codePipeline.getPipeline(params, function (err, data) {
    if (err) console.log(err, err.stack)
    else console.log(`Pipeline ARN: ${data.metadata?.pipelineArn}`)
  })

  // codePipeline.getPipelineState(params, function(err, data){
  //     if (err) console.log(err, err.stack)
  //     else console.log(`Pipeline state: ${data.stageStates?.at(0)?.stageName}`)
  // })

  
  artifactObject.getObjectAttributes({
    Bucket: bucketName,
    Key: artifactName,
    ObjectAttributes: []
  },
  function(err) {
    if (err) console.log(err, err.stack)
  })
  .on('success', function(response){
    console.log(response.data)
  })
  
  codePipeline
    .listPipelineExecutions(
      {
        pipelineName,
        maxResults: 1
      },
      function (err) {
        if (err) console.log(err, err.stack)
      }
    )
    .on('success', function (response) {
      console.log(response.data)
    })

  // console.log(`Pipeline Execution ID: ${data.pipelineExecutionSummaries?.at(0)?.pipelineExecutionId}`)
  // console.log(`Pipeline SourceRevisions  ID: ${data.pipelineExecutionSummaries?.at(0)?.sourceRevisions?.at(0)?.revisionId}`)
  // console.log(`Pipeline Execution StartTime: ${data.pipelineExecutionSummaries?.at(0)?.startTime}`)
  // console.log(`Pipeline Execution Status: ${data.pipelineExecutionSummaries?.at(0)?.status}`)
}
