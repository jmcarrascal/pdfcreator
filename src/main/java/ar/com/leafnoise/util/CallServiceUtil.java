package ar.com.leafnoise.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class CallServiceUtil {
	
	public static String callRestSaveDataVirgilio (String url_service, String virgilioKey, String obj){
		String output = "";
		 try {			 
				URL url = new URL(url_service);
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setDoOutput(true);
				conn.setRequestMethod("POST");
				conn.setRequestProperty("Content-Type", "application/json");
				conn.setRequestProperty("Authorization",virgilioKey);
				OutputStream os = conn.getOutputStream();
				os.write(obj.getBytes());
				os.flush();
				if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
					throw new RuntimeException("Failed : HTTP error code : "
						+ conn.getResponseCode());
				}
				BufferedReader br = new BufferedReader(new InputStreamReader(
						(conn.getInputStream())));
				String temp_output = "";
				
				while ((temp_output = br.readLine()) != null) {
					output = output + temp_output ;
				}
				conn.disconnect();
		 
			  } catch (MalformedURLException e) {
		 
				e.printStackTrace();
		 
			  } catch (IOException e) {
		 
				e.printStackTrace();
			 }
		 return output;
	}
	
	public static String callRestItemForPage(String url_service){
		String output = "";
		 try {			 
				URL url = new URL(url_service);
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setDoOutput(true);
				conn.setRequestMethod("GET");
				conn.setRequestProperty("Content-Type", "application/json");				
				
				if (conn.getResponseCode() != 200) {
					throw new RuntimeException("Failed : HTTP error code : "
							+ conn.getResponseCode());
				}

				BufferedReader br = new BufferedReader(new InputStreamReader(
					(conn.getInputStream())));

				conn.disconnect();
		 
			  } catch (MalformedURLException e) {
		 
				e.printStackTrace();
		 
			  } catch (IOException e) {
		 
				e.printStackTrace();
			 }
		 return output;
	}


}
