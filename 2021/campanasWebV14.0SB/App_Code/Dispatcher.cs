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
using System.Net;
using System.Text;
using System.IO;

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
            //IntegracionASB iASB = new IntegracionASB(connectionString.ConnectionString);
            //iASB.SetTimer();
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
	
	// Modifico Brito 21-01-2021	
	[WebMethod]
    [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
    public string log_transferencia_IVRDCP(string ID_llamada, string num_cliente, string ticket, string estatus, string descripcion)
    {
        var resultado = "";
        var detalle = "";

        string nom_log = @"" + System.Configuration.ConfigurationManager.AppSettings["nom_log"];
        string filePath_A = @"" + System.Configuration.ConfigurationManager.AppSettings["log_tranferecnia_A"];
        string filePath_B = @"" + System.Configuration.ConfigurationManager.AppSettings["log_tranferecnia_B"];
        int dia = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["dias"]);

        string fecha_hoy = DateTime.Today.ToString("yyyyMMdd");
        string fecha_actual = DateTime.Today.ToString("yyyy/MM/dd");
        string hora_actual = DateTime.Now.ToString("HH:mm:ss");

        string fecha = DateTime.Today.ToString(fecha_actual +" " + hora_actual);

        fecha_actual = fecha_actual + " " + hora_actual;
		fecha_actual = fecha_actual.Replace("-", "");

        DateTime nuevaFecha = Convert.ToDateTime(fecha);
        nuevaFecha = nuevaFecha.AddDays(-dia);        

        string nom_archivo = fecha_hoy + "_" + nom_log + ".txt";
        //string nom_archivo_anterior = fecha_hoy + "_" + nom_log + ".txt";

        try
        {
            foreach (var item in Directory.GetFiles(filePath_A))
            {
                if (new FileInfo(item).CreationTime <= nuevaFecha)
                {
                    File.Delete(item);
                }
            }

            foreach (var item in Directory.GetFiles(filePath_B))
            {
                if (new FileInfo(item).CreationTime <= nuevaFecha)
                {
                    File.Delete(item);
                }
            }

            if (!File.Exists(filePath_A + nom_archivo))
            {
                using (StreamWriter sw = File.CreateText(filePath_A + nom_archivo))
                {
                    sw.WriteLine("Fecha y hora | ID Llamada | Número cliente | Ticket | Estatus | Descripción");
                    sw.WriteLine(fecha_actual + "|" + ID_llamada + "|" + num_cliente + "|" + ticket + "|" + estatus + "|" + descripcion);
                    sw.Close();
                };               

                detalle = "Se creo con exito el reporte" + nom_archivo;
            }
            else
            {
                using (StreamWriter sr = File.AppendText(filePath_A + nom_archivo))
                {
                    sr.WriteLine(fecha_actual + "|" + ID_llamada + "|" + num_cliente + "|" + ticket + "|" + estatus+ "|" + descripcion);
                    sr.Close();
                };

                detalle = "Se agrego información al reporte" + nom_archivo;
            }

            if (!File.Exists(filePath_B + nom_archivo))
            {
                using (StreamWriter sw = File.CreateText(filePath_B + nom_archivo))
                {
                    //sw.WriteLine("ID Llamada | Número cliente | Fecha y hora | Ticket | Estatus");
					sw.WriteLine("Fecha y hora | ID Llamada | Número cliente | Ticket | Estatus | Descripción");
                    sw.WriteLine(fecha_actual + "|" + ID_llamada + "|" + num_cliente + "|" + ticket + "|" + estatus + "|" + descripcion);
                    sw.Close();
                };

                detalle = "Se creo con exito el reporte" + nom_archivo;
            }
            else
            {
                using (StreamWriter sr = File.AppendText(filePath_B + nom_archivo))
                {
                    sr.WriteLine(fecha_actual + "|" + ID_llamada + "|" + num_cliente + "|" + ticket + "|" + estatus + "|" + descripcion);
                    sr.Close();
                };

                detalle = "Se agrego información al reporte" + nom_archivo;
            }

            resultado = "{ \"status\" : \"OK\", \"detalle\" : \"" + detalle + "\"}";
        }
        catch (Exception ex)
        {
            detalle = ex.Message.ToString();
            detalle = detalle.Replace("\r\n", "").Replace("\n", "").Replace("\r", "");
            resultado = "{ \"status\" : \"NOK\", \"detalle\" : \"" + detalle + "\"}";
        }

        return resultado;
    }
	
	[WebMethod]
    [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
    public string log_valida_tikect_IVRDCP(string ID_llamada, string num_cliente, string ticket, string estatus, string descripcion)
    {
        var resultado = "";
        var detalle = "";

        string nom_log = @"" + System.Configuration.ConfigurationManager.AppSettings["nom_log_ticket"];
        string filePath_A = @"" + System.Configuration.ConfigurationManager.AppSettings["log_tranferecnia_A"];
        string filePath_B = @"" + System.Configuration.ConfigurationManager.AppSettings["log_tranferecnia_B"];
        int dia = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["dias"]);

        string fecha_hoy = DateTime.Today.ToString("yyyyMMdd");
        string fecha_actual = DateTime.Today.ToString("yyyy/MM/dd");
        string hora_actual = DateTime.Now.ToString("HH:mm:ss");

        string fecha = DateTime.Today.ToString(fecha_actual +" " + hora_actual);

        fecha_actual = fecha_actual + " " + hora_actual;
		fecha_actual = fecha_actual.Replace("-", "");

        DateTime nuevaFecha = Convert.ToDateTime(fecha);
        nuevaFecha = nuevaFecha.AddDays(-dia);        

        string nom_archivo = fecha_hoy + "_" + nom_log + ".txt";
        //string nom_archivo_anterior = fecha_hoy + "_" + nom_log + ".txt";

        try
        {
            foreach (var item in Directory.GetFiles(filePath_A))
            {
                if (new FileInfo(item).CreationTime <= nuevaFecha)
                {
                    File.Delete(item);
                }
            }

            foreach (var item in Directory.GetFiles(filePath_B))
            {
                if (new FileInfo(item).CreationTime <= nuevaFecha)
                {
                    File.Delete(item);
                }
            }

            if (!File.Exists(filePath_A + nom_archivo))
            {
                using (StreamWriter sw = File.CreateText(filePath_A + nom_archivo))
                {
                    sw.WriteLine("Fecha y hora | ID Llamada | Número cliente | Ticket | Estatus | Descripción");
                    sw.WriteLine(fecha_actual + "|" + ID_llamada + "|" + num_cliente + "|" + ticket + "|" + estatus + "|" + descripcion);
                    sw.Close();
                };               

                detalle = "Se creo con exito el reporte" + nom_archivo;
            }
            else
            {
                using (StreamWriter sr = File.AppendText(filePath_A + nom_archivo))
                {
                    sr.WriteLine(fecha_actual + "|" + ID_llamada + "|" + num_cliente + "|" + ticket + "|" + estatus+ "|" + descripcion);
                    sr.Close();
                };

                detalle = "Se agrego información al reporte" + nom_archivo;
            }

            if (!File.Exists(filePath_B + nom_archivo))
            {
                using (StreamWriter sw = File.CreateText(filePath_B + nom_archivo))
                {
                    //sw.WriteLine("ID Llamada | Número cliente | Fecha y hora | Ticket | Estatus");
					sw.WriteLine("Fecha y hora | ID Llamada | Número cliente | Ticket | Estatus | Descripción");
                    sw.WriteLine(fecha_actual + "|" + ID_llamada + "|" + num_cliente + "|" + ticket + "|" + estatus + "|" + descripcion);
                    sw.Close();
                };

                detalle = "Se creo con exito el reporte" + nom_archivo;
            }
            else
            {
                using (StreamWriter sr = File.AppendText(filePath_B + nom_archivo))
                {
                    sr.WriteLine(fecha_actual + "|" + ID_llamada + "|" + num_cliente + "|" + ticket + "|" + estatus + "|" + descripcion);
                    sr.Close();
                };

                detalle = "Se agrego información al reporte" + nom_archivo;
            }

            resultado = "{ \"status\" : \"OK\", \"detalle\" : \"" + detalle + "\"}";
        }
        catch (Exception ex)
        {
            detalle = ex.Message.ToString();
            detalle = detalle.Replace("\r\n", "").Replace("\n", "").Replace("\r", "");
            resultado = "{ \"status\" : \"NOK\", \"detalle\" : \"" + detalle + "\"}";
        }

        return resultado;
    }
}
