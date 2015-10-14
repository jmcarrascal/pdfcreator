package ar.com.leafnoise.rest.config;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.springframework.context.annotation.Configuration;

@Provider
@Configuration
public class JacksonMapperProvider implements ContextResolver<ObjectMapper> {
	ObjectMapper mapper;

	public JacksonMapperProvider() {
		mapper = new ObjectMapper();
		mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, //
				false);
		mapper.configure(SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS, false);
	}

	@Override
	public ObjectMapper getContext(Class<?> arg0) {
		return mapper;

	}

}
