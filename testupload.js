let  https = require('https');
let fs = require('fs')

async function uploadFile(filename, filePath) {
    try {
      const signedUrl = 'https://storage.googleapis.com/yug-experiences/3build.zipbuild.zip?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=apifileupload%40yug-production.iam.gserviceaccount.com%2F20230609%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230609T105102Z&X-Goog-Expires=283&X-Goog-SignedHeaders=host&X-Goog-Signature=1836b5424a4d0c80c3d1253c8a5bd8e4793a8752580769c44c7c05ad25c5c82c046d9ecaf5a7284d61bd9765afd5f6326617d1ac6ad93ac4b6bc1f94e91ecde8f26a8049d3950263595a9287a441cbff3df9eaff14ffd1717f2022f1f3bd69c8015a1ac92fb773372a30855d39c2095543ac8b0000673f84fe8af2866459239ddea860d2dc7a535f9ad5b8b867df3b7cdb52614aea70c228ff3bf12646b53e30313f5213c4d1461ab71ba5ce512e3aea2eef6a5d806a8f6029f707087585e73b6cbfab1190415bf361a9fa17cc9dea38442021dab829a7f77a1e27d931f11dcf41dd3fe18fdff57b3b108fb166e554651a0352f4cb6611230b050f486e74cf73' //await getSignedUrl(filename);
      if (!signedUrl) {
        console.error('Failed to get signed URL');
        return;
      }
  
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/octet-stream' },
      };
  
      const request = https.request(signedUrl, requestOptions, (response) => {
        if (response.statusCode === 200) {
          console.log('File uploaded successfully');
        } else {
          console.error(`Error uploading file: ${response.statusCode}`);
        }
      });
  
      request.on('error', (error) => {
        console.error('Error uploading file:', error);
      });
  
      // Using a stream to read the file
      const readableStream = fs.createReadStream(filePath);
      readableStream.on('data', (chunk) => {
        request.write(chunk);
      });
      readableStream.on('end', () => {
        request.end();
      });
  
      readableStream.on('error', (error) => {
        console.error('Error reading file:', error);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  


  let main = async()=>{
    await uploadFile('build.zip','/Users/ravirawat/Desktop/Mac.zip')

  }
  main();