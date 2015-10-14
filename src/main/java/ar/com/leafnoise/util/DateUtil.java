package ar.com.leafnoise.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;


public final class DateUtil {

	public static final String TIMEZONE_ARG="America/Argentina/Buenos_Aires";
	
	public static final String DATE_FORMAT = ("dd-MM-yyyy");
	private static final SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
	public static final String DATE_FORMAT_SHORT = ("dd/MM/yyyy");
	
	public static final String DATE_FORMAT_SHORT_GUION = ("dd-MM-yyyy");
	private static final SimpleDateFormat sdf_short = new SimpleDateFormat(DATE_FORMAT_SHORT);
	final static long MILLSECS_PER_DAY = 24 * 60 * 60 * 1000; //Milisegundos al día 
	
	private static final SimpleDateFormat sdf_sk= new SimpleDateFormat("yyyy-dd-MM");
	public static final String DATE_FORMAT_SERIALIZE = ("yyyy-MM-dd");
	
	public static Date getCurrentDate() {
		return new Date(System.currentTimeMillis());
	}

	
	public final static Long getFormatDateLong(Date date) {
		try {
			return date.getTime();
		} catch (Exception e) {
		}
		return null;
	}
	
	public final static Date getDate(String strDate) {
		try {
			return sdf.parse(strDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public final static Date getDateShortDateStr(String strDate) {
		try {
			return sdf_short.parse(strDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public final static String getDate(Date date) {
			return sdf.format(date);
	}
	
	public final static String getDateSk(Date date) {
		return sdf_short.format(date);
}
	
	public final static Date getDateSkString(Date date) {
		String temp = sdf_short.format(date);
		
		try {
			return sdf_short.parse(temp);
		} catch (ParseException e) {

			return null;
		}
		
}
	
	public final static Date getDate(short dia, short mes, short anio){
	 Calendar cal = Calendar.getInstance();
	 mes = (short) (mes - 1);
	 cal.set(anio, mes, dia);
	 return cal.getTime();
	}
	
	public final static int getDay (Date date){
		Calendar calendario = Calendar.getInstance();
		calendario.setTime(date); // fecha es el Date de antes.
		int dia = calendario.get(Calendar.DAY_OF_MONTH);
		return dia;
	}
	
	public final static Date setDay (Date date, int dia){
		Calendar calendario = Calendar.getInstance();
		calendario.setTime(date); // fecha es el Date de antes.
		calendario.set(Calendar.DATE, 1);
		return calendario.getTime();
	}
	
	public final static int getMonth (Date date){
		Calendar calendario = Calendar.getInstance();
		calendario.setTime(date); // fecha es el Date de antes.
		int mes = calendario.get(Calendar.MONTH);
		return mes;
	}
	
	public final static int getYear (Date date){
		Calendar calendario = Calendar.getInstance();
		calendario.setTime(date); // fecha es el Date de antes.
		int anio = calendario.get(Calendar.YEAR);
		return anio;
	}
	
	public final static Date getMinDate (Date date1, Date date2){
		if (date1.before(date2)){
            return date1;
        }
        else{
            return date2;
        }
	}
	
	//Restarle dias a una fecha determinada
    //@param fch La fecha
    //@param dias Dias a restar
    //@return La fecha restando los dias
    public final static Date restarFechasDias(Date date, int dias) {
    	Calendar calendario = Calendar.getInstance();
		calendario.setTime(date); // fecha es el Date de antes.
        //cal.setTimeInMillis(date.getTime());
		calendario.add(Calendar.DATE, -dias);
		return calendario.getTime();
    }
    
	//Sumaerle dias a una fecha determinada
    //@param fch La fecha
    //@param dias Dias a sumar
    //@return La fecha sumando los dias
    public final static Date sumarFechasDias(Date date, int dias) {
    	Calendar calendario = Calendar.getInstance();
		calendario.setTime(date); // fecha es el Date de antes.
        //cal.setTimeInMillis(date.getTime());
		calendario.add(Calendar.DATE, +dias);
		return calendario.getTime();
    }
    
    public final static int diferenciaDias(Date fechaAnterior, Date fechaPosterior){
    	return (int) ((fechaAnterior.getTime() - fechaPosterior.getTime() )/ MILLSECS_PER_DAY);
    }
    
    public final static Date setHour (Date date, int hora, int minutos, int segundos ){
		Calendar calendario = Calendar.getInstance();
		calendario.setTime(date); // fecha es el Date de antes.
		calendario.set(Calendar.HOUR_OF_DAY, hora);
		calendario.set(Calendar.MINUTE, minutos);
		calendario.set(Calendar.SECOND, segundos);
		return calendario.getTime();
	}
    
    public final static boolean esBisiesto(int anio){
    	GregorianCalendar calendar = new GregorianCalendar();

    	if (calendar.isLeapYear(anio))
    		return true;
    	else
    		return false;
    }
    
    public final static Date restarSeg(Date date, int seg) {
    	Calendar calendario = Calendar.getInstance();
		calendario.setTime(date); // fecha es el Date de antes.
		calendario.add(Calendar.SECOND, -seg);
		return calendario.getTime();
    }
    
    public static String getFormatedSTDDate (Timestamp date){
		if (date != null){
			SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
			return (date==null)?" - ":format.format(new Date(date.getTime()));
		}else{
			return null;
		}

	}

	public static String CastStringToDateShort(String get_vencimiento) {
		Date date=getDateShortDateStr(get_vencimiento);
		if (date != null){
			SimpleDateFormat format = new SimpleDateFormat("MM/yy");
			return (date==null)?" - ":format.format(new Date(date.getTime()));
		}else{
			return null;
		}
		
	}
	
	public static String getFormatedDate (Timestamp date){
		try{
		if (date != null){
			SimpleDateFormat format = new SimpleDateFormat("dd'/'MM'/'yyyy");
			return (date==null)?" - ":format.format(new Date(date.getTime()));
		}else{
			return "";
		}
		}catch(Exception e){
			System.out.println("ERROR PARSEO DE FECHA");
			return "";
		}
		
	}
	public static String getFormatedHour (Timestamp date){
		if (date != null){
			SimpleDateFormat format = new SimpleDateFormat("HH:MM");
			return (date==null)?" - ":format.format(new Date(date.getTime()));
		}else{
			return "";
		}

	}
}
