
using System;
using System.Web;
using System.Text;
using System.Globalization;
using System.IO;
using log4net;



public class TestConfirmacionVenta : IHttpHandler
{
    private ILog log;


    public TestConfirmacionVenta()
        : base()
    {
        log4net.Config.XmlConfigurator.Configure();
        log = LogManager.GetLogger("CampanasLogger");

    }

    public void ProcessRequest(HttpContext context)
    {
        
        try
        {

            

            try
            {
                string id = context.Request["id"];
                string flagTransfer = context.Request["flagTransfer"];
                string ani = context.Request["ani"];
                string dniscc2 = context.Request["dniscc2"];
                string dniscc1 = context.Request["dniscc1"];
                string idagente = context.Request["idagente"];
                log.InfoFormat("Request Recibido: id {0} - flagTransfer {1} - ani {2} - dniscc2 {3} - dniscc1 {4} - idagente {5} ", id, flagTransfer, ani, dniscc2, dniscc1, idagente);

            }
            catch (Exception ex)
            {
                log.Error("Error al recuperar información de Request"+ex.Message);
            }

            context.Response.StatusCode = 200;
            context.Response.ContentType = "text/plain";
            context.Response.Write("Ok");   
            log.InfoFormat("Response Code '{0}' - Message '{1}'", context.Response.StatusCode, "OK");
                               
        }
        catch (Exception exp)
        {
            //internal error
            context.Response.StatusCode = 500;
            context.Response.ContentEncoding = Encoding.UTF8;
            context.Response.ContentType = "text/plain";
            context.Response.Write("Error no Controlado");
            log.ErrorFormat("Internal Error - Message '{0}'", exp.Message);
            log.Error("Internal Error: ", exp);
         

        }
        finally
        {
            context.Response.End();
        }

               
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
     

    
}