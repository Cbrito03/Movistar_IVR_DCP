using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using JSONHTTPServices;
using ServiciosCampanas;
using System.Runtime.CompilerServices;

[WebService(Namespace = "http://campanas.sixbell.cl/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.ComponentModel.ToolboxItem(false)]
[System.Web.Script.Services.ScriptService]
public class Dispatcher : System.Web.Services.WebService {
    private static bool inicializo = false;
    private static Dictionary<string, JSONHTTPServices.ServiceModule> modules;
    private static Object lockObj = new Object();

    [MethodImpl(MethodImplOptions.Synchronized)]
    private static void inicializa() {
        lock (lockObj)
        {
            if (inicializo) return;
            System.Configuration.ConnectionStringSettings connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["campanasConnection"];
            modules = new Dictionary<string, JSONHTTPServices.ServiceModule>();
            modules.Add("ges", new Gestion(connectionString.ConnectionString));            
            inicializo = true;
        }
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = false)]
    public string dispatch(string serviceName, string jArgs) {
        if (!inicializo) inicializa();
        OperationResponse res = null;
        int p = serviceName.IndexOf(".");
        if (p >= 0) {
            string moduleName = serviceName.Substring(p + 1);
            ServiceModule module = null;
            try {
                module = modules[moduleName];
            } catch (Exception) { }
            if (module == null) res = OperationResponse.FromError("No se definió un servidor para el módulo '" + moduleName + "'");
            else res = module.call(serviceName.Substring(0, p), jArgs);
        } else {
            res = OperationResponse.FromError("No se indicó la extensión con el nombre del módulo");
        }
        return res.ToJSONString();
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = false)]
    public string validaTicket(string ticket, string SendObj, string url_ws)
    {
        string statusDescription = "";

        var request = (HttpWebRequest)WebRequest.Create(url_ws);

        var data = Encoding.ASCII.GetBytes(SendObj);

        request.Method = "POST";
        request.ContentType = "text/xml";
        request.ContentLength = data.Length;

        using (var stream = request.GetRequestStream())
        {
            stream.Write(data, 0, data.Length);
        }

        var response = (HttpWebResponse)request.GetResponse();

        var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
        statusDescription = responseString;

        var res = statusDescription;

        return res;
    }
    
    [WebMethod]
    [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
    public string sendCallIVRDCP(string SendObj, string url_ws)
    {
        var resultado = "Hola";
        var request = (HttpWebRequest)WebRequest.Create(url_ws);
        var DataObject = SendObj;
        var data = Encoding.ASCII.GetBytes(DataObject);
        request.Method = "POST";
        request.ContentType = "application/json";       
        request.Headers["Authorization"] = "Basic NGI0YjJhMzctN2EwZS00NGY4LTkwODctMzcwNzVhYmQ3YWY5OmI0ZmM3N2IxLTJiN2UtNDI0Ni04NjQzLTc2Zjg0N2IwZDUyZg==";
        //request.Headers["Content-Type"] = "application/json";

        try
        {
            request.ContentLength = data.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(data, 0, data.Length);
            dataStream.Close();
            WebResponse response = request.GetResponse();
            Stream resultStream = response.GetResponseStream();

            StreamReader reader = new StreamReader(resultStream);
            string readerResponse = reader.ReadToEnd();
            var result = readerResponse;

            resultado = result;
        }
        catch (Exception ex)
        {
            resultado = ex.Message.ToString();
        }
        
        
        return resultado;
    }
}
