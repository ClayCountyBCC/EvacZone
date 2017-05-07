using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EvacZone.Models;

namespace EvacZone.Controllers
{
  public class EvacController : ApiController
  {
    //// GET: api/Evac
    //public IEnumerable<string> Get()
    //{
    //    return new string[] { "value1", "value2" };
    //}

    //// GET: api/Evac/5
    //public string Get(int id)
    //{
    //    return "value";
    //}

    // POST: api/Evac
    public List<FoundAddress> Post(SearchAddress sa)
    {
      return FoundAddress.Find(sa);
    }

    //// PUT: api/Evac/5
    //public void Put(int id, [FromBody]string value)
    //{
    //}

    //// DELETE: api/Evac/5
    //public void Delete(int id)
    //{
    //}
  }
}
