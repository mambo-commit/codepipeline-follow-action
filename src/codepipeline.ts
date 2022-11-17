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
    
    const params = {
        name: pipelineName,
    }
    console.log(`Pipeline name: ${pipelineName}`)
    codePipeline.getPipeline(params, function(err, data){
        if (err) console.log(err, err.stack)
        else console.log(`Pipeline ARN: ${data.metadata?.pipelineArn}`)
    })

    codePipeline.getPipelineState(params, function(err, data){
        if (err) console.log(err, err.stack)
        else console.log(`Pipeline state: ${data.stageStates?.at(0)?.inboundExecution?.status}`)
    })
}
  