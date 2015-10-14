package ar.com.leafnoise.rest.resources;

import javax.ws.rs.core.Response;

public class ResultResponse {
	private String message;
	private Response response;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Response getResponse() {
		return response;
	}

	public void setResponse(Response response) {
		this.response = response;
	}
}
