<%
dim fs,f, fname,city
name=Request.Form("name")
value=Request.Form("value")
set fs=Server.CreateObject("Scripting.FileSystemObject")
set f=fs.OpenTextFile("C:\inetpub\wwwroot\SSI\SSI\data1",8,true,-1)
f.WriteLine(Date()&" "&time()&","&name&","&value)
f.Close
set f=Nothing
set fs=Nothing
%>