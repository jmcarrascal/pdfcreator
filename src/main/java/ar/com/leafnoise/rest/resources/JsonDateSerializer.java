package ar.com.leafnoise.rest.resources;

import java.io.IOException;
import java.lang.ref.SoftReference;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;
import org.springframework.stereotype.Component;

import ar.com.leafnoise.util.DateUtil;

@Component
public class JsonDateSerializer extends JsonSerializer<Date> {

	private static final ThreadLocal<SoftReference<DateFormat>> tl = new ThreadLocal<SoftReference<DateFormat>>();

	private static DateFormat getDateFormat() {
		SoftReference<DateFormat> ref = tl.get();
		if (ref != null) {
			DateFormat result = ref.get();
			if (result != null) {
				return result;
			}
		}
		TimeZone.setDefault(TimeZone.getTimeZone("GMT-3:00"));
		DateFormat result = new SimpleDateFormat(DateUtil.DATE_FORMAT_SERIALIZE);
//		result.setTimeZone(TimeZone.getTimeZone("UTC"));

		ref = new SoftReference<DateFormat>(result);
		tl.set(ref);
		return result;
	}

	@Override
	public void serialize(Date date, JsonGenerator gen,
			SerializerProvider provider) throws IOException,
			JsonProcessingException {
		DateFormat formatter = getDateFormat();

		String formattedDate = formatter.format(date);
		formattedDate=formattedDate+"T03:00:00.000Z";
		gen.writeString(formattedDate);

	}

}