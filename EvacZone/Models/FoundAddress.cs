using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using Dapper;

namespace EvacZone.Models
{
  public class FoundAddress
  {
    private LatLong _ll = new LatLong();
    public string EvacZone { get; set; }
    public string WholeAddress { get; set; }
    public string City { get; set; }
    public string Zip { get; set; }
    public double XCoord { get; set; }
    public double YCoord { get; set; }
    public LatLong ToLatLong
    {
      get
      {
        if (!_ll.IsTested)
        {
          _ll = new LatLong(XCoord, YCoord);
          return _ll;
        }
        else
        {
          return _ll;
        }
      }
    }

    public FoundAddress()
    {

    }

    public static List<FoundAddress> Find(SearchAddress sa)
    {
      //DynamicParameters dp = new DynamicParameters();
      //dp.Add("@Street", street);
      //dp.Add("@Street", house);
      sa.street = sa.street.ToUpper();
      string query = $@"
        SELECT 
        ISNULL(E.EvacLevel, 'None') AS EvacZone, 
        WholeAddress,
        City,
        Zip,
        XCoord,
        YCoord
        FROM (
	        SELECT UPPER(WholeAddress) AS WholeAddress, 
          Community AS City,
          Zip,
          XCoord,
          YCoord,
          Shape FROM ADDRESS_SITE 
	        WHERE UPPER(WholeAddress) like '%' + @street + '%'
		        AND House = @house
		        AND Active='Y'
	        ) AS A
        LEFT OUTER JOIN EVACUATIONZONES E ON E.Shape.STIntersects(A.Shape) = 1";
      try
      {
        using (IDbConnection db = new SqlConnection(ConfigurationManager.ConnectionStrings["GIS"].ConnectionString))
        {
          return (List<FoundAddress>)db.Query<FoundAddress>(query, sa);
        }
      }
      catch (Exception ex)
      {
        return null;
      }
    }
  }
}