$apiKey = "AIzaSyCrn0RDL1BV4wbOGRCbMQha4dBbme0zT4M"
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey"

$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "hi"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri $url -Method Post -ContentType 'application/json' -Body $body
Write-Host "Response:"
$response | ConvertTo-Json -Depth 10 