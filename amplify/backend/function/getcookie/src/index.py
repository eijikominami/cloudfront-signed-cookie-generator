import os
import json
import time
from datetime import datetime
import base64
import boto3
from botocore.exceptions import ClientError
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding

def handler(event, context):
  print('received event:')
  print(event)

  try:
    # Expiration date
    expiration = int(time.time()) + int(os.environ['DURATION'])
    private_key = get_secret()
    # Policy statement
    statement = '{"Statement":[{"Resource":"' + os.environ['RESOURCE_PATH'] + '","Condition":{"IpAddress":{"AWS:SourceIp": "'+ os.environ['IP_ADDRESS'] + '"},"DateLessThan":{"AWS:EpochTime":' + str(expiration) + '}}}]}'
    # Encode base64 encode and replace invalid characters
    encoded_statement = base64.b64encode(statement.encode('utf-8')).decode().translate(str.maketrans({'+': '-', '=': '_', '/': '~'}))
    # Hash object
    encoded_signature = base64.b64encode(rsa_signer(statement.encode("utf-8"), private_key.encode("utf-8"))).decode().translate(str.maketrans({'+': '-', '=': '_', '/': '~'}))
  except Exception as e:
    print(str(e))
    return {
        'statusCode': 500,
        'headers': { 
          'Access-Control-Allow-Origin' : '*'
        },
        'body': str(e)
    }
  else:
    return {
        'statusCode': 200,
        'headers': { 
          'Access-Control-Allow-Origin' : '*'
        },
        'body': json.dumps({
          "CloudFront-Policy" : encoded_statement,
          "CloudFront-Signature" : encoded_signature,
          "CloudFront-Key-Pair-Id" : os.environ['ACCESS_KEY'],
          "Domain" : os.environ['DOMAIN']
        })
  }

def rsa_signer(message, key):

  # Deserialize a private key from PEM encoded data to the asymmetric private key types.
  private_key = serialization.load_pem_private_key(
      key,
      password=None,
      backend=default_backend()
  )
  # Return an AsymmetricSignatureContext used for signing data.
  signer = private_key.signer(padding.PKCS1v15(), hashes.SHA1())
  signer.update(message)
  return signer.finalize()

def get_secret():

    secret_name = os.environ['ENV'] + "/cloudfront"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=os.environ['REGION']
    )

    try:
        # Retrieve the contents of the encrypted fields
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e
    else:
        # String
        if 'SecretString' in get_secret_value_response:
            return get_secret_value_response['SecretString']
        # Binary
        else:
            return base64.b64decode(get_secret_value_response['SecretBinary'])