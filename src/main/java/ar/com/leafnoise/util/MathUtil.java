package ar.com.leafnoise.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class MathUtil {

	public static double redondear(double numero)
	{
	       return Math.rint(numero*100)/100;
	}
	
	public static double redondearEn2(double numero)
	{
	       return Math.rint(numero*100)/100;
	}
	
	public static double redondearEn3(double numero)
	{
	       return Math.rint(numero*1000)/1000;
	}
	
	public static double redondearEn4(double numero)
	{
	       return Math.rint(numero*10000)/10000;
	}
	public static BigDecimal redondearEn2BD(BigDecimal numero){		
		BigDecimal big = numero.setScale(2, RoundingMode.HALF_UP);
		return big;
	}
	
	public static BigDecimal redondearEn4BD(BigDecimal numero){		
		BigDecimal big = numero.setScale(4, RoundingMode.HALF_UP);
		return big;
	}
	
	public static double redondearEn6(double numero)
	{
	       return Math.rint(numero*1000000)/1000000;
	}

	public static BigDecimal getPorcentajeEnCadena(BigDecimal[] cadena)	{
		BigDecimal resto = new BigDecimal(100);
		BigDecimal cien = new BigDecimal(100);
		BigDecimal result;
		for(BigDecimal por:cadena){
			resto = resto.subtract(resto.multiply(por).divide(cien));
		}
	    result = cien.subtract(resto);
		return result;
	}
	
	public static boolean esPar(int x) {
		if ((x % 2) == 0) {
			return true;
		}
 
		return false;
	}

	
}
