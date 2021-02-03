<%@ WebHandler Language="C#" Class="tgosProxy" %>

using System;
using System.Web;

public class tgosProxy : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "image/png";
        String[] p = context.Request.Url.ToString().Split('?');

        String URL = p[1] + "?" + p[2] + "&appid=YphHDe6qCx3MHu5/psMA/YAOQkdN9D7Ix2U9RpX0hTq0RbUqCCqcGQ==&apikey=cGEErDNy5yN/1fQ0vyTOZrghjE+jIU6ulFrL7v5mkpMfi6+f1Vdy5DFqq7JtjUTa2HUpT/Z8ed6wIpLOlqYEGPFPHIoQKuYP28V+qNhVDbDdKAvJtcOsN9N0XSRznfHMYYXXQSM5GyfztzMG4058pSiB0qOU8o03RCZjuuTY1S9YFQpuszNE+xZm1pUrw5xS4QgBPaJY0L22jOs7y14yuZqeNY0f7PS/HGuH1EH5lIWK+rjANb+2N7kkwkQGjSfnLX8YpXo93Lg/A29U8fjxNHdkZ/tJbeX8+yD9QtqUp76v6sKzfbJUo+qB9vVO/4OPZ0OZjFEAsOBJ8BG8Xa4m1CR+/ekK4rA8tkb9I8rhhgSSOdILbjED0W6RF6p1+ka0L8OfgZZcf3Twl6W6gBGv8Jy1BsPEKqreLUrE1IbtYZnXOcp+3J7B66klfxHEaDccigi/mRuw0ROdVzPpnz7zG+fx3+J6dgWxGi2ZrSfLXYuLLDkZ5iBwhhMFITUPMSleIlDTcDa/TzsqdMNVqmfhTzReNvTNXiR+NvfBztbCrMS7H4pemO22WLvkHlYMXAV+Rx6/ZM3jgHGIQxccYvJ8cLGbzTVtbj2iw0u2cevvbw37uHZUt0eLrRT69cVxcHPb";

        System.Net.WebClient wc = new System.Net.WebClient();
        wc.Headers.Add("Referer", "http://map.tgos.tw/TGOSimpleViewer/Web/Map/TGOSimpleViewer_Map.aspx");
        byte[] b = wc.DownloadData(URL);
        context.Response.BinaryWrite(b);
        context.Response.End();


    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}