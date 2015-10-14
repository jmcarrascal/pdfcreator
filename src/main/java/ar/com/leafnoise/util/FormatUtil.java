package ar.com.leafnoise.util;

import java.math.BigDecimal;


public class FormatUtil {

	public static String llenarConCero(String s, int width) {
		String formattedString;

		// La serie es m�s corta que la anchura especificada,
		// por lo que tenemos que rellenarla con blancos.
		if (s.length() < width) {
			StringBuffer buffer = new StringBuffer(s);
			for (int i = s.length(); i < width; ++i) {
				buffer.append("0");
			}
			formattedString = buffer.toString();
		} else {
			formattedString = s.substring(0, width);
		}
		return formattedString;
	}

	public static Double castRemitoAnmat(String s) {
		Double result = 0d;
		try {
			String prefijo = s.substring(1, 5);
			String nr = s.substring(5, 13);
			nr = String.valueOf(Integer.parseInt(nr));
			prefijo = String.valueOf(Integer.parseInt(prefijo));
			String decimal = nr + "." + prefijo;
			result = Double.parseDouble(decimal);
		} catch (Exception e) {

		}
		return result;
	}

	public static Long formatCuit(String cuit) throws Exception {
		Long cuitFormated = 0l;
		System.out.println("Cuit " + cuit);
		cuit = cuit.trim().replaceAll("-", "");
		cuit = cuit.trim().replaceAll(" ", "");
		try {
			cuitFormated = Long.parseLong(cuit);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		return cuitFormated;
	}

	public static boolean validar(String cadena, Long[] valores) {

		char[] nroClave = cadena.toCharArray();
		int checksuma = 0;

		for (int i = 0; i < 11; i++) {
			checksuma += Integer.parseInt(String.valueOf(nroClave[i])) * i;
		}

		for (Long valor : valores) {
			System.out.println("comparo valor: " + valor + "checksuma ="
					+ checksuma);
			if (checksuma == valor)
				return true;
		}
		return false;
	}

	public static String getError(String valorInt) {
		if (valorInt != null) {
			int i = valorInt.indexOf("|", 1);
			while (i != -1) {
				valorInt = valorInt.substring(i);
				i = valorInt.indexOf("|", 1);

			}
			return valorInt.replaceFirst("\\|", "");
		} else {
			return null;
		}
	}

	public static String llenoConCeros(String valor, int longitud) {
		while (valor.length() < longitud) {
			valor = "0" + valor;
		}
		return valor;
	}

	public static String llenoDosCeros(String valor) {
		int valorN = 0;
		String result = "00";
		try {
			valorN = Integer.parseInt(valor);
			result = llenoConCeros(String.valueOf(valorN), 2);
		} catch (Exception e) {

		}
		return result;
	}

	public static double redondearEn2(double numero) {
		return Math.rint(numero * 100) / 100;
	}

	public static double redondearEn6(double numero) {
		return Math.rint(numero * 1000000) / 1000000;
	}

	public static String getSignoPorNegativoRow(Float valor) {
		if (valor < 0) {
			return "red";
		} else {
			return "black";
		}
	}

	public static String getSignoPorNegativoRow(Double valor) {
		if (valor < 0) {
			return "red";
		} else {
			return "black";
		}
	}

	public static BigDecimal getSaldoCalculado(Integer tipoComprob,
			BigDecimal saldo) {
		if (tipoComprob == 2 || tipoComprob == 4 || tipoComprob == 6
				|| tipoComprob == 10) {
			return saldo.multiply(BigDecimal.valueOf(-1l));
		} else {
			return saldo;
		}
	}

	public static BigDecimal getSaldoCalculado(Short factCtaCte,
			BigDecimal saldo) {

		return saldo.multiply(BigDecimal.valueOf(factCtaCte));

	}

	public static String getSignoRow(Integer tipoComprob) {
		if (tipoComprob == 2 || tipoComprob == 4 || tipoComprob == 6
				|| tipoComprob == 10) {
			return "red";
		} else {
			return "black";
		}
	}

}
