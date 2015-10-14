package ar.com.leafnoise.util;

public enum BooleanUtil {

	S('S'), N('N');

	private char value;
	
	private BooleanUtil() {

	}

	private BooleanUtil(char value) {
		this.value = value;
	}

	public static char getTrue() {
		return S.value;
	}

	public static char getFalse() {
		return N.value;
	}
}
