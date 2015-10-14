
package ar.com.leafnoise.rest;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ar.com.leafnoise.services.ICommonService;


@Component 
@Path("/common")
public class CommonRestService {
 
	@Autowired
	private ICommonService commonService;
	
	@GET
	@Path("/isAlive")
	@Produces(MediaType.APPLICATION_JSON)
	public String isAlive() {	
						
		return "isAlive";
	}
	
	
}