function Get-HostCapabilities {
   <#
    .SYNOPSIS
    This module will

    Function: Get-HostCapabilities
    Author: Matthew Toussain (@0sm0s1z)
    License: MIT
    Required Dependencies: None
    Optional Dependencies: None

    .DESCRIPTION
      This module will

    .EXAMPLE
    C:\PS> Get-HostCapabilities

   #>
   Param
   (
    [Parameter(Position = 0, Mandatory = $False)]
    [string]
    $UserList = ""
   )

   #Write-Host -ForegroundColor "yellow" "[*] Now enumerating Host Capabilities."
   #$currenttime = Get-Date
   #Write-Host -ForegroundColor "yellow" "[*] Current date and time: $currenttime"

   # Record hostname and full username here:				contoso\bhis
   #Write-Host "[+] User context: $env:UserDomain\$env:UserName"
   $usercontext = "$env:UserDomain\$env:UserName"

   # User can run cmd.exe						Windows key "cmd.exe" enter	Do you have a command prompt?
   try
   {
       Start-Process -FilePath "cmd.exe" -Verb open
       #Write-Host "[+] CMD is executabe!"
       $execcmdexe = "allowed"
   }
   catch
   {
      #Write-Host -ForegroundColor "red" "[-] CMD failed to run."
      $execcmdexe = "blocked"
   }

   # User run powershell.exe						powershell -nop	Do you have a PS > prompt?
   try
   {
       Start-Process -FilePath "powershell.exe" -Verb open -ArgumentList "nop"
       #Write-Host "[+] PowerShell is executabe!"
       $execpshexe = "allowed"
   }
   catch
   {
      #Write-Host -ForegroundColor "red" "[-] PowerShell failed to run."
      $execpshexe = "blocked"
   }

   # User can run 'net' commands						net localgroup adminstrators	Is your user in the group?
   try
   {
       Start-Process -FilePath "net.exe"
       #Write-Host "[+] NET is executabe!"
       $execnetexe = "allowed"
   }
   catch
   {
      #Write-Host -ForegroundColor "red" "[-] NET failed to run."
      $execnetexe = "blocked"
   }
   # User can run 'wmic' commands						wmic os list brief	Did it work?
   try
   {
       Start-Process -FilePath "wmic.exe" -Verb open
       #Write-Host "[+] WMIC is executabe!"
       $execwmicexe = "allowed"
   }
   catch
   {
      #Write-Host -ForegroundColor "red" "[-] WMIC failed to run."
      $execwmicexe = "blocked"
   }
   # User has local admin rights
   # net user your_username or [ for /F "tokens=2 delims=\\" %i in ('whoami') do net user %i ]	Check [Local|Global] Group Memberships
   $admin = Get-LocalGroupMember -Name Administrators | where Name -eq "$env:UserDomain\$env:UserName"
   if($admin)
   {
       #Write-Host "[+] User is localadmin!"
       $islocadmin = "allowed"
   }
   else
   {
      #Write-Host -ForegroundColor "red" "[-] User is NOT localadmin."
      $islocadmin = "blocked"
   }
   # Office Macros were enabled Open WordMacroPoC.docm	If "Enable Content" button shows, this test passes.
   #Write-Host -ForegroundColor "red" "[!] Word macro test not enabled! Manual testing needed."
   # Office Macros could be enabled by user						Open WordMacroPoC.docm	If clicking "Enable Content" button works,  # this test fails

   # User can run non-standard EXE	hello_bhis_pyinstaller.exe and HelloBHIS_dotnet2.exe are harmless "hello    # world" samples.
   #Write-Host -ForegroundColor "red" "[!] Non-standard EXE test not enabled! Manual testing needed."




   # Report
   #Write-Host -ForegroundColor "yellow" "[*] Host Capabilities Report:"
   #Write-Host "-----------------------------"

   $hcap = New-Object -TypeName PSObject

   $hcap | Add-Member -MemberType NoteProperty -Name UserContext -Value $usercontext
   $hcap | Add-Member -MemberType NoteProperty -Name ExecCmd -Value $execcmdexe
   $hcap | Add-Member -MemberType NoteProperty -Name ExecPsh -Value $execpshexe
   $hcap | Add-Member -MemberType NoteProperty -Name ExecNet -Value $execnetexe
   $hcap | Add-Member -MemberType NoteProperty -Name ExecWmic -Value $execwmicexe
   $hcap | Add-Member -MemberType NoteProperty -Name LocalAdmin -Value $islocadmin


   $hcap | ConvertTo-Json
}
function Get-EgressPorts {
   <#
    .SYNOPSIS
    This module will

    Function: Get-HostCapabilities
    Author: Matthew Toussain (@0sm0s1z)
    License: MIT
    Required Dependencies: None
    Optional Dependencies: None

    .DESCRIPTION
      This module will

    .EXAMPLE
    C:\PS> Get-HostCapabilities

   #>

   # Egress Ports
   $ports = @()
   $portnum = 0

   1..1024 | % {
     $test= new-object system.Net.Sockets.TcpClient

     $wait = $test.beginConnect("allports.exposed",$_,$null,$null)
     $resp = ($wait.asyncwaithandle.waitone(250,$false))

     if($test.Connected)
     {
        $portnum = $portnum + 1
        $ports += $_
     }
   }

   #ICMP Outbound
   $icmp = ping 8.8.8.8 | select-string TTL | measure
   if ($icmp.Count -gt 0){$OutboundICMP = "allowed"}

   $ecap = New-Object -TypeName PSObject
   $ecap | Add-Member -MemberType NoteProperty -Name OpenPortNum -Value $portnum
   $ecap | Add-Member -MemberType NoteProperty -Name OpenPorts -Value $ports
   $ecap | Add-Member -MemberType NoteProperty -Name OutboundICMP -Value $OutboundICMP
   $ecap | ConvertTo-Json
}
