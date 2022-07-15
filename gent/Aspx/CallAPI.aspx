<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CallAPI.aspx.cs" Inherits="JPRO.CallAPI" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">



    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- iCheck -->
    <link href="../vendors/iCheck/skins/flat/green.css" rel="stylesheet">
    <!-- bootstrap-wysiwyg -->
    <link href="../vendors/google-code-prettify/bin1/prettify.min.css" rel="stylesheet">
    <!-- Select2 -->
    <link href="../vendors/select2/dist/css/select2.min.css" rel="stylesheet">
    <!-- Switchery -->
    <link href="../vendors/switchery/dist/switchery.min.css" rel="stylesheet">
    <!-- starrr -->
    <link href="../vendors/starrr/dist/starrr.css" rel="stylesheet">
    <!-- bootstrap-daterangepicker -->
    <link href="../vendors/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="模擬廠商上傳資料到水利行政" />
            <asp:Button ID="Button2" runat="server" OnClick="Button2_Click" Text="昕傳1. 登入取token" />
            <asp:Button ID="Button3" runat="server" OnClick="Button3_Click" Text="水利行政抓巡查資料" />
            <input id="Button4" type="button" value="button" /><asp:Button ID="Button5" runat="server" OnClick="Button5_Click" Text="抓自動雨量站" />
            <br />
            <asp:Button ID="Button6" runat="server" OnClick="Button6_Click" Text="呼叫ashx" />
            <br />
            <asp:Label ID="Label1" runat="server"></asp:Label>
        </div>
            <p>
        <input id="Button7" type="button" value="button" />
    </p>
    </form>
    <!-- jQuery -->
    <script src="../vendors/jquery/dist/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="../vendors/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <!-- FastClick -->
    <script src="../vendors/fastclick/lib/fastclick.js"></script>
    <!-- NProgress -->
    <script src="../vendors/nprogress/nprogress.js"></script>
    <!-- bootstrap-progressbar -->
    <script src="../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js"></script>
    <!-- iCheck -->
    <script src="../vendors/iCheck/icheck.min.js"></script>
    <!-- bootstrap-daterangepicker -->
    <script src="../vendors/moment/min/moment.min.js"></script>
    <script src="../vendors/bootstrap-daterangepicker/daterangepicker.js"></script>
    <!-- bootstrap-wysiwyg -->
    <script src="../vendors/bootstrap-wysiwyg/js/bootstrap-wysiwyg.min.js"></script>
    <script src="../vendors/jquery.hotkeys/jquery.hotkeys.js"></script>
    <script src="../vendors/google-code-prettify/src/prettify.js"></script>
    <!-- jQuery Tags Input -->
    <script src="../vendors/jquery.tagsinput/src/jquery.tagsinput.js"></script>
    <!-- Switchery -->
    <script src="../vendors/switchery/dist/switchery.min.js"></script>
    <!-- Select2 -->
    <script src="../vendors/select2/dist/js/select2.full.min.js"></script>
    <!-- Parsley -->
    <script src="../vendors/parsleyjs/dist/parsley.min.js"></script>
    <!-- Autosize -->
    <script src="../vendors/autosize/dist/autosize.min.js"></script>
    <!-- jQuery autocomplete -->
    <script src="../vendors/devbridge-autocomplete/dist/jquery.autocomplete.min.js"></script>
    <!-- starrr -->
    <script src="../vendors/starrr/dist/starrr.js"></script>



    <script type="text/javascript">

        $("#Button4").click(function () {
            alert("Handler for .click() called.");
            $.ajax({
                type: 'POST',
                url: 'https://wra.e-land.gov.tw/HDST/WaterAdmin/Check/QueryCheckList?obj.CheckType=A&obj.CheckFreq=1&obj.FailureType=2&obj.SDate=2021%2F12%2F01&obj.EDate=2021%2F12%2F31&obj.T03=',
                //url: 'https://wra.e-land.gov.tw/HDST/WaterAdmin/Check/QueryCheckList',
                dataType: "json",
                /*
                data: {
                    CheckType: "A",
                    CheckFreq: "1",
                    FailureType: "2",
                    SDate: "2021/12/01",
                    EDate: "2021/12/31",
                },
                */
                success: function (data) {


                    console.log('成功回傳');
                    console.log(data);

                },
                error: function (e, r, h) {
                    if (e.status !== 520)
                        console.log(' (status:' + r + ' error:' + h + ')');
                }
            });



        });

        $("#Button7").click(function () {
            alert("Handler for .click() called.");
            $.ajax({
                type: 'POST',
                url: 'http://localhost/gentweb/ashx/昕傳介接.ashx',
                dataType: "text",
                /*
                data: {
                    CheckType: "A",
                    CheckFreq: "1",
                    FailureType: "2",
                    SDate: "2021/12/01",
                    EDate: "2021/12/31",
                },
                */
                success: function (data) {

                    console.log('成功回傳');
                    console.log(data);

                },
                error: function (e, r, h) {
                    if (e.status !== 520)
                        console.log(' (status:' + r.toString() + ' error:' + h.toString() + ')');
                }
            });
        });
    </script>


</body>
</html>
