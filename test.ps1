$body = @{
    message = "hi"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:5000/api/chat' -Method Post -ContentType 'application/json' -Body $body
Write-Host "Response:"
$response | ConvertTo-Json 