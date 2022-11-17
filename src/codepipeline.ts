import * as aws_sdk from 'aws-sdk'

export function pipelinestatus(pipelineName: string, accessKeyId: string, secretAccessKey: string): void {
    const params = {
        name: 'STRING_VALUE', 
        version: 'NUMBER_VALUE'
    };

    const credentials = new aws_sdk.Credentials({
        accessKeyId,
        secretAccessKey
     })

    const codePipeline = new aws_sdk.CodePipeline({
        apiVersion: 'latest',
        region: 'us-east-1',
        credentials 
    })
    
    const pipelineDetails = codePipeline.getPipeline({
        name: pipelineName,
    }, function(err, data){
        if (err) console.log(err, err.stack)
        else console.log(data)
    })
}
  