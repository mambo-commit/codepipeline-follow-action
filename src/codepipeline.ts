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

  const artifactObject = new aws_sdk.S3(params)
  // Get object revision
  const versions = async () => {
    await artifactObject.listObjectVersions(
        {
        Bucket: bucketName,
        Prefix: artifactName,
        MaxKeys: 1
        },
        function (err, data) {
        if (err) console.log(err, err.stack)
        else console.log(data)
        }
    ).promise().then((response) => {return response})
  }

  console.log(versions)
}

// export  function pipelinestatus(
//     pipelineName: string,
//     accessKeyId: string,
//     secretAccessKey: string,
//   ): void {
//     const credentials = new aws_sdk.Credentials({
//       accessKeyId,
//       secretAccessKey
//     })
  
//     let params
//     params = {
//       apiVersion: 'latest',
//       region: 'us-east-1',
//       credentials
//     }
  
//     const codePipeline = new aws_sdk.CodePipeline(params)
  
//     const artifactObject = new aws_sdk.S3(params)
  
//     params = {
//       name: pipelineName
//     }
  
//     console.log(`Pipeline name: ${pipelineName}`)
//     codePipeline.getPipeline(params, function (err, data) {
//       if (err) console.log(err, err.stack)
//       else console.log(`Pipeline ARN: ${data.metadata?.pipelineArn}`)
//     }) 
    
//     // Get pipeline execution details
//     codePipeline.listPipelineExecutions(
//       {
//         pipelineName,
//         maxResults: 1
//       },
//       function (err, data) {
//         if (err) console.log(err, err.stack)
//       }
//     )
//   }
// }