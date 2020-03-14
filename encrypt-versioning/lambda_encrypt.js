// Sample Lambda Function to get Trusted Advisor S3 Bucket Versioning check details from Cloudwatch events and enable S3 Bucket Versioning
var AWS = require('aws-sdk');

//main function which gets Cloudwatch event
exports.handler = (event, context, callback) => {
    console.log(event);
    var bucketId = event['detail']['requestParameters']['bucketName'];
    var region = event['detail']['awsRegion'];

    addBucketVersioning(bucketId, region);
};

//Sample function which enabled S3 bucket versioning
function addBucketVersioning (bucketId, region) {
    AWS.config.update({region: region});

   var s3 = new AWS.S3({apiVersion: '2006-03-01'});

    //get tags for the bucket highlighted by Trusted Advisor
   var describeTagsparams = {
        Bucket: bucketId
    };
            var versioningParams = {
                Bucket: bucketId,
                VersioningConfiguration: {
                    MFADelete: 'Disabled',
                    Status: 'Enabled'
                }
            };
            s3.putBucketVersioning(versioningParams, function(err, data) {
                if (err) console.log(bucketId, region, err, err.stack); // an error occurred
                else console.log('Bucket Versioning Enabled: ', bucketId, region); // successful response
            });


            var encryptParams = {
                Bucket: bucketId,
                ServerSideEncryptionConfiguration: {
                    Rules: [ /* required */
                        {
                        ApplyServerSideEncryptionByDefault: {
                        SSEAlgorithm: 'AES256'
                        }
                    },
                    /* more items */
                    ]
                },
             //   ContentMD5: 'base64'
            };
           setTimeout(function() { /* otherwise will give error due to not being able to run the same time as versioning */
            s3.putBucketEncryption(encryptParams, function(err, data) {
                if (err) console.log(bucketId, region, err, err.stack); // an error occurred
                else console.log('Bucket encryption Enabled: ', bucketId, region); // successful response
            });
           }, 5000);
        }
  //  });

//}
