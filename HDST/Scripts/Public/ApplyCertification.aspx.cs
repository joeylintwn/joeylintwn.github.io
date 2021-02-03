using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Security.Cryptography;
using System.IO;

namespace Hsds.Public
{
    public partial class ApplyCertification : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            DataTable tb, ntb;
            var db = DBApi.Controllers.DBController.GetDB("", "");
            string uid= "";
            string test = "";
            try
            {
                if (!string.IsNullOrEmpty(Request["uid"]))
                {
                    var u = Request["uid"].ToString();
                     uid = Md5Decrypt(u);
                    tb = db.AddTable("SysUser", "Select * from SysUser Where AccountID='" + uid + "'");
                    if (tb.Rows.Count > 0)
                    {
                        DataRow row;
                        row = tb.Rows[0];
                        test = row["Status"].ToString();
                        row["Status"] = "1";
                        row["isPublic"] = 1;
                     
                        db.UpdateTable(tb.TableName);
                        ntb = db.AddTable("SysUser", "Select * from SysUser Where AccountID='" + uid + "'");
                        if (ntb.Rows[0]["Status"].ToString() == "1")
                        {
                            Response.Write("帳號已啟用");
                        }
                        else
                            Response.Write("帳號啟用失敗");
                    }
                    else
                    {
                        Response.Write("驗證失敗");
                    }
                }
                else
                {
                    Response.Write("error");
                }
            }
            catch (Exception ex)
            {
                Response.Write(test + ex.ToString());
            }

        }
        #region MD5加密
        /// <summary>   
        /// MD5加密   
        /// </summary>   
        /// <param name="strSource">需要加密的字串</param>   
        /// <returns>MD5加密後的字串</returns>   
        public static string Md5Encrypt(string strSource)
        {
            //把字串放到byte陣列中   
            byte[] bytIn = System.Text.Encoding.Default.GetBytes(strSource);
            //建立加密物件的金鑰和偏移量       
            byte[] iv = { 102, 16, 93, 156, 78, 4, 218, 32 };//定義偏移量   
            byte[] key = { 55, 103, 246, 79, 36, 99, 167, 3 };//定義金鑰 
                                                              //例項DES加密類   
            DESCryptoServiceProvider mobjCryptoService = new DESCryptoServiceProvider();
            mobjCryptoService.Key = iv;
            mobjCryptoService.IV = key;
            ICryptoTransform encrypto = mobjCryptoService.CreateEncryptor();
            //例項MemoryStream流加密密檔案   
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            CryptoStream cs = new CryptoStream(ms, encrypto, CryptoStreamMode.Write);
            cs.Write(bytIn, 0, bytIn.Length);
            cs.FlushFinalBlock();
            return System.Convert.ToBase64String(ms.ToArray());
        }
        #endregion
        #region MD5解密
        /// <summary>   
        /// MD5解密   
        /// </summary>   
        /// <param name="Source">需要解密的字串</param>   
        /// <returns>MD5解密後的字串</returns>   
        public static string Md5Decrypt(string Source)
        {

            //將解密字串轉換成位元組陣列   
            byte[] bytIn = System.Convert.FromBase64String(Source);
            //給出解密的金鑰和偏移量，金鑰和偏移量必須與加密時的金鑰和偏移量相同   
            byte[] iv = { 102, 16, 93, 156, 78, 4, 218, 32 };//定義偏移量   
            byte[] key = { 55, 103, 246, 79, 36, 99, 167, 3 };//定義金鑰 
            DESCryptoServiceProvider mobjCryptoService = new DESCryptoServiceProvider();
            mobjCryptoService.Key = iv;
            mobjCryptoService.IV = key;
            //例項流進行解密   
            System.IO.MemoryStream ms = new System.IO.MemoryStream(bytIn, 0, bytIn.Length);
            ICryptoTransform encrypto = mobjCryptoService.CreateDecryptor();
            CryptoStream cs = new CryptoStream(ms, encrypto, CryptoStreamMode.Read);
            StreamReader strd = new StreamReader(cs, Encoding.Default);
            return strd.ReadToEnd();

        }
        #endregion
    }
}