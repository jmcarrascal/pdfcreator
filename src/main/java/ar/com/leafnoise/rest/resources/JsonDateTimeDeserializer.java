package ar.com.leafnoise.rest.resources;

import java.io.IOException;
import java.lang.ref.SoftReference;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.JsonDeserializer;
import org.springframework.stereotype.Component;

@Component
public class JsonDateTimeDeserializer extends JsonDeserializer<Date> {

	private static final ThreadLocal<SoftReference<DateFormat>> tl = new ThreadLocal<SoftReference<DateFormat>>();

	private static DateFormat getDateFormat() {
		SoftReference<DateFormat> ref = tl.get();
		if (ref != null) {
			DateFormat result = ref.get();
			if (result != null) {
				return result;
			}
		}
		DateFormat result = new SimpleDateFormat("yyyy/MM/dd HH:mm:ssZ");
		result.setTimeZone(TimeZone.getTimeZone("GMT"));
		ref = new SoftReference<DateFormat>(result);
		tl.set(ref);
		return result;
	}


	@Override
	public Date deserialize(JsonParser jsonparser,
			DeserializationContext deserializer) throws IOException,
			JsonProcessingException {

		String date = jsonparser.getText();
		try {
			DateFormat formatter = getDateFormat();
			return formatter.parse(date);
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
	}

}