package ar.com.leafnoise.util.exception;

public class GenerationTimerException extends Exception {

	private int intError;

	public GenerationTimerException(int intErrNo) {
		intError = intErrNo;
	}

	GenerationTimerException(String strMessage) {
		super(strMessage);
	}

	public String toString() {
		return "ApplicationException[" + intError + "]";
	}
}
