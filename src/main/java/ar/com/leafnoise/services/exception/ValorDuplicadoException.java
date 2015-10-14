package ar.com.leafnoise.services.exception;

public class ValorDuplicadoException extends Exception {

	private final String mensaje = "Valor Duplicado: ";
	private String complemento;

	public ValorDuplicadoException(String contenido) {
		this.complemento = contenido;
	}

	@Override
	public String getMessage() {
		return mensaje + complemento;
	}
}
