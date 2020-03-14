resource "aws_iam_role" "lambda_encrypt" {
  name = "lambda_encrypt"

  policy = "${file("iam/policy.json")}"
}
resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = "${file("iam/lambdarole.json")}"
}

local{
    lambda_zip = "outputs/lambda_ev.zip"
}

data "archive_file" "init" {
  type        = "zip"
  source_file = "lambda_encrypt.js"
  output_path = "${local.lambda_zip}"
}
resource "aws_lambda_function" "test_lambda" {
  filename      = "${local.lambda_zip}"
  function_name = "lambda_ev"
  role          = "${aws_iam_role.lambda_role.arn}"
  handler       = "lambda_encryp.addBucketVersioning"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = "${filebase64sha256("lambda_function_payload.zip")}"

  runtime = "nodejs12.x"


}
