# 1. Get current User PATH
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")

# 2. Check if PowerShell path is already there
$psPath = "C:\Windows\System32\WindowsPowerShell\v1.0\"

if ($userPath -notmatch [regex]::Escape($psPath)) {
    Write-Host "Adding PowerShell to User PATH..."
    # 3. Append PowerShell path
    $newUserPath = $userPath
    if (-not $newUserPath.EndsWith(";")) {
        $newUserPath += ";"
    }
    $newUserPath += $psPath

    # 4. Save updated PATH
    [Environment]::SetEnvironmentVariable("PATH", $newUserPath, "User")
    Write-Host "Successfully updated User PATH!"
} else {
    Write-Host "PowerShell path is already in the User PATH."
}

Write-Host "========================================================"
Write-Host "REPAIR COMPLETE. PLEASE RESTART THE IDE/AI PROCESS NOW."
Write-Host "========================================================"
