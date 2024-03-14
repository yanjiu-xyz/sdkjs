CD /D %~dp0
call npm install -g grunt-cli
call npm ci

call grunt tester --level=WHITESPACE_ONLY
xcopy /k/c/y/q/i "..\deploy\sdkjs\slide" "..\..\Dep.Tests\standardtester\app\sdkjs\slide"
rmdir /s/q "..\..\Dep.Tests\standardtester\out\check_develop"
CD "..\..\Dep.Tests\standardtester\scripts"
call python.exe check.py
pause