<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JoeForm1.aspx.cs" Inherits="JPRO.JoeForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="抓自動雨量站資料" />
        </div>
        <asp:Label ID="Label1" runat="server"></asp:Label>
    </form>
</body>
</html>
