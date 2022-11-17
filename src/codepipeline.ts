import * as aws_sdk from 'aws-sdk'

export function pipelinestatus(pipelineName: string, accessKeyId: string, secretAccessKey: string): void {

    const credentials = new aws_sdk.Credentials({
        accessKeyId,
        secretAccessKey
     })

    const codePipeline = new aws_sdk.CodePipeline({
        apiVersion: 'latest',
        region: 'us-east-1',
        credentials 
    })
    
    let params = {
        name: pipelineName,
    }

    console.log(`Pipeline name: ${pipelineName}`)
    codePipeline.getPipeline(params, function(err, data){
        if (err) console.log(err, err.stack)
        else console.log(`Pipeline ARN: ${data.metadata?.pipelineArn}`)
    })

    // codePipeline.getPipelineState(params, function(err, data){
    //     if (err) console.log(err, err.stack)
    //     else console.log(`Pipeline state: ${data.stageStates?.at(0)?.stageName}`)
    // })

    codePipeline.listPipelineExecutions({
        pipelineName,
        maxResults: 1
    }, function(err, data){
        if (err) console.log(err, err.stack)
        else { 
            console.log(`Pipeline Execution ID: ${data.pipelineExecutionSummaries?.at(0)?.pipelineExecutionId}`)
            console.log(`Pipeline SourceRevisions  ID: ${data.pipelineExecutionSummaries?.at(0)?.sourceRevisions?.at(0)?.revisionId}`)
            console.log(`Pipeline Execution StartTime: ${data.pipelineExecutionSummaries?.at(0)?.startTime}`)
            console.log(`Pipeline Execution Status: ${data.pipelineExecutionSummaries?.at(0)?.status}`)
        }
    })

    
}
  