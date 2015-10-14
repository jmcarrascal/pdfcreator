package ar.com.leafnoise.services.impl.test;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

import org.codehaus.jettison.json.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class TestJsonSimple {

	public static void main(String[] args) {
		
		
		try {
			//Get String by File
			JSONArray array = new JSONArray();
			
			JSONObject json = new JSONObject();
			JSONObject json1 = new JSONObject();
			json.put("pais", "Argentina");
			json.put("pais_id", "21");
			json1 = new JSONObject();
			json1.put("pais", "Bolivia");
			json1.put("pais_id", "22");

			array.put(json);
			array.put(json1);
			
			
			System.out.println(array.toString());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		
		

	}
	
	private static String readFile(String fileName) throws IOException {
	    BufferedReader br = new BufferedReader(new FileReader(fileName));
	    try {
	        StringBuilder sb = new StringBuilder();
	        String line = br.readLine();

	        while (line != null) {
	            sb.append(line);
	            sb.append("\n");
	            line = br.readLine();
	        }
	        return sb.toString();
	    } finally {
	        br.close();
	    }
	}

}
