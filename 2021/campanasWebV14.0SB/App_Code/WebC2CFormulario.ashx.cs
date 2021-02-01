using Oracle.DataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

using System.Web;
using System.Text;
using System.Globalization;

using System.Collections;
using System.Collections.ObjectModel;
using System.Threading;

using System.Net.Mail;
using System.Net;
using System.Reflection;
using System.IO;
using Jayrock.Json;


using log4net;
using ServiciosCampanas;


public class WebC2CFormulario : IHttpHandler
{
    private ILog log;
    private static Random rnd = new Random();

    public WebC2CFormulario()
        : base()
    {
        log4net.Config.XmlConfigurator.Configure();
        log = LogManager.GetLogger("IntegracionASBLogger");

    }

    public void ProcessRequest(HttpContext context)
    {

        string idLog = generateIdLog();

        if (context.Request.RequestType == "POST")
        {
            
            try
            {
                
                //Imprime Request
                string values = "";

                System.Configuration.ConnectionStringSettings connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["campanasConnection"];
                string connString = connectionString.ConnectionString;

                Agendamiento agendar = new Agendamiento(connString);
                GestionDAO g = new GestionDAO(connString);                

                try
                {
                    using (var reader = new StreamReader(context.Request.InputStream))
                    {
                        values = reader.ReadToEnd();
                    }

                    log.InfoFormat("[{0}] Request Recibido: {1}", idLog,  values);
                }
                catch (Exception ex)
                {
                    log.ErrorFormat("[{0}] Error al recuperar información de Request: {1}", idLog, ex.Message);
                }

                var encoding = context.Request.ContentEncoding;

                log.InfoFormat("[{0}] Encoding Request {0}", idLog, encoding);

                //tomar todos los parametros de Request.Params
                string numero_atencion = context.Request.Params["numero_atencion"];
                string dnis = context.Request.Params["DNIS"];
                string ani = context.Request.Params["ANI"];
                string rut_cliente = context.Request.Params["rut_cliente"];
                string fecha_nacimiento = context.Request.Params["fecha_nacimiento"];
                string nombres_cliente = context.Request.Params["nombres_cliente"];
                string apaterno_cliente = context.Request.Params["apaterno_cliente"];
                string amaterno_cliente = context.Request.Params["amaterno_cliente"];
                string telefono_fijo = context.Request.Params["telefono_fijo"];
                string telefono_movil = context.Request.Params["telefono_movil"];
                string email = context.Request.Params["email"];
                string direccion = context.Request.Params["direccion"];
                string comuna = context.Request.Params["comuna"];
                string region = context.Request.Params["region"];
                string tipo_requerimiento = context.Request.Params["tipo_requerimiento"];
                string numero_oferta = context.Request.Params["numero_oferta"];
                string nombre_oferta = context.Request.Params["nombre_oferta"];
                string precio_oferta = context.Request.Params["precio_oferta"];
                string categoria = context.Request.Params["categoria"];
                string origen = context.Request.Params["origen"];
                string codigo_equipo = context.Request.Params["codigo_equipo"];
                string codigo_plan = context.Request.Params["codigo_plan"];
                string fecha_agendamiento = context.Request.Params["fecha_agendamiento"];
                string tipo_solicitud = context.Request.Params["tipo_solicitud"];
                string privado = context.Request.Params["privado"];
                string procedencia = context.Request.Params["procedencia"];
                string default1 = context.Request.Params["default1"];
                string default2 = context.Request.Params["default2"];
                string default3 = context.Request.Params["default3"];
                string default4 = context.Request.Params["default4"];
                string default5 = context.Request.Params["default5"];

                string nombreCompleto = nombres_cliente + " " + apaterno_cliente + " " + amaterno_cliente;

                //Validando los datos
                string errors = "";
                if (IsValidLength(numero_atencion, 200, "numero_atencion", false) != "true")
                    errors = errors + IsValidLength(numero_atencion, 200, "numero_atencion", false) + "\n";

                if (IsValidLength(dnis, 200, "dnis", false) != "true")
                    errors = errors + IsValidLength(dnis, 200, "dnis", false) + "\n";

                if (IsValidLength(ani, 20, "ani", false) != "true")
                    errors = errors + IsValidLength(ani, 20, "ani", false) + "\n";

                if (IsValidLength(rut_cliente, 11, "rut", false) != "true")
                    errors = errors + IsValidLength(rut_cliente, 11, "rut", false) + "\n";

                if (IsFormatFechaNac_Date(fecha_nacimiento, true) != "true")
                    errors = errors + IsFormatFechaNac_Date(fecha_nacimiento, true) + "\n";

                if (IsValidLength(nombreCompleto, 100, "nombreCompleto") != "true")
                    errors = errors + IsValidLength(nombreCompleto, 100, "nombreCompleto") + "\n";

                if (IsValidLength(telefono_fijo, 20, "telefono_fijo") != "true")
                    errors = errors + IsValidLength(telefono_fijo, 20, "telefono_fijo") + "\n";

                if (IsValidLength(telefono_movil, 20, "telefono_movil") != "true")
                    errors = errors + IsValidLength(telefono_movil, 20, "telefono_movil") + "\n";

                if (IsValidLength(email, 200, "email") != "true")
                    errors = errors + IsValidLength(email, 200, "email") + "\n";

                if (IsValidLength(direccion, 200, "direccion") != "true")
                    errors = errors + IsValidLength(direccion, 200, "direccion") + "\n";

                if (IsValidLength(comuna, 40, "comuna") != "true")
                    errors = errors + IsValidLength(comuna, 40, "comuna") + "\n";

                if (IsValidLength(region, 20, "region") != "true")
                    errors = errors + IsValidLength(region, 20, "region") + "\n";

                if (IsValidLength(numero_oferta, 20, "numero_oferta") != "true")
                    errors = errors + IsValidLength(numero_oferta, 20, "numero_oferta") + "\n";

                if (IsValidLength(nombre_oferta, 200, "nombre_oferta") != "true")
                    errors = errors + IsValidLength(nombre_oferta, 200, "nombre_oferta") + "\n";

                if (IsValidLength(precio_oferta, 15, "precio_oferta") != "true")
                    errors = errors + IsValidLength(precio_oferta, 15, "precio_oferta") + "\n";

                if (IsValidLength(categoria, 200, "categoria") != "true")
                    errors = errors + IsValidLength(categoria, 200, "categoria") + "\n";

                if (IsValidLength(origen, 200, "origen") != "true")
                    errors = errors + IsValidLength(origen, 200, "origen") + "\n";

                if (IsValidLength(codigo_plan, 200, "codigo_plan") != "true")
                    errors = errors + IsValidLength(codigo_plan, 200, "codigo_plan") + "\n";

                if (IsValidLength(tipo_requerimiento, 200, "tipo_requerimiento", false) != "true")
                    errors = errors + IsValidLength(tipo_requerimiento, 200, "tipo_requerimiento") + "\n";

                if (IsValidLength(tipo_solicitud, 200, "tipo_solicitud", false) != "true")
                    errors = errors + IsValidLength(tipo_solicitud, 200, "tipo_solicitud") + "\n";

                if (IsValidLength(default1, 200, "default1") != "true")
                    errors = errors + IsValidLength(default1, 200, "default1") + "\n";

                if (IsValidLength(default2, 200, "default2") != "true")
                    errors = errors + IsValidLength(default2, 200, "default2") + "\n";

                if (IsValidLength(default3, 40, "default3") != "true")
                    errors = errors + IsValidLength(default3, 40, "default3") + "\n";

                if (IsValidLength(default4, 200, "default4") != "true")
                    errors = errors + IsValidLength(default4, 200, "default4") + "\n";                

                DataDenis parametroDataDenis = new DataDenis();

                parametroDataDenis = g.getNombreContactDesdeDNIS(dnis); //Recupera utilizando DNIS

                if (parametroDataDenis == null)
                {
                    errors = errors + string.Format("No es posible determinar la campanna a partir de DNIS: {0} - TIPO SOLICITUD: {1} - TIPO REQUERIMIENTO: {2}", dnis, tipo_solicitud, tipo_requerimiento);
                }

                int checkFechaAgendamiento = 0;    //0: Invalida;      1: Valor OK;            2: Sin Fecha

                if (string.IsNullOrEmpty(fecha_agendamiento))
                {
                    checkFechaAgendamiento = 2;
                }
                else
                {
                    if (IsFormat_Date(fecha_agendamiento) != "true")
                    {
                        checkFechaAgendamiento = 0;
                        errors = errors + IsFormat_Date(fecha_agendamiento) + "\n";
                    }
                    else
                    {
                        checkFechaAgendamiento = 1;
                    }
                }

                if (errors != "")
                {
                    context.Response.StatusCode = 422;
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(errors);
                    log.InfoFormat("[{0}] Response Code '{1}' - Message '{2}'", idLog, context.Response.StatusCode, errors);
                }
                else
                {
                    if (checkFechaAgendamiento == 2)  //Sin Fecha Agendamiendo
                    { 
                        DateTime now = DateTime.Now;
                        if (!"C2C".Equals(parametroDataDenis.tipo_solicitud)) 
                        {
                            log.InfoFormat("[{0}] Registro CMB sin fecha de agendamiento. Se setea default", idLog);
                            int deltaMinutos;
                            if (!Int32.TryParse(System.Configuration.ConfigurationManager.AppSettings["deltaMinutosRegistrosCMB"].ToString(), out deltaMinutos)){
                                deltaMinutos = 60;
                                log.WarnFormat("[{0}] No definido parámetro 'deltaMinutosRegistrosCMB'. Se utiliza default: 60", idLog);
                            }

                            fecha_agendamiento = dateTime2StringFormat(now.AddMinutes(deltaMinutos), "dd-MM-yy HH:mm:ss");
                        }
                    }
                    
                    C2C_FORM p = new C2C_FORM(); // value object p

                    p.tabla = parametroDataDenis.tabla;
                    p.pais = parametroDataDenis.pais;
                    p.callCenter = parametroDataDenis.callCenter;
                    p.familia = parametroDataDenis.familia;

                    p.numero_atencion = numero_atencion;
                    p.dnis = dnis;
                    p.ani = ani;
                    p.rut_cliente = rut_cliente;
                    p.fecha_nacimiento = (String.IsNullOrEmpty(fecha_nacimiento) ? "" : dateTime2StringFormat(DateTime.ParseExact(fecha_nacimiento, "dd-MM-yy", CultureInfo.InvariantCulture, DateTimeStyles.None), "yyyy-MM-dd"));
                    p.nombres_cliente = nombres_cliente;
                    p.apaterno_cliente = apaterno_cliente;
                    p.amaterno_cliente = amaterno_cliente;
                    p.telefono_fijo = telefono_fijo;
                    p.telefono_movil = telefono_movil;
                    p.email = email;
                    p.direccion = direccion;
                    p.comuna = comuna;
                    p.region = region;
                    p.tipo_requerimiento = tipo_requerimiento;
                    p.numero_oferta = numero_oferta;
                    p.nombre_oferta = nombre_oferta;
                    p.precio_oferta = precio_oferta;
                    p.categoria = categoria;
                    p.origen = origen;
                    p.codigo_equipo = codigo_equipo;
                    p.codigo_plan = codigo_plan;
                    p.fecha_agendamiento = fecha_agendamiento;
                    p.tipo_solicitud = parametroDataDenis.tipo_solicitud;
                    p.privado = privado;
                    p.procedencia = procedencia;
                    p.default1 = default1;
                    p.default2 = default2;
                    p.default3 = getCuartilDesdePrioridad(default3);
                    p.default4 = default4;
                    p.default5 = default5;
                    p.campaignName = parametroDataDenis.campaign;

                    JsonObject insertaRegistro = new JsonObject();

                    DateTime fechaParaAgendarRegistro = DateTime.Now;
                   
                    if (string.IsNullOrEmpty(p.fecha_agendamiento))  // Si no viene fecha 
                    {
                        // se debe insertar directo a la contact 
                        p.fecha_agendamiento = Utils.dateTime2StringHHmmss(fechaParaAgendarRegistro);                            
                        log.InfoFormat("[{0}] Se inserta para discado inmediato", idLog);
                    }
                    else
                    {
                        DateTime fechaAg = DateTime.ParseExact(p.fecha_agendamiento, "dd-MM-yy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None);
                        if (fechaParaAgendarRegistro > fechaAg)
                        {
                            p.fecha_agendamiento = Utils.dateTime2StringHHmmss(fechaParaAgendarRegistro);                               
                            log.InfoFormat("[{0}] Fecha Menor a la Actual. Se inserta para discado inmediato", idLog);
                        }
                        else
                        {
                            fechaParaAgendarRegistro = fechaAg;
                            log.InfoFormat("[{0}] Se inserta para la fecha y hora indicada", idLog);
                        }
                    }

                    Boolean canInsert = false;

                    try
                    {
                        using (GestionDAO gesDAO = new GestionDAO(connString))
                        {
                            insertaRegistro = gesDAO.SaveRegContact(p, "ASB", idLog);
                            canInsert = true;
                        }
                    }catch(Exception exInsert)
                    {
                        log.Error("[" + idLog + "] Error al Insertar el Registro", exInsert);
                    }
                    
                    if (canInsert && Convert.ToInt32(insertaRegistro["status"]) == 0)
                    {

                        //Llamar a la Agenda
                        Agendamiento servicioAgendamiento = new Agendamiento(connString);
                        string i3Identity = insertaRegistro["i3Identity"].ToString();
                        string telefono = p.ani;
                        string agente = null;
                        string campana = p.campaignName;

                        string respuesta = servicioAgendamiento.agregarAgendaASB(i3Identity, fechaParaAgendarRegistro, telefono, agente, campana);

                        if (respuesta != null && respuesta.Equals("OK"))
                        {
                            //dar respuesta al cliente
                            context.Response.ContentType = "text/plain";
                            context.Response.Write("Ok");
                            log.InfoFormat("[{0}] Response Code '{1}' - Message '{2}'", idLog, context.Response.StatusCode, "OK");
                        }
                        else
                        {
                            string msg = "Error al registrar la agenda del registro";
                            context.Response.StatusCode = 500;
                            context.Response.ContentType = "text/plain";
                            context.Response.Write(msg);
                            log.ErrorFormat("[{0}] Response Code '{1}' - Message '{2}'", idLog, context.Response.StatusCode, msg);
                        }
                    }else
                    {
                        string msg = "Error al insertar el registro";
                        context.Response.StatusCode = 500;
                        context.Response.ContentType = "text/plain";
                        context.Response.Write(msg);
                        log.ErrorFormat("[{0}] Response Code '{1}' - Message '{2}'", idLog, context.Response.StatusCode, msg);
                    }


                }                
            }
            catch (Exception exp)
            {
                //internal error
                context.Response.StatusCode = 500;
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.ContentType = "text/plain";
                context.Response.Write("Error no Controlado");
                log.ErrorFormat("[{0}] Internal Error - Message '{1}'", idLog, exp.Message);
                log.Error("Internal Error: ", exp);

            }
            finally
            {
                context.Response.End();
            }

        }
        else
        {
            context.Response.StatusCode = 405;
            context.Response.ContentType = "text/plain";
            context.Response.Write("Sólo se acepta invocación vía 'POST'");
            log.ErrorFormat("[{0}] Response Code '{1}' - Message '{2}'", idLog, context.Response.StatusCode, "Sólo se acepta invocación vía 'POST'");

        }        
    }

    private string getCuartilDesdePrioridad(string prioridad)
    {
        string cuartil = String.Empty;

        int prioridadInt = 0;

        if (int.TryParse(prioridad, out prioridadInt))
        {
            int q1Min = 75;
            int q1Max = 100;
            int q2Min = 50;
            int q2Max = 74;
            int q3Min = 25;
            int q3Max = 49;
            int q4Min = 0;
            int q4Max = 24;

            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["q1_min"], out q1Min);
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["q1_max"], out q1Max);
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["q2_min"], out q2Min);
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["q2_max"], out q2Max);
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["q3_min"], out q3Min);
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["q3_max"], out q3Max);
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["q4_min"], out q4Min);
            int.TryParse(System.Configuration.ConfigurationManager.AppSettings["q4_max"], out q4Max);

            if (q1Min <= prioridadInt && prioridadInt <= q1Max) cuartil = "Q1";
            else if (q2Min <= prioridadInt && prioridadInt <= q2Max) cuartil = "Q2";
            else if (q3Min <= prioridadInt && prioridadInt <= q3Max) cuartil = "Q3";
            else if (q4Min <= prioridadInt && prioridadInt <= q4Max) cuartil = "Q4";
            else cuartil = System.Configuration.ConfigurationManager.AppSettings["qDefault"];
        }
        else
        {
            cuartil = System.Configuration.ConfigurationManager.AppSettings["qDefault"];
        }

        return cuartil;
    }

    private void EnviarCorreo()
    {
        /*
        int smtpPort = int.Parse(System.Configuration.ConfigurationManager.AppSettings["smtpPort"]);
        string smtpHost = System.Configuration.ConfigurationManager.AppSettings["smtpHost"];
        string usuario = System.Configuration.ConfigurationManager.AppSettings["smtpUser"];
        string pass = System.Configuration.ConfigurationManager.AppSettings["smtpPass"];

        SmtpClient client = new SmtpClient(smtpHost,smtpPort);
        //especificar usuario y contraseña
        client.Credentials = new NetworkCredential(usuario, pass);
        
        //en caso de tu servidor de correo implemente ssl
        //client.EnableSsl = true;

        MailMessage m = new MailMessage();
        m.From =  new MailAddress("icadminm@inn.com");
        m.To.Add(new MailAddress("responsable@movistar.cl"));
        m.Subject = "error en x";
        m.Body = "este mensaje blah blah";
        //en caso del que el mensaje sea en html y quieras indicarlo
        //m.IsBodyHtml = true;


        client.Send(m);
        */

        //client.Send("icadminm@inn.com", "responsable@movistar.cl", "error en x", "este mensaje blah blah");

    }

    //********************Validaciones********************


    private string IsValidLength(string texto, int longitud, string nombrecampo, bool aceptNull = true)
    {
        if (!aceptNull && string.IsNullOrEmpty(texto))
        {
            return string.Format("No se recibio el campo '{0}'", nombrecampo);
        }

        else if (texto.Length > longitud)
            return string.Format("El campo '{0}' con valor: '{1}', excede la longitud definida de {2} caracteres", nombrecampo, texto, longitud);
        else return "true";
    }

    private string IsFormat_Date(string fecha)
    {
        string format = "dd-MM-yy HH:mm:ss";
        DateTime result;
        if (DateTime.TryParseExact(fecha, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out result))
            return "true";
        else return string.Format("La fecha agendamiento '{0}' no está en el formato definido 'dd-MM-yy HH:mm:ss'", fecha);
    }

    private string IsFormatFechaNac_Date(string fecha, bool aceptNull)
    {
        if (aceptNull && string.IsNullOrEmpty(fecha)){
            return "true";
        }
        string format = "dd-MM-yy";
        DateTime result;
        if (DateTime.TryParseExact(fecha, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out result))
            return "true";
        else return string.Format("La fecha de nacimiento '{0}' no está en el formato definido 'dd-MM-yy'", fecha);
    }

    public string dateTime2StringFormat(DateTime? d, string format)
    {
        if (d == null) return "";
        string strDate = String.Format("{0:" + format + "}", d);
        return String.Format(strDate);
    }

    private static string generateIdLog()
    {
        string nums = "0123456789";
        string idLog = "";
        for (int i = 0; i < 10; i++) idLog += nums.Substring(rnd.Next(nums.Length), 1);
        return idLog;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
     

    
}