package ar.com.leafnoise.wrapper;

import java.util.Date;

public class FiltersMasterSamplePart {
	
	private Date fechaDesde;
	private Date fechaHasta;
	private String nroChasis;
	private Boolean historial;
	
	public Date getFechaDesde() {
		return fechaDesde;
	}
	public void setFechaDesde(Date fechaDesde) {
		this.fechaDesde = fechaDesde;
	}
	public Date getFechaHasta() {
		return fechaHasta;
	}
	public void setFechaHasta(Date fechaHasta) {
		this.fechaHasta = fechaHasta;
	}
	public String getNroChasis() {
		return nroChasis;
	}
	public void setNroChasis(String nroChasis) {
		this.nroChasis = nroChasis;
	}
	public Boolean getHistorial() {
		return historial;
	}
	public void setHistorial(Boolean historial) {
		this.historial = historial;
	}

}
